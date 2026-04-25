import { Outlet, useLocation } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarRail, useSidebar } from "../components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/sonner";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PanelLeft } from "lucide-react";

function SidebarToggle() {
  const { open, toggleSidebar } = useSidebar();
  
  if (open) return null;
  
  return (
    <Button
      onClick={toggleSidebar}
      size="icon"
      variant="outline"
      className="fixed top-4 left-4 z-50 shadow-md bg-background"
      title="Open Sidebar"
    >
      <PanelLeft className="size-4" />
    </Button>
  );
}

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
    <div className="flex h-screen w-full">
      {!zenMode && <AppSidebar />}
      {!zenMode && <SidebarRail />}
      {!zenMode && <SidebarToggle />}
      <main className="flex-1 overflow-auto">
        <Outlet context={{ sidebarOpen, zenMode, setZenMode }} />
      </main>
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
