import { useParams, useOutletContext } from "react-router";
import { useEffect, useState, useMemo } from "react";
import {
  getSubjectData, initializeDeckStats, saveDeckStats, saveViewedTime,
  loadDeckSession, saveDeckSession, shuffleArray,
  type DeckStats, type AnkiCard,
} from "../lib/mockData";
import { filterCards, termsOf } from "../lib/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { NotesPanel } from "../components/notes/NotesPanel";
import { DeckCard } from "../components/DeckCard";
import { SubjectToolbar } from "../components/SubjectToolbar";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Eye, EyeOff, RotateCcw, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface OutletContext {
  sidebarOpen: boolean;
  zenMode: boolean;
  setZenMode: (zen: boolean) => void;
}

interface CompletionCardProps {
  correct: number;
  wrong: number;
  onRetry: () => void;
  onGoToNotes: () => void;
}

function CompletionCard({ correct, wrong, onRetry, onGoToNotes }: CompletionCardProps) {
  const total = correct + wrong;
  const percentage = total > 0 ? (correct / total) * 100 : 0;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Deck Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">{percentage.toFixed(0)}%</div>
          <div className="text-muted-foreground">Accuracy</div>
        </div>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">{correct}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-destructive">{wrong}</div>
            <div className="text-sm text-muted-foreground">Wrong</div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onRetry} variant="outline" className="flex-1">
            <RotateCcw className="size-4 mr-2" />
            Retry
          </Button>
          <Button onClick={onGoToNotes} className="flex-1">
            <BookOpen className="size-4 mr-2" />
            Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ZenModeProps {
  subject: ReturnType<typeof getSubjectData>;
  currentCard: AnkiCard | undefined;
  filteredTotal: number;
  filteredIndex: number;
  onFilteredIndexChange: (index: number) => void;
  onTimeUpdate: (seconds: number) => void;
  onExit: () => void;
  onAnswer: (correct: boolean) => void;
  deckStats: DeckStats;
  onRetry: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onShuffle: () => void;
  lessons: string[];
  notesQuery: string;
  onNotesQueryChange: (query: string) => void;
  notesLesson: string | null;
  onNotesLessonChange: (lesson: string | null) => void;
  deckQuery: string;
  onDeckQueryChange: (query: string) => void;
  deckTerms: string[];
  hasCards: boolean;
}

