import { useEffect, useMemo, useRef, useState } from "react";
import type { NoteContent } from "../../lib/mockData";
import { filterNotes, termsOf } from "../../lib/search";
import { highlightTerms, type HighlightedMatch } from "../../lib/highlight";
import { NoteCard } from "./NoteCard";
import { ScrollToTop } from "../ScrollToTop";
import { SubjectToolbar } from "../SubjectToolbar";

interface NotesPanelProps {
  notes: NoteContent[];
  /** Lessons available in the picker, derived from the notes themselves. */
  lessons: string[];
  query: string;
  onQueryChange: (query: string) => void;
  selectedLesson: string | null;
  onLessonChange: (lesson: string | null) => void;
}

export function NotesPanel({
  notes,
  lessons,
  query,
  onQueryChange,
  selectedLesson,
  onLessonChange,
}: NotesPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<HighlightedMatch[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const terms = useMemo(() => termsOf(query), [query]);
  const visibleNotes = useMemo(
    () => filterNotes(notes, selectedLesson, terms),
    [notes, selectedLesson, terms],
  );

  // Highlight every match inside the rendered notes.
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const result = highlightTerms(container, terms);
    setMatches(result.matches);
    setActiveIndex(0);
    return result.cleanup;
  }, [terms, visibleNotes]);

  // Paint the active match so it stands out from the other hits.
  useEffect(() => {
    matches.forEach((match, index) => {
      match.marks.forEach((mark) => {
        mark.classList.toggle("deckme-match-active", index === activeIndex);
      });
    });
  }, [matches, activeIndex]);

  const goToMatch = (delta: number) => {
    if (matches.length === 0) return;
    const current = activeIndex >= matches.length ? 0 : activeIndex;
    const next = (current + delta + matches.length) % matches.length;
    setActiveIndex(next);
    matches[next]?.marks[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const status =
    terms.length === 0
      ? `${visibleNotes.length} note${visibleNotes.length === 1 ? "" : "s"}`
      : matches.length === 0
        ? "No matches"
        : `${activeIndex + 1} of ${matches.length}`;

  return (
    <div className="space-y-6">
      <SubjectToolbar
        query={query}
        onQueryChange={onQueryChange}
        lessons={lessons}
        selectedLesson={selectedLesson}
        onLessonChange={onLessonChange}
        status={status}
        onPrevious={() => goToMatch(-1)}
        onNext={() => goToMatch(1)}
        previousLabel="Previous match"
        nextLabel="Next match"
        canNavigate={matches.length > 0}
      />

      {/* Notes */}
      <div ref={contentRef} className="space-y-6">
        {visibleNotes.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {notes.length === 0
              ? "This subject has no notes yet."
              : "No notes match the current filters."}
          </p>
        ) : (
          visibleNotes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}
