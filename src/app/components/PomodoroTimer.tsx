import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw, Clock, GripHorizontal, X, ChevronDown } from "lucide-react";

const POMODORO_DURATION = 25 * 60;
const STORAGE_KEY_POS = "deckme_pomodoro_pos";
const STORAGE_KEY_HIDDEN = "deckme_pomodoro_hidden";
const DEFAULT_BOTTOM = 24; // 1.5rem = 24px

interface PomodoroTimerProps {
  onTimeUpdate?: (seconds: number) => void;
}

function loadPosition(): { x: number; y: number } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_POS);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function savePosition(x: number, y: number) {
  localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ x, y }));
}

export function PomodoroTimer({ onTimeUpdate }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_HIDDEN) === "true";
    } catch {
      return false;
    }
  });
  const [pos, setPos] = useState<{ x: number; y: number } | null>(loadPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number; startY: number;
    origX: number; origY: number;
    moved: boolean;
  } | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 5; // px before drag activates

  // Persist hidden state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HIDDEN, String(isHidden));
  }, [isHidden]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (onTimeUpdate) onTimeUpdate(1);
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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setTimeLeft(POMODORO_DURATION);
    setIsRunning(false);
  };

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  // --- Drag handlers ---
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    // Only respond to events on the drag handle itself
    if (!(e.target as HTMLElement).closest("[data-drag-handle]")) return;
    // Ignore clicks on buttons inside the handle (minimize, dismiss)
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();

    const rect = timerRef.current?.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: rect?.left ?? 0,
      origY: rect?.top ?? 0,
      moved: false,
    };
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragRef.current || !timerRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      // Only start dragging after crossing the threshold
      if (!dragRef.current.moved && (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD)) {
        return;
      }

      if (!dragRef.current.moved) {
        dragRef.current.moved = true;
        setIsDragging(true);
      }

      const newX = dragRef.current.origX + dx;
      const newY = dragRef.current.origY + dy;
      timerRef.current!.style.left = `${newX}px`;
      timerRef.current!.style.top = `${newY}px`;
      timerRef.current!.style.transform = "none";
      timerRef.current!.style.bottom = "auto";
      timerRef.current!.style.right = "auto";
    }

    function onUp(e: MouseEvent) {
      if (!dragRef.current || !timerRef.current) return;

      if (dragRef.current.moved) {
        // Was a real drag — read final inline position from style
        const left = parseInt(timerRef.current.style.left, 10);
        const top = parseInt(timerRef.current.style.top, 10);
        if (!isNaN(left) && !isNaN(top)) {
          savePosition(left, top);
          setPos({ x: left, y: top });
        }
      }

      setIsDragging(false);
      dragRef.current = null;
      timerRef.current.style.left = "";
      timerRef.current.style.top = "";
      timerRef.current.style.transform = "";
      timerRef.current.style.bottom = "";
      timerRef.current.style.right = "";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // --- Positioning: use style exclusively, never Tailwind positioning classes ---
  // This avoids conflicts between -translate-x-1/2 and explicit left/top

  const commonClasses = "bg-card border border-border rounded-xl shadow-lg";
  const floatingBtnClasses =
    "fixed z-50 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity";
  const pillClasses =
    "fixed z-50 flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-4 py-2 hover:bg-muted transition-colors";
  const dragClasses = isDragging ? "shadow-xl" : "";

  // Hidden toggle: always bottom-center
  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className={floatingBtnClasses + " size-10 bottom-6 left-1/2 -translate-x-1/2"}
        title="Show Pomodoro Timer"
      >
        <Clock className="size-5" />
      </button>
    );
  }

  // Minimized pill: always bottom-center
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={pillClasses + " bottom-6 left-1/2 -translate-x-1/2"}
        title="Expand Pomodoro Timer"
      >
        <Clock className="size-4 text-primary" />
        <span className="text-sm font-medium tabular-nums">{formatTime(timeLeft)}</span>
      </button>
    );
  }

  // Full timer: use inline style for ALL positioning (no Tailwind positioning classes)
  const positionStyle: React.CSSProperties = pos
    ? { position: "fixed", left: pos.x, top: pos.y, zIndex: 50 }
    : { position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: DEFAULT_BOTTOM, zIndex: 50 };

  return (
    <div
      ref={timerRef}
      style={positionStyle}
      className={`${commonClasses} ${dragClasses}`}
    >
      {/* Drag handle + title row */}
      <div
        data-drag-handle
        onMouseDown={handleDragStart}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 border-b border-border rounded-t-xl cursor-grab active:cursor-grabbing select-none ${
          isDragging ? "opacity-80" : ""
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <GripHorizontal className="size-3" />
          <Clock className="size-3" />
          <span className="font-medium">Pomodoro</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Minimize"
          >
            <ChevronDown className="size-3.5" />
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setIsHidden(true);
            }}
            className="flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Dismiss"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Timer body */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Progress ring */}
        <div className="relative size-14 shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="28" cy="28" r="24"
              stroke="currentColor" strokeWidth="4" fill="none"
              className="text-muted"
            />
            <circle
              cx="28" cy="28" r="24"
              stroke="currentColor" strokeWidth="4" fill="none"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" className="size-8" onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </Button>
          <Button size="sm" variant="outline" className="size-8" onClick={handleReset}>
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
