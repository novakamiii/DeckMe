import { useEffect, useState } from "react";
import { X, Minus, Square, Copy } from "lucide-react";
import { useLocation } from "react-router";

export function TitleBar() {
  const [appWindow, setAppWindow] = useState<any>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTauri, setIsTauri] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if we are running in Tauri
    if (window.__TAURI_INTERNALS__) {
      setIsTauri(true);
      import("@tauri-apps/api/window").then((module) => {
        const win = module.getCurrentWindow();
        setAppWindow(win);
        
        // Listen for resize to update maximized state
        const unlisten = win.onResized(async () => {
          const maximized = await win.isMaximized();
          setIsMaximized(maximized);
        });

        return () => {
          unlisten.then(u => u());
        };
      });
    }
  }, []);

  if (!isTauri) return null;

  const handleMinimize = () => appWindow?.minimize();
  const handleMaximize = async () => {
    await appWindow?.toggleMaximize();
    const maximized = await appWindow?.isMaximized();
    setIsMaximized(maximized);
  };
  const handleClose = () => appWindow?.close();

  // Get current page name for the title
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/stats') return 'Statistics';
    if (path === '/settings') return 'Settings';
    if (path.startsWith('/subject/')) return 'Subject View';
    return '';
  };

  return (
    <div 
      data-tauri-drag-region 
      className="h-8 bg-sidebar border-b border-sidebar-border flex items-center justify-between select-none px-3 text-sidebar-foreground"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <span className="text-xs font-bold tracking-tight opacity-70">DECKME</span>
        <span className="text-xs opacity-40">|</span>
        <span className="text-xs font-medium">{getPageName()}</span>
      </div>

      <div className="flex h-full">
        <button
          onClick={handleMinimize}
          className="h-full px-3 hover:bg-sidebar-accent transition-colors flex items-center"
          title="Minimize"
        >
          <Minus className="size-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full px-3 hover:bg-sidebar-accent transition-colors flex items-center"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? <Copy className="size-3.5 rotate-180" /> : <Square className="size-3" />}
        </button>
        <button
          onClick={handleClose}
          className="h-full px-3 hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center"
          title="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
