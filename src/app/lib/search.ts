import type { AnkiCard, NoteContent } from "./mockData";

export interface MatchRange {
  start: number;
  end: number;
}

/** Split a raw query into individual search terms. */
export function termsOf(query: string): string[] {
  return query.trim().split(/\s+/).filter(Boolean);
}

/** Case-insensitive contiguous occurrences of `term` inside `text`. */
export function findContiguousMatches(text: string, term: string): MatchRange[] {
  const ranges: MatchRange[] = [];
  if (!term) return ranges;
  const haystack = text.toLowerCase();
  const needle = term.toLowerCase();
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    ranges.push({ start: index, end: index + needle.length });
    index = haystack.indexOf(needle, index + needle.length);
  }
  return ranges;
}

/**
 * A fuzzy hit has to stay tight. Without this, any query matches almost any
 * text as a loose subsequence ("debit" would match "fundamentals … Equity").
 */
export const MAX_FUZZY_SPAN_FACTOR = 3;

/**
 * Fuzzy (subsequence) match: every character of `query` appears in `text`, in order.
 * Returns the matched character indexes, or null when the query does not match.
 */
export function fuzzyPositions(text: string, query: string): number[] | null {
  if (!query) return [];
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  const positions: number[] = [];
  let cursor = 0;
  for (const char of needle) {
    const index = haystack.indexOf(char, cursor);
    if (index === -1) return null;
    positions.push(index);
    cursor = index + 1;
  }
  return positions;
}

/** True when `term` appears in `text` literally, or as a tight fuzzy subsequence. */
export function matchesTerm(text: string, term: string): boolean {
  const haystack = text.toLowerCase();
  const needle = term.toLowerCase();
  if (!needle) return true;
  if (haystack.includes(needle)) return true;

  const positions = fuzzyPositions(haystack, needle);
  if (!positions || positions.length === 0) return false;
  const span = positions[positions.length - 1] - positions[0] + 1;
  return span <= needle.length * MAX_FUZZY_SPAN_FACTOR;
}

/** True when `text` contains every term, either literally or as a fuzzy subsequence. */
export function matchesAllTerms(text: string, terms: string[]): boolean {
  if (terms.length === 0) return true;
  return terms.every((term) => matchesTerm(text, term));
}

/** Flatten a note's content — whatever its type — into plain searchable text. */
export function noteToText(note: NoteContent): string {
  return [note.lesson, note.topic, note.subtopic ?? "", flattenContent(note.content)]
    .filter(Boolean)
    .join(" ");
}

function flattenContent(content: NoteContent["content"]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) =>
        typeof item === "string" ? item : Object.values(item).join(" "),
      )
      .join(" ");
  }
  return "";
}

/** Notes belonging to `lesson` (when set) that match every search term. */
export function filterNotes(
  notes: NoteContent[],
  lesson: string | null,
  terms: string[],
): NoteContent[] {
  return notes.filter((note) => {
    if (lesson && note.lesson !== lesson) return false;
    return matchesAllTerms(noteToText(note), terms);
  });
}

/** Flatten a deck card into plain searchable text. */
export function cardToText(card: AnkiCard): string {
  return [card.lesson, card.tag, card.front, flattenContent(card.back)]
    .filter(Boolean)
    .join(" ");
}

/** Deck cards matching every search term. */
export function filterCards(cards: AnkiCard[], terms: string[]): AnkiCard[] {
  if (terms.length === 0) return cards;
  return cards.filter((card) => matchesAllTerms(cardToText(card), terms));
}
