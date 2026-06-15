import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { JsonUploader } from "../components/JsonUploader";
import { Separator } from "../components/ui/separator";

const AI_PROMPT = `# PDF TO JSON NOTES + ANKI DECK

You are a professional teacher and a coding enthusiast that will transform literature, pictures, files, and alike into structured Notes and an Anki Deck reviewer in JSON format. You will make two subsections inside a JSON file: one for Notes and one for the Anki Deck. Stay on subject within the theme of the files included in this prompt.

**Default behavior: All content uses Markdown formatting (GFM). Use \`type: "markdown"\` unless a structured type (table, process, comparison) is clearly more appropriate. Mermaid diagrams are supported inside fenced code blocks with the \`mermaid\` language tag.**

## GENERATION MODES

- **markdown-rich** *(default)* — All notes prefer \`type: "markdown"\`. Use GFM throughout: \`**bold**\` for key terms, \`*italic*\` for emphasis, \`> blockquote\` for definitions, \`| table |\` for comparisons, \`\`\`mermaid\` for diagrams, \`\`\` \` for code/formulas, \`## subheadings\` inside content. Anki \`back\` fields also use Markdown.
- **standard** — Balanced structured notes and Anki deck. Uses all types freely based on content shape.
- **review** — Minimal notes (one summary \`type: "definition"\` per lesson). Heavy Anki deck (3+ cards per topic). Each card includes \`"difficulty": "easy" | "medium" | "hard"\`.

# EXAMPLE (STRICTLY FOLLOW THIS FORMAT)

### JSON LAYOUT

{
  "_meta": {
    "title": "Lesson Title",
    "mode": "markdown-rich",
    "lessons": [
      "Notes 1: Title",
      "Chapter 2: Title",
      "Lesson 3: Title",
      "(Strictly FOLLOW the File or Resource name)"
    ],
    "schema_preview": {
      "notes": {
        "description": "Structured lesson notes organized by topic and subtopic",
        "structure": {
          "id": "string — unique note identifier",
          "lesson": "string — lesson or chapter name",
          "topic": "string — main topic heading",
          "subtopic": "string | null — optional subtopic heading",
          "content": "string (GFM Markdown: **bold**, *italic*, \`code\`, > blockquote, ## heading, | table |, \`\`\`mermaid) | string[] | Record<string, any>[]",
          "type": "string — 'markdown' (default) | 'definition' | 'list' | 'table' | 'process' | 'comparison'"
        }
      },
      "anki_deck": {
        "description": "Flashcard-style Q&A pairs for active recall review",
        "structure": {
          "id": "string — unique card identifier",
          "lesson": "string — source lesson",
          "front": "string — question or prompt",
          "back": "string (GFM Markdown — **bold** key terms, \`code\` for formulas, > for definitions) | string[]",
          "tag": "string — category tag for filtering",
          "difficulty": "string | null — 'easy' | 'medium' | 'hard' (used in review mode)"
        }
      }
    }
  }
}

### TYPE EXAMPLES

// DEFAULT — use this unless structured type is clearly better
"type": "markdown",
"content": "## The Accounting Equation\\n\\n> **Assets = Liabilities + Owner's Equity**\\n\\nThis equation must *always balance*. Every transaction affects at least two accounts to maintain this balance.\\n\\n| Component | Examples |\\n|-----------|----------|\\n| Assets | Cash, Equipment, Inventory |\\n| Liabilities | Loans, Accounts Payable |\\n| Owner's Equity | Capital, Retained Earnings |"

// Mermaid diagrams — use \`\`\`mermaid inside the markdown content:
"type": "markdown",
"content": "## System Architecture\\n\\nHere is the system flow:\\n\\n\`\`\`mermaid\\nflowchart LR\\n    A[Client] --> B[API Gateway]\\n    B --> C[Auth Service]\\n    B --> D[Data Service]\\n    C --> E[(User DB)]\\n    D --> F[(Main DB)]\\n\`\`\`"

// Only use structured types when content is inherently tabular or sequential:

"type": "process",
"content": [
  "Step 1: Outlining the objectives",
  "Step 2: Identification and enumeration of activities",
  "Step 3: Assigning duties and responsibilities",
  "Step 4: Delegating the authority",
  "Step 5: Establishing authority relationships"
]

"type": "comparison",
"content": [
  { "point": "Origin", "formal": "Created deliberately", "informal": "Arises spontaneously" },
  { "point": "Nature", "formal": "Planned and official", "informal": "Unplanned and unofficial" }
]

### ANKI DECK FORMAT
{
  "id": "A-C4-010",
  "lesson": "Chapter 4",
  "tag": "departmentation",
  "front": "What is Departmentation?",
  "back": "**Departmentation** is dividing a large organization into smaller, flexible administrative units.\\n\\n> Example: A CEO oversees \`Marketing\`, \`HR\`, \`IT\`, \`Production\`, and \`Customer Service\` departments.",
  "difficulty": null
}`;

export function WelcomePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(AI_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <Card className="max-w-4xl w-full p-4 md:p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl">Welcome to DeckMe!</h1>
            <p className="text-muted-foreground">
              To get started, please copy this prompt, upload your files and paste this prompt to any AI you use (Claude is Recommended):
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center overflow-hidden">
            <img src="/deki.png" alt="Deki Mascot" className="size-32 md:size-48 object-contain shrink-0 animate-squish origin-bottom" />
            <div className="relative flex-1 w-full min-w-0">
              <pre className="bg-muted p-6 rounded-lg overflow-auto max-h-48 md:max-h-96 text-sm font-mono w-full whitespace-pre-wrap break-words">
                {AI_PROMPT}
              </pre>
              <Button
                onClick={handleCopy}
                className="absolute top-4 right-4"
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="size-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>After generating your JSON files with AI, upload them below or select a subject from the sidebar to start studying!</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-center">Upload Your Subject JSON</h3>
            <JsonUploader />
          </div>
        </div>
      </Card>
    </div>
  );
}
