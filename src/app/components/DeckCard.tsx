import { useState } from "react";
import { AnkiCard } from "../lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { MarkdownNote } from "./notes/MarkdownNote";

interface DeckCardProps {
  card: AnkiCard;
  onAnswer: (correct: boolean) => void;
}

export function DeckCard({ card, onAnswer }: DeckCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    onAnswer(correct);
    setTimeout(() => {
      setIsFlipped(false);
      setAnswered(false);
    }, 1500);
  };

  return (
    <Card className="font-notes max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm text-muted-foreground">{card.lesson}</div>
          <Badge variant="secondary" className="shrink-0">{card.tag}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="min-h-48 flex items-center justify-center cursor-pointer p-8 bg-muted/30 rounded-lg transition-all hover:bg-muted/50"
          onClick={() => !answered && setIsFlipped(!isFlipped)}
        >
          {!isFlipped ? (
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Question</div>
              <CardTitle className="text-xl">{card.front}</CardTitle>
              <div className="text-sm text-muted-foreground mt-4">Click to reveal answer</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Answer</div>
              {Array.isArray(card.back) ? (
                <ul className="inline-block text-left space-y-2 max-w-md">
                  {card.back.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <MarkdownNote content={card.back} />
                </div>
              )}
            </div>
          )}
        </div>

        {isFlipped && !answered && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => handleAnswer(false)}
              variant="outline"
              className="w-full sm:flex-1"
            >
              <XCircle className="size-4 sm:size-5 mr-1.5 text-destructive shrink-0" />
              Wrong Guess
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              variant="default"
              className="w-full sm:flex-1"
            >
              <CheckCircle2 className="size-4 sm:size-5 mr-1.5 shrink-0" />
              Guessed Right
            </Button>
          </div>
        )}

        {answered && (
          <div className="text-center text-sm text-muted-foreground">
            Next card loading...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
