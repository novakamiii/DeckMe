import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { getSubjectList, mockSubjects } from "../lib/mockData";
import { JsonUploader } from "../components/JsonUploader";
import { Trash2, Github, Star, User, Home } from "lucide-react";
import { useState, useEffect } from "react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const subjects = getSubjectList();
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clearStatsConfirmOpen, setClearStatsConfirmOpen] = useState(false);
  const [githubRedirectOpen, setGithubRedirectOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<{ id: string; title: string } | null>(null);
  const [githubData, setGithubData] = useState<{ avatar: string; repo: string } | null>(null);
  const GITHUB_REPO_URL = 'https://github.com/novakamiii/DeckMe';

  useEffect(() => {
    fetch('https://api.github.com/users/novakamiii')
      .then((res) => res.json())
      .then((data) => {
        setGithubData({
          avatar: data.avatar_url,
          repo: 'DeckMe',
        });
      })
      .catch(() => {
        setGithubData({
          avatar: '',
          repo: 'DeckMe',
        });
      });
  }, []);

  const getUserUploadedSubjects = () => {
    const stored = localStorage.getItem('deckme_subjects');
    const storedSubjects = stored ? JSON.parse(stored) : {};
    return Object.keys(storedSubjects).map((id) => ({
      id,
      title: storedSubjects[id]._meta.title,
    }));
  };

  const clearStats = () => {
    subjects.forEach((subject) => {
      localStorage.removeItem(`deckme_stats_${subject.id}`);
      localStorage.removeItem(`deckme_time_${subject.id}`);
    });
    toast.success('All statistics have been cleared');
    window.location.reload();
  };

  const deleteSubject = () => {
    if (!subjectToDelete) return;

    const { id, title } = subjectToDelete;
    localStorage.removeItem(`deckme_stats_${id}`);
    localStorage.removeItem(`deckme_time_${id}`);

    const stored = localStorage.getItem('deckme_subjects');
    if (stored) {
      const storedSubjects = JSON.parse(stored);
      delete storedSubjects[id];
      localStorage.setItem('deckme_subjects', JSON.stringify(storedSubjects));
    }

    toast.success(`"${title}" has been deleted`);
    window.location.reload();
  };

  const userSubjects = getUserUploadedSubjects();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how DeckMe looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">Follow System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fonts</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Notes & Decks: Liberation Serif / Times New Roman</p>
                <p>Sidebar & Settings: Sans-serif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your study data and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Upload New Subject</Label>
              <JsonUploader />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:flex-1">
                    Subject Management
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Subject Management</DialogTitle>
                    <DialogDescription>
                      View and manage your uploaded subjects. Deleting a subject will remove all associated data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {userSubjects.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No uploaded subjects found</p>
                    ) : (
                      userSubjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{subject.title}</p>
                            <p className="text-sm text-muted-foreground">ID: {subject.id}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSubjectToDelete(subject);
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={() => setClearStatsConfirmOpen(true)} className="w-full sm:flex-1">
                Clear Statistics
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>About DeckMe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                DeckMe is an AnkiDeck-inspired application designed to help students read quick notes and memorize information for upcoming tests. Built with React and featuring a lightweight design for optimal performance.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setGithubRedirectOpen(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="size-5" />
                Made by novakamiii
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {githubData && (
                <div className="flex items-center gap-3">
                  {githubData.avatar ? (
                    <img
                      src={githubData.avatar}
                      alt="GitHub Avatar"
                      className="size-12 rounded-full border-2 border-border"
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="size-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">novakamiii</p>
                    <p className="text-sm text-muted-foreground">GitHub</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <span>Star this project on GitHub!</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Subject"
        description={`Are you sure you want to delete "${subjectToDelete?.title}"? This action cannot be undone and will remove all associated data.`}
        onConfirm={deleteSubject}
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog
        open={clearStatsConfirmOpen}
        onOpenChange={setClearStatsConfirmOpen}
        title="Clear Statistics"
        description="Are you sure you want to clear all statistics? This will reset all study statistics and time tracking data."
        onConfirm={clearStats}
        confirmText="Clear"
        variant="destructive"
      />

      <ConfirmDialog
        open={githubRedirectOpen}
        onOpenChange={setGithubRedirectOpen}
        title="Redirect to GitHub"
        description={`This will redirect you to this repo: ${GITHUB_REPO_URL}. Proceed?`}
        onConfirm={() => window.open(GITHUB_REPO_URL, '_blank')}
        confirmText="Proceed"
        variant="default"
      />
    </div>
  );
}
