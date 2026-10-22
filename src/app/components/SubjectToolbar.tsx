import { ChevronDown, ChevronUp, Search, Shuffle, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SubjectToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  lessons: string[];
  selectedLesson: string | null;
  onLessonChange: (lesson: string | null) => void;
  /** Counter between the navigation buttons, e.g. "1 of 5" or "Card 3 of 8". */
  status: string;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel: string;
  nextLabel: string;
  canNavigate: boolean;
  /** Deck only — restarts the session with a fresh order. */
  onShuffle?: () => void;
}

export function SubjectToolbar({
  query,
  onQueryChange,
  lessons,
  selectedLesson,
  onLessonChange,
  status,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  canNavigate,
  onShuffle,
}: SubjectToolbarProps) {
  return (
    <div className="sticky top-0 z-20 flex flex-col gap-3 bg-background/95 py-3 backdrop-blur-sm sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onNext();
            } else if (event.key === "Escape") {
              onQueryChange("");
            }
          }}
          placeholder="Search…"
          aria-label="Search"
          className="pl-9 pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            title="Clear search"
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={selectedLesson ?? "all"}
          onValueChange={(value) => onLessonChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-44" size="sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All lessons</SelectItem>
            {lessons.map((lesson) => (
              <SelectItem key={lesson} value={lesson}>
                {lesson}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onPrevious}
          disabled={!canNavigate}
          title={previousLabel}
          aria-label={previousLabel}
        >
          <ChevronUp className="size-4" />
        </Button>

        <span className="min-w-20 text-center text-sm tabular-nums text-muted-foreground">
          {status}
        </span>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onNext}
          disabled={!canNavigate}
          title={nextLabel}
          aria-label={nextLabel}
        >
          <ChevronDown className="size-4" />
        </Button>

        {onShuffle && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onShuffle}
            className="gap-1.5"
            title="Shuffle deck"
          >
            <Shuffle className="size-4" />
            Shuffle
          </Button>
        )}
      </div>
    </div>
  );
}
