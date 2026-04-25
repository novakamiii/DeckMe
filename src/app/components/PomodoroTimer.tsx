import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

const POMODORO_DURATION = 25 * 60;

interface PomodoroTimerProps {
  onTimeUpdate?: (seconds: number) => void;
}

export function PomodoroTimer({ onTimeUpdate }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (onTimeUpdate) {
            onTimeUpdate(1);
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTimeLeft(POMODORO_DURATION);
    setIsRunning(false);
  };

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            className="text-primary transition-all"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <Button size="sm" variant="outline" onClick={handleReset}>
          <RotateCcw className="size-4" />
        </Button>
      </div>
    </div>
  );
}
