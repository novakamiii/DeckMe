import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface MermaidDiagramProps {
  chart: string;
}

let instanceCounter = 0;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

function getCssVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const idRef = useRef(`mermaid-${++instanceCounter}`);
  const dragState = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const modalDragState = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0, dragging: false });

  const [showModal, setShowModal] = useState(false);
  const [modalSvg, setModalSvg] = useState<string | null>(null);
  const [modalZoom, setModalZoom] = useState(1);
  const rawSvgRef = useRef<string | null>(null);
  const isZoomed = zoom !== 1;

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;

      try {
        const bg = getCssVar("--background", "#ffffff");
        const fg = getCssVar("--foreground", "#0f172a");
        const primary = getCssVar("--primary", "#3b82f6");
        const muted = getCssVar("--muted", "#f1f5f9");
        const mutedFg = getCssVar("--muted-foreground", "#64748b");
        const border = getCssVar("--border", "#e2e8f0");

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            background: "transparent",
            primaryColor: primary,
            primaryTextColor: fg,
            primaryBorderColor: primary,
            lineColor: mutedFg,
            secondaryColor: muted,
            tertiaryColor: bg,
            borderColor: border,
            secondaryBorderColor: border,
            lineWidth: "2",
            fontSize: "16px",
            nodePadding: "16",
            mainBkg: muted,
            nodeBorder: border,
            clusterBkg: muted,
            clusterBorder: border,
            titleColor: fg,
            edgeLabelBackground: bg,
            nodeTextColor: fg,
            signalColor: primary,
            signalTextColor: fg,
            labelTextColor: fg,
            checkBoxColor: primary,
            classText: fg,
            altBackground: muted,
            inputBkg: muted,
            inputBorder: border,
            taskBorder: primary,
            taskBkg: muted,
            taskTextColor: fg,
            taskTextLightColor: mutedFg,
            taskTextOutsideColor: mutedFg,
            taskTextClickableColor: primary,
            todayLineColor: primary,
            gridColor: border,
            tagLabelBg: muted,
            tagLabelColor: fg,
            legendBkg: muted,
            legendTextColor: fg,
            commitLabelColor: fg,
            commitLabelBackground: muted,
            pieTitleColor: fg,
            pieStrokeWidth: "1",
            pieStrokeColor: border,
            pieOuterStrokeWidth: "1",
            pieOuterStrokeColor: border,
            pieOpacity: "0.8",
            requirementBackground: muted,
            requirementBorderColor: border,
            requirementTextColor: fg,
            relationColor: mutedFg,
            attributeBackground: muted,
            attributeTextColor: fg,
            attributeBorderColor: border,
            classBorder: border,
            classBackground: muted,
            interfaceLabel: mutedFg,
            useCaseBackground: muted,
            useCaseBorder: border,
            useCaseTextColor: fg,
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
            padding: 24,
            nodeSpacing: 60,
            rankSpacing: 60,
          },
          sequence: { useMaxWidth: true, boxMargin: 16, actorMargin: 80 },
          // @ts-expect-error mermaid types may not include all diagram configs
          gantt: { useMaxWidth: true, barHeight: 32, barGap: 8, topAxis: true },
          state: { useMaxWidth: true },
          classDiagram: { useMaxWidth: true },
          er: { useMaxWidth: true },
          journey: { useMaxWidth: true },
        });

        const { svg } = await mermaid.render(idRef.current, chart);

        if (!cancelled && containerRef.current) {
          // Save original SVG with dimensions for modal view
          rawSvgRef.current = svg;

          // Strip fixed width/height from inline SVG — CSS handles sizing via Tailwind classes
          const responsiveSvg = svg
            .replace(/\s+width="[^"]*"/, '')
            .replace(/\s+height="[^"]*"/, '');

          containerRef.current.innerHTML = responsiveSvg;
          setZoom(1);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
          setIsLoading(false);
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current || zoom === 1) return;
    // Ignore clicks on zoom controls (buttons)
    if ((e.target as HTMLElement).closest("button")) return;

    setIsDragging(true);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop,
    };
    scrollRef.current.style.cursor = "grabbing";
    scrollRef.current.style.userSelect = "none";
  }, [zoom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function onMouseMove(e: MouseEvent) {
      if (!dragState.current.startX && !dragState.current.startY) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      el.scrollLeft = dragState.current.scrollLeft - dx;
      el.scrollTop = dragState.current.scrollTop - dy;
    }

    function onMouseUp() {
      if (dragState.current.startX || dragState.current.startY) {
        setIsDragging(false);
        el.style.cursor = "";
        el.style.userSelect = "";
        dragState.current = { startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 };
      }
    }

    // Attach to window so drag continues even outside the element
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Modal drag-to-pan (attached via mousedown, detached on mouseup)
  const handleModalMouseDown = useCallback((e: React.MouseEvent) => {
    if (modalZoom === 1 || (e.target as HTMLElement).closest("button")) return;
    const el = modalScrollRef.current;
    if (!el) return;

    modalDragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
      dragging: true,
    };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";

    function onMouseMove(ev: MouseEvent) {
      if (!modalDragState.current.dragging) return;
      const dx = ev.clientX - modalDragState.current.startX;
      const dy = ev.clientY - modalDragState.current.startY;
      el.scrollLeft = modalDragState.current.scrollLeft - dx;
      el.scrollTop = modalDragState.current.scrollTop - dy;
    }

    function onMouseUp() {
      modalDragState.current.dragging = false;
      el.style.cursor = "";
      el.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [modalZoom]);

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4 last:mb-0">
        <p className="text-sm text-destructive font-medium mb-1">Diagram failed to render</p>
        <pre className="text-xs text-muted-foreground overflow-x-auto">{chart}</pre>
        <p className="text-xs text-destructive/70 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 border border-border/50 rounded-xl mb-4 last:mb-0 relative group">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border border-border bg-background/90 p-1 opacity-30 transition-opacity group-hover:opacity-100 shadow-sm">
        <button
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="size-4" />
        </button>

        <span className="min-w-[3ch] text-center text-xs tabular-nums text-muted-foreground font-medium">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="size-4" />
        </button>

        {zoom !== 1 && (
            <button
              onClick={resetZoom}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Reset zoom"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}

          <div className="w-px h-5 bg-border mx-0.5" />

          <button
            onClick={() => {
              if (rawSvgRef.current) {
                // Strip fixed width/height (same as inline view — CSS handles sizing)
                const clean = rawSvgRef.current
                  .replace(/\s+width="[^"]*"/, '')
                  .replace(/\s+height="[^"]*"/, '');
                setModalSvg(clean);
                setModalZoom(1);
                setShowModal(true);
              }
            }}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Full screen"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>

      {/* Diagram area with scroll + drag when zoomed */}
      <div
        ref={scrollRef}
        className={`overflow-auto p-6 ${isZoomed ? "cursor-grab active:cursor-grabbing" : ""}`}
        onMouseDown={handleMouseDown}
      >
        {isLoading && (
          <div className="text-sm text-muted-foreground animate-pulse py-12 text-center">
            Rendering diagram...
          </div>
        )}
        <div
          ref={svgWrapperRef}
          className={`${isDragging ? "pointer-events-none" : ""}`}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <div
            ref={containerRef}
            className="[&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-full"
          />
        </div>
      </div>

      {/* Full-screen modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 overflow-hidden flex flex-col [&>button]:hidden">
          <DialogTitle className="sr-only">Diagram Full Screen</DialogTitle>

          {/* Modal zoom controls */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-lg border border-border bg-background/90 p-1 shadow-sm">
            <button
              onClick={() => setModalZoom((z) => Math.max(z - 0.25, 0.5))}
              disabled={modalZoom <= 0.5}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="size-4" />
            </button>

            <span className="min-w-[3ch] text-center text-xs tabular-nums text-muted-foreground font-medium">
              {Math.round(modalZoom * 100)}%
            </span>

            <button
              onClick={() => setModalZoom((z) => Math.min(z + 0.25, 5))}
              disabled={modalZoom >= 5}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="size-4" />
            </button>

            {modalZoom !== 1 && (
              <button
                onClick={() => setModalZoom(1)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Reset zoom"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}

            <div className="w-px h-5 bg-border mx-0.5" />

            <button
              onClick={() => setShowModal(false)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Scrollable diagram area — same pattern as inline view (known working) */}
          <div
            ref={modalScrollRef}
            className={`flex-1 overflow-auto bg-muted/20 flex ${
              modalZoom !== 1
                ? "items-start justify-start cursor-grab"
                : "items-center justify-center"
            }`}
            onMouseDown={handleModalMouseDown}
          >
            {isLoading && (
              <div className="text-sm text-muted-foreground animate-pulse py-12 text-center">
                Rendering diagram...
              </div>
            )}
            <div className="p-6" style={{
              transform: `scale(${modalZoom})`,
              transformOrigin: "top left",
              transition: "transform 0.15s ease-out",
            }}>
              <div
                className="[&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: modalSvg }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
