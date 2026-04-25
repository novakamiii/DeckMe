import { useParams, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { getSubjectData, initializeDeckStats, saveDeckStats, saveViewedTime, DeckStats } from "../lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { NoteCard } from "../components/notes/NoteCard";
import { DeckCard } from "../components/DeckCard";
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
  currentCardIndex: number;
  totalCards: number;
  onCardIndexChange: (index: number) => void;
  onTimeUpdate: (seconds: number) => void;
  onExit: () => void;
  onAnswer: (correct: boolean) => void;
  deckStats: DeckStats;
  onRetry: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

function ZenModeView({
  subject,
  currentCardIndex,
  totalCards,
  onCardIndexChange,
  onTimeUpdate,
  onExit,
  onAnswer,
  deckStats,
  onRetry,
  onTabChange,
  activeTab,
}: ZenModeProps) {
  const progressPercentage = totalCards > 0 ? ((currentCardIndex) / totalCards) * 100 : 0;
  const isComplete = currentCardIndex >= totalCards && totalCards > 0;

  const handleAnswer = (correct: boolean) => {
    onAnswer(correct);
    if (subject && currentCardIndex + 1 < subject.anki_deck.length) {
      onCardIndexChange(currentCardIndex + 1);
    } else if (subject) {
      onCardIndexChange(subject.anki_deck.length);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-center pt-4 pb-2">
        <h1 className="text-xl font-semibold text-center">{subject?._meta.title}</h1>
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
          <div className="max-w-3xl mx-auto space-y-6">
            {subject.notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
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
                <div className="text-center text-sm text-muted-foreground">
                  Card {currentCardIndex + 1} of {totalCards}
                </div>
                {subject.anki_deck.length > 0 && currentCardIndex < subject.anki_deck.length && (
                  <DeckCard
                    key={`${subject.anki_deck[currentCardIndex].id}-${currentCardIndex}`}
                    card={subject.anki_deck[currentCardIndex]}
                    onAnswer={handleAnswer}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-8 right-4 z-50">
        <Button
          onClick={onExit}
          size="icon"
          variant="outline"
          title="Exit Zen Mode"
        >
          <EyeOff className="size-4" />
        </Button>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <PomodoroTimer onTimeUpdate={onTimeUpdate} />
      </div>
    </div>
  );
}

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { sidebarOpen, zenMode, setZenMode } = useOutletContext<OutletContext>();
  const [subject, setSubject] = useState(getSubjectData(subjectId!));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [deckStats, setDeckStats] = useState<DeckStats>(initializeDeckStats(subjectId!));
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    if (subjectId) {
      setSubject(getSubjectData(subjectId));
      setDeckStats(initializeDeckStats(subjectId));
    }
  }, [subjectId]);

  useEffect(() => {
    if (!subjectId) return;

    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      saveViewedTime(subjectId, 1);
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [subjectId]);

  const handleTimeUpdate = (seconds: number) => {
    if (subjectId) {
      saveViewedTime(subjectId, seconds);
    }
  };

  const handleAnswer = (correct: boolean) => {
    const newStats = {
      correct: deckStats.correct + (correct ? 1 : 0),
      wrong: deckStats.wrong + (correct ? 0 : 1),
    };
    setDeckStats(newStats);
    saveDeckStats(subjectId!, newStats);
  };

  const handleRetry = () => {
    setCurrentCardIndex(0);
    setDeckStats({ correct: 0, wrong: 0 });
    if (subjectId) {
      saveDeckStats(subjectId, { correct: 0, wrong: 0 });
    }
  };

  if (!subject) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Subject not found</p>
      </div>
    );
  }

  const totalAttempts = deckStats.correct + deckStats.wrong;
  const correctPercentage = totalAttempts > 0 ? (deckStats.correct / totalAttempts) * 100 : 0;
  const isDeckComplete = currentCardIndex >= subject.anki_deck.length && subject.anki_deck.length > 0;

  if (zenMode) {
    return (
      <ZenModeView
        subject={subject}
        currentCardIndex={currentCardIndex}
        totalCards={subject.anki_deck.length}
        onCardIndexChange={setCurrentCardIndex}
        onTimeUpdate={handleTimeUpdate}
        onExit={() => setZenMode(false)}
        onAnswer={handleAnswer}
        deckStats={deckStats}
        onRetry={handleRetry}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />
    );
  }

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

        <TabsContent value="notes" className="space-y-6 mt-6">
          {subject.notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
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
                  <div className="text-center text-sm text-muted-foreground">
                    Card {currentCardIndex + 1} of {subject.anki_deck.length}
                  </div>
                </div>

                {subject.anki_deck.length > 0 && (
                  <DeckCard
                    key={`${subject.anki_deck[currentCardIndex].id}-${currentCardIndex}`}
                    card={subject.anki_deck[currentCardIndex]}
                    onAnswer={(correct) => {
                      handleAnswer(correct);
                      if (currentCardIndex + 1 < subject.anki_deck.length) {
                        setCurrentCardIndex((prev) => prev + 1);
                      } else {
                        setCurrentCardIndex(subject.anki_deck.length);
                      }
                    }}
                  />
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className={`fixed bottom-safe-bottom z-50 transition-all duration-300 mb-8 ${sidebarOpen ? 'right-8' : 'left-1/2 -translate-x-1/2'}`}>
        <PomodoroTimer onTimeUpdate={handleTimeUpdate} />
      </div>
    </div>
  );
}
