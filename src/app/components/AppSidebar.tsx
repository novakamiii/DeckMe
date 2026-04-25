import { Link, useNavigate } from "react-router";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "./ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, BookOpen, Settings, BarChart3, Home } from "lucide-react";
import { getSubjectList } from "../lib/mockData";
import { useState } from "react";

export function AppSidebar() {
  const subjects = getSubjectList();
  const navigate = useNavigate();
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(true);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel className="text-lg mb-2">DeckMe</SidebarGroupLabel>
            <SidebarTrigger />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home className="size-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={isSubjectsOpen} onOpenChange={setIsSubjectsOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full">
                      <BookOpen className="size-4" />
                      <span>Subjects</span>
                      <ChevronDown className={`ml-auto size-4 transition-transform ${isSubjectsOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-4 mt-1 space-y-1">
                    {subjects.map((subject) => (
                      <SidebarMenuItem key={subject.id}>
                        <SidebarMenuButton asChild>
                          <Link to={`/subject/${subject.id}`}>
                            {subject.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/stats">
                    <BarChart3 className="size-4" />
                    <span>Stats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
