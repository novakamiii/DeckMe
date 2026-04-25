import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { WelcomePage } from "./pages/WelcomePage";
import { SubjectPage } from "./pages/SubjectPage";
import { StatsPage } from "./pages/StatsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: WelcomePage },
      { path: "subject/:subjectId", Component: SubjectPage },
      { path: "stats", Component: StatsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
