import { Outlet, useLocation } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarRail, useSidebar } from "../components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/sonner";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PanelLeft } from "lucide-react";

function SidebarToggle() {
  const { open, openMobile, toggleSidebar, isMobile } = useSidebar();
  
  // Use direct window width check for initial render robustness
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  const isOpen = isSmallScreen ? openMobile : open;
  
  if (isOpen) return null;
  
  return (
    <Button
      onClick={toggleSidebar}
      size="icon"
      variant="outline"
      className={`fixed ${isSmallScreen ? 'top-safe-top mt-4' : 'top-12'} left-4 z-50 shadow-md bg-background size-10 md:size-9 rounded-full md:rounded-md`}
      title="Open Sidebar"
    >
      <PanelLeft className="size-5 md:size-4" />
    </Button>
  );
}

import { TitleBar } from "./TitleBar";

function RootLayoutContent() {
  const location = useLocation();
  const [firstVisit, setFirstVisit] = useState(false);
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const [zenMode, setZenMode] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('deckme_has_visited');
    if (!hasVisited && location.pathname === '/') {
      setFirstVisit(true);
      localStorage.setItem('deckme_has_visited', 'true');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (zenMode) {
      setSidebarOpen(false);
    }
  }, [zenMode, setSidebarOpen]);

  return (
    <div className="flex flex-col h-svh w-full overflow-hidden bg-background">
      <TitleBar />
      <div className="flex flex-1 w-full overflow-hidden">
        {!zenMode && <AppSidebar />}
        {!zenMode && <SidebarRail />}
        {!zenMode && <SidebarToggle />}
        <main className="flex-1 overflow-auto pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right">
          <div className="h-full w-full p-4 md:p-8">
            <Outlet context={{ sidebarOpen, zenMode, setZenMode }} />
          </div>
        </main>
      </div>
    </div>
  );
}

export function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <RootLayoutContent />
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}
