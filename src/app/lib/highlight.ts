import {
  findContiguousMatches,
  fuzzyPositions,
  MAX_FUZZY_SPAN_FACTOR,
  type MatchRange,
} from "./search";

export interface HighlightedMatch {
  /** One <mark> per text node the match spans — a match may cross inline elements. */
  marks: HTMLElement[];
}

export interface HighlightResult {
  matches: HighlightedMatch[];
  cleanup: () => void;
}

const HIGHLIGHT_ATTR = "data-deckme-highlight";
const SKIPPED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SVG",
  "MARK",
]);

interface TextSegment {
  node: Text;
  start: number;
}

/** Collect every text node inside `container` that is worth highlighting. */
function collectTextNodes(container: HTMLElement): TextSegment[] {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const segments: TextSegment[] = [];
  let offset = 0;
  let current = walker.nextNode();

  while (current) {
    const node = current as Text;
    const text = node.nodeValue ?? "";
    const parent = node.parentElement;
    const eligible =
      text.trim().length > 0 &&
      parent !== null &&
      !SKIPPED_TAGS.has(parent.tagName) &&
      parent.closest("svg") === null;

    if (eligible) {
      segments.push({ node, start: offset });
      offset += text.length;
    }
    current = walker.nextNode();
  }

  return segments;
}

/** Turn a list of character positions into contiguous ranges. */
function groupPositions(positions: number[]): MatchRange[] {
  if (positions.length === 0) return [];
  const ranges: MatchRange[] = [];
  let start = positions[0];
  let previous = positions[0];

  for (let i = 1; i < positions.length; i++) {
    if (positions[i] === previous + 1) {
      previous = positions[i];
      continue;
    }
    ranges.push({ start, end: previous + 1 });
    start = previous = positions[i];
  }
  ranges.push({ start, end: previous + 1 });
  return ranges;
}

/**
 * Ranges for one term: contiguous hits anywhere in the text, or — when the term
 * is not present verbatim — a fuzzy subsequence hit inside a single text node.
 */
function rangesForTerm(text: string, segments: TextSegment[], term: string): MatchRange[] {
  const contiguous = findContiguousMatches(text, term);
  if (contiguous.length > 0) return contiguous;

  const ranges: MatchRange[] = [];
  for (const segment of segments) {
    const nodeText = segment.node.nodeValue ?? "";
    const positions = fuzzyPositions(nodeText, term);
    if (!positions || positions.length === 0) continue;

    // Reject scattered subsequence hits that span unrelated words.
    const span = positions[positions.length - 1] - positions[0] + 1;
    if (span > term.length * MAX_FUZZY_SPAN_FACTOR) continue;

    for (const range of groupPositions(positions)) {
      ranges.push({ start: range.start + segment.start, end: range.end + segment.start });
    }
  }
  return ranges;
}

/** Wrap [start, end) of a text node in a <mark> and return it. */
function wrapRange(node: Text, start: number, end: number): HTMLElement | null {
  const parent = node.parentNode;
  if (!parent || end <= start) return null;

  const middle = node.splitText(start);
  middle.splitText(end - start);
  const mark = document.createElement("mark");
  mark.setAttribute(HIGHLIGHT_ATTR, "true");
  parent.insertBefore(mark, middle);
  mark.appendChild(middle);
  return mark;
}

/** Unwrap every highlight previously applied inside `container`. */
export function clearHighlights(container: HTMLElement): void {
  const marks = container.querySelectorAll(`mark[${HIGHLIGHT_ATTR}]`);
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });
}

/**
 * Highlight every occurrence of `terms` inside `container`.
 * The returned cleanup restores the original text nodes.
 */
export function highlightTerms(
  container: HTMLElement,
  terms: string[],
): HighlightResult {
  clearHighlights(container);

  const segments = collectTextNodes(container);
  if (segments.length === 0 || terms.length === 0) {
    return { matches: [], cleanup: () => clearHighlights(container) };
  }

  const text = segments.map((segment) => segment.node.nodeValue ?? "").join("");

  const ranges: MatchRange[] = [];
  for (const term of terms) {
    ranges.push(...rangesForTerm(text, segments, term));
  }

  if (ranges.length === 0) {
    return { matches: [], cleanup: () => clearHighlights(container) };
  }

  // Map every range onto the text nodes it covers.
  const perNode = new Map<number, { start: number; end: number; match: number }[]>();
  ranges.forEach((range, matchIndex) => {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const nodeStart = segment.start;
      const nodeEnd = nodeStart + (segment.node.nodeValue ?? "").length;
      const start = Math.max(range.start, nodeStart);
      const end = Math.min(range.end, nodeEnd);
      if (start >= end) continue;
      const list = perNode.get(i) ?? [];
      list.push({ start: start - nodeStart, end: end - nodeStart, match: matchIndex });
      perNode.set(i, list);
    }
  });

  const matches: HighlightedMatch[] = ranges.map(() => ({ marks: [] }));

  perNode.forEach((list, nodeIndex) => {
    // Split from the end so the earlier offsets stay valid.
    list.sort((a, b) => b.start - a.start);
    for (const item of list) {
      const mark = wrapRange(segments[nodeIndex].node, item.start, item.end);
      if (mark) matches[item.match].marks.push(mark);
    }
  });

  matches.forEach((match) => {
    match.marks.sort((a, b) => {
      const position = a.compareDocumentPosition(b);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  });

  return { matches, cleanup: () => clearHighlights(container) };
}
