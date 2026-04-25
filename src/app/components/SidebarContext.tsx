import { createContext, useContext, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ isOpen: true });

export function SidebarProvider({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  return (
    <SidebarContext.Provider value={{ isOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  return useContext(SidebarContext);
}
