import { useEffect } from "react";
import { toast } from "sonner";

const CURRENT_VERSION = "1.0.7";
const GITHUB_REPO = "novakamiii/DeckMe";
const CHECKED_KEY = "deckme_update_checked";

/**
 * Strip leading "v" or "V" from a version string.
 */
function stripV(v: string): string {
  return v.replace(/^[vV]/, "");
}

/**
 * Simple semver comparison. Returns 1 if a > b, -1 if a < b, 0 if equal.
 */
function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

export function UpdateNotifier() {
  useEffect(() => {
    let cancelled = false;

    async function check() {
      // Skip if already checked today
      const lastCheck = localStorage.getItem(CHECKED_KEY);
      if (lastCheck) {
        const today = new Date().toDateString();
        if (lastCheck === today) return;
      }

      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
          { signal: AbortSignal.timeout(10_000) },
        );

        if (!res.ok) return; // rate-limited or no releases yet

        const data = await res.json();
        const latestTag: string = data.tag_name ?? "";
        const latest = stripV(latestTag);
        const current = stripV(CURRENT_VERSION);

        if (!latest) return;

        if (compareSemver(latest, current) > 0) {
          toast("Update available", {
            description: `Version ${latestTag} is ready to download`,
            duration: 10_000,
            action: {
              label: "View",
              onClick: () =>
                window.open(
                  `https://github.com/${GITHUB_REPO}/releases/latest`,
                  "_blank",
                  "noopener",
                ),
            },
          });
        }
      } catch {
        // Network error or timeout — silently ignore
      }

      if (!cancelled) {
        localStorage.setItem(CHECKED_KEY, new Date().toDateString());
      }
    }

    // Small delay so the app loads before fetching
    const timer = setTimeout(check, 3_000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return null;
}
