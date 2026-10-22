import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

/**
 * The nearest ancestor that actually scrolls — the notes pane lives inside
 * different scroll containers depending on the current layout.
 */
function findScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const overflowY = window.getComputedStyle(node).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

interface ScrollToTopProps {
  /** Scroll distance (px) before the button appears. */
  threshold?: number;
}

export function ScrollToTop({ threshold = 200 }: ScrollToTopProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scroller = findScrollableAncestor(anchorRef.current);
    if (!scroller) return;

    const onScroll = () => setVisible(scroller.scrollTop > threshold);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <div
      ref={anchorRef}
      className={cn(
        "fixed bottom-6 right-6 z-40 transition-opacity",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="secondary"
        title="Back to top"
        aria-label="Back to top"
        onClick={() => {
          findScrollableAncestor(anchorRef.current)?.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        className="rounded-full shadow-lg"
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  );
}