function ZenModeView({
  subject,
  currentCard,
  filteredTotal,
  filteredIndex,
  onFilteredIndexChange,
  onTimeUpdate,
  onExit,
  onAnswer,
  deckStats,
  onRetry,
  onTabChange,
  activeTab,
  categories,
  selectedCategory,
  onCategoryChange,
  onShuffle,
  lessons,
  notesQuery,
  onNotesQueryChange,
  notesLesson,
  onNotesLessonChange,
  deckQuery,
  onDeckQueryChange,
  deckTerms,
  hasCards,
}: ZenModeProps) {
  const isComplete = filteredTotal > 0 && filteredIndex >= filteredTotal;

  const handleAnswer = (correct: boolean) => {
    onAnswer(correct);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative pt-4 pb-2 px-4">
        <h1 className="text-xl font-semibold text-center">{subject?._meta.title}</h1>
        <Button
          onClick={onExit}
          variant="outline"
          size="sm"
          className="absolute right-4 top-4 gap-1.5"
          title="Exit Zen Mode"
        >
          <EyeOff className="size-4" />
          <span className="hidden sm:inline">Exit Zen</span>
        </Button>
      </div>

      <div className="flex justify-center pb-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="decks">Anki Deck</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-32">
        {activeTab === "notes" && subject && (
          <div className="max-w-3xl mx-auto">
            <NotesPanel
              notes={subject.notes}
              lessons={lessons}
              query={notesQuery}
              onQueryChange={onNotesQueryChange}
              selectedLesson={notesLesson}
              onLessonChange={onNotesLessonChange}
            />
          </div>
        )}

        {activeTab === "decks" && subject && (
          <div className="max-w-2xl mx-auto">
            {isComplete ? (
              <CompletionCard
                correct={deckStats.correct}
                wrong={deckStats.wrong}
                onRetry={onRetry}
                onGoToNotes={() => onTabChange("notes")}
              />
            ) : (
              <div className="space-y-6">
                <SubjectToolbar
                  query={deckQuery}
                  onQueryChange={onDeckQueryChange}
                  lessons={categories}
                  selectedLesson={selectedCategory}
                  onLessonChange={onCategoryChange}
                  status={
                    filteredTotal > 0
                      ? `Card ${filteredIndex + 1} of ${filteredTotal}`
                      : "No cards"
                  }
                  onPrevious={() => onFilteredIndexChange(filteredIndex - 1)}
                  onNext={() => onFilteredIndexChange(filteredIndex + 1)}
                  previousLabel="Previous card"
                  nextLabel="Next card"
                  canNavigate={filteredTotal > 0}
                  onShuffle={onShuffle}
                />

                {currentCard ? (
                  <DeckCard
                    key={`${currentCard.id}-${filteredIndex}`}
                    card={currentCard}
                    searchTerms={deckTerms}
                    onAnswer={handleAnswer}
                  />
                ) : (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    {hasCards
                      ? "No cards match the current filters."
                      : "This subject has no deck cards yet."}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <PomodoroTimer onTimeUpdate={onTimeUpdate} />
    </div>
  );
}

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { zenMode, setZenMode } = useOutletContext<OutletContext>();
  const [subject, setSubject] = useState(getSubjectData(subjectId!));
  const [deckStats, setDeckStats] = useState<DeckStats>(initializeDeckStats(subjectId!));
  const [activeTab, setActiveTab] = useState("notes");

  // ─── Deck shuffle + category state ───
  const [shuffledOrder, setShuffledOrder] = useState<AnkiCard[]>([]);
  const [filteredIndex, setFilteredIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // ─── Notes search + lesson state ───
  const [notesQuery, setNotesQuery] = useState("");
  const [notesLesson, setNotesLesson] = useState<string | null>(null);

  // ─── Deck search state ───
  const [deckQuery, setDeckQuery] = useState("");

  // Derived
  const deckTerms = useMemo(() => termsOf(deckQuery), [deckQuery]);
  const filteredCards = useMemo(() => {
    const byLesson = selectedCategory
      ? shuffledOrder.filter((c) => c.lesson === selectedCategory)
      : shuffledOrder;
    return filterCards(byLesson, deckTerms);
  }, [shuffledOrder, selectedCategory, deckTerms]);

  const currentCard = filteredCards[filteredIndex];
  const isDeckComplete = filteredCards.length > 0 && filteredIndex >= filteredCards.length;
  const categories = useMemo(() => {
    if (!subject) return [];
    return [...new Set(subject.anki_deck.map((c) => c.lesson))];
  }, [subject]);
  const lessons = useMemo(() => {
    if (!subject) return [];
    return [...new Set(subject.notes.map((n) => n.lesson))];
  }, [subject]);

  // ─── Init ───
  useEffect(() => {
    if (!subjectId) return;

    const data = getSubjectData(subjectId);
    setSubject(data);
    setDeckStats(initializeDeckStats(subjectId));

    if (data) {
      const session = loadDeckSession(subjectId);
      const deckLen = data.anki_deck.length;

      if (
        session &&
        session.currentIndex < deckLen &&
        session.shuffledOrder.length === deckLen
      ) {
        // Resume mid-session — keep existing order and progress
        setShuffledOrder(session.shuffledOrder);
        setFilteredIndex(session.currentIndex);
      } else {
        // New session — auto-shuffle
        const shuffled = shuffleArray(data.anki_deck);
        setShuffledOrder(shuffled);
        setFilteredIndex(0);
        saveDeckSession(subjectId, { shuffledOrder: shuffled, currentIndex: 0 });
      }
      setSelectedCategory(null);
      setNotesQuery("");
      setNotesLesson(null);
      setDeckQuery("");
      setSessionLoaded(true);
    }
  }, [subjectId]);

  // ⏱ Time tracking
  useEffect(() => {
    if (!subjectId) return;
    const interval = setInterval(() => saveViewedTime(subjectId, 1), 1000);
    return () => clearInterval(interval);
  }, [subjectId]);

  const handleTimeUpdate = (seconds: number) => {
    if (subjectId) saveViewedTime(subjectId, seconds);
  };

  // ─── Answer ───
  const handleAnswer = (correct: boolean) => {
    const newStats = {
      correct: deckStats.correct + (correct ? 1 : 0),
      wrong: deckStats.wrong + (correct ? 0 : 1),
    };
    setDeckStats(newStats);
    saveDeckStats(subjectId!, newStats);
  };

  // ─── Move within the filtered deck (manual navigation) ───
  const handleFilteredIndexChange = (index: number) => {
    if (filteredCards.length === 0) return;
    const clamped = Math.max(0, Math.min(index, filteredCards.length - 1));
    setFilteredIndex(clamped);
    if (subjectId) {
      saveDeckSession(subjectId, { shuffledOrder, currentIndex: clamped });
    }
  };

  // ─── Advance (called after answer, in both normal and zen) ───
  const handleAdvance = () => {
    const next = filteredIndex + 1;
    setFilteredIndex(next);
    if (subjectId) {
      saveDeckSession(subjectId, { shuffledOrder, currentIndex: next });
    }
  };

  // ─── Shuffle ───
  const handleShuffle = () => {
    if (!subject || !subjectId) return;
    const shuffled = shuffleArray(shuffledOrder.length > 0 ? shuffledOrder : subject.anki_deck);
    setShuffledOrder(shuffled);
    setFilteredIndex(0);
    setSelectedCategory(null);
    setDeckQuery("");
    saveDeckSession(subjectId, { shuffledOrder: shuffled, currentIndex: 0 });
  };

  // ─── Category change ───
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setFilteredIndex(0);
  };

  // ─── Deck search change ───
  const handleDeckQueryChange = (query: string) => {
    setDeckQuery(query);
    setFilteredIndex(0);
  };

  // ─── Retry (complete reset) ───
  const handleRetry = () => {
    if (!subject || !subjectId) return;
    const shuffled = shuffleArray(subject.anki_deck);
    setShuffledOrder(shuffled);
    setFilteredIndex(0);
    setSelectedCategory(null);
    setDeckQuery("");
    setDeckStats({ correct: 0, wrong: 0 });
    saveDeckSession(subjectId, { shuffledOrder: shuffled, currentIndex: 0 });
    saveDeckStats(subjectId, { correct: 0, wrong: 0 });
  };

  // ─── Loading / error states ───
  if (!subject) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Subject not found</p>
      </div>
    );
  }

  if (!sessionLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground animate-pulse">Loading deck...</p>
      </div>
    );
  }

  const totalAttempts = deckStats.correct + deckStats.wrong;
  const correctPercentage = totalAttempts > 0 ? (deckStats.correct / totalAttempts) * 100 : 0;

  // ─── Zen Mode ───
  if (zenMode) {
    return (
      <ZenModeView
        subject={subject}
        currentCard={currentCard}
        filteredTotal={filteredCards.length}
        filteredIndex={filteredIndex}
        onFilteredIndexChange={handleFilteredIndexChange}
        onTimeUpdate={handleTimeUpdate}
        onExit={() => setZenMode(false)}
        onAnswer={(correct) => {
          handleAnswer(correct);
          handleAdvance();
        }}
        deckStats={deckStats}
        onRetry={handleRetry}
        onTabChange={setActiveTab}
        activeTab={activeTab}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onShuffle={handleShuffle}
        lessons={lessons}
        notesQuery={notesQuery}
        onNotesQueryChange={setNotesQuery}
        notesLesson={notesLesson}
        onNotesLessonChange={setNotesLesson}
        deckQuery={deckQuery}
        onDeckQueryChange={handleDeckQueryChange}
        deckTerms={deckTerms}
        hasCards={shuffledOrder.length > 0}
      />
    );
  }

  // ─── Normal mode ───
  return (
    <div className="max-w-7xl mx-auto pb-32">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="truncate mr-2">{subject._meta.title}</h1>
        <Button
          onClick={() => setZenMode(true)}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Eye className="size-4 mr-2" />
          Zen Mode
        </Button>
      </div>

      <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="decks">Anki Deck</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
          <NotesPanel
            notes={subject.notes}
            lessons={lessons}
            query={notesQuery}
            onQueryChange={setNotesQuery}
            selectedLesson={notesLesson}
            onLessonChange={setNotesLesson}
          />
        </TabsContent>

        <TabsContent value="decks" className="mt-6">
          <div className="space-y-6">
            {isDeckComplete ? (
              <CompletionCard
                correct={deckStats.correct}
                wrong={deckStats.wrong}
                onRetry={handleRetry}
                onGoToNotes={() => setActiveTab("notes")}
              />
            ) : (
              <>
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="flex flex-wrap justify-between items-center text-sm gap-2">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span>Correct: {deckStats.correct}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span>Wrong: {deckStats.wrong}</span>
                      </div>
                    </div>
                    <span className="text-muted-foreground">
                      {correctPercentage.toFixed(0)}% Correct
                    </span>
                  </div>
                  <Progress value={correctPercentage} />
                </div>

                <div className="max-w-2xl mx-auto">
                  <SubjectToolbar
                    query={deckQuery}
                    onQueryChange={handleDeckQueryChange}
                    lessons={categories}
                    selectedLesson={selectedCategory}
                    onLessonChange={handleCategoryChange}
                    status={
                      filteredCards.length > 0
                        ? `Card ${filteredIndex + 1} of ${filteredCards.length}`
                        : "No cards"
                    }
                    onPrevious={() => handleFilteredIndexChange(filteredIndex - 1)}
                    onNext={() => handleFilteredIndexChange(filteredIndex + 1)}
                    previousLabel="Previous card"
                    nextLabel="Next card"
                    canNavigate={filteredCards.length > 0}
                    onShuffle={handleShuffle}
                  />
                </div>

                {currentCard ? (
                  <DeckCard
                    key={`${currentCard.id}-${filteredIndex}`}
                    card={currentCard}
                    searchTerms={deckTerms}
                    onAnswer={(correct) => {
                      handleAnswer(correct);
                      handleAdvance();
                    }}
                  />
                ) : (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    {shuffledOrder.length > 0
                      ? "No cards match the current filters."
                      : "This subject has no deck cards yet."}
                  </p>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <PomodoroTimer onTimeUpdate={handleTimeUpdate} />
    </div>
  );
}
