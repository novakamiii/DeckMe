import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { JsonUploader } from "../components/JsonUploader";
import { Separator } from "../components/ui/separator";

const AI_PROMPT = `# PDF TO JSON NOTES + ANKI DECK

You are a professional teacher and a coding enthusiast that will transform this literatures, pictures, files and alike into Notes and Anki Deck reviewer that will be in JSON format. You will make two subsections inside a JSON file, one is for Notes and one is for Anki Deck. You will stay on subject within the theme of this files included in this prompt.

# EXAMPLE (STRICTLY FOLLOW THIS FORMAT)

### JSON LAYOUT

{
  "_meta": {
    "title": "Lesson Title",
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
          "content": "string | string[] | Record<string, any>[] — narrative explanation or list of key points",
          "type": "string — 'definition' | 'list' | 'table' | 'process' | 'comparison'"
        }
      },
      "anki_deck": {
        "description": "Flashcard-style Q&A pairs for active recall review",
        "structure": {
          "id": "string — unique card identifier",
          "lesson": "string — source lesson",
          "front": "string — question or prompt shown to the learner",
          "back": "string | string[] — answer, explanation, or list of points",
          "tag": "string — category tag for filtering"
        }
      }
    }
  }
}

### TYPES EXAMPLE FORMAT

"type": "table",
      "content": [
        {
          "contributor": "Mary Parker Follett (Mother of Modern Management)",
          "definition": "The art of getting things done through people."
        },
        ]

"type": "list",
      "content": [
        "Practical Knowledge — theories must be applied to real situations",
        "Personal Skill — a manager must have unique qualities beyond book knowledge",
        "Creativity — finding new ways to solve problems and differentiate",
        "Perfection through Practice — managers improve with experience over time",
        "Goal-Oriented — art is result-driven, so is management"
      ]

"type": "definition",
      "content": "Forecasting is an attempt to foretell or predict future trends, events, or conditions from known facts to prepare for expected changes in business or industry. It is a systematic approach to probe future business events from available data and information. Business forecasting involves statistical analysis of past and current movements to obtain clues about future patterns."

"type": "comparison",
      "content": [
        {
          "point": "Origin",
          "formal": "Created deliberately",
          "informal": "Arises spontaneously"
        },
        {
          "point": "Nature",
          "formal": "Planned and official",
          "informal": "Unplanned and unofficial"
        }
        ]

"type": "process",
      "content": [
        "Step 1: Outlining the objectives",
        "Step 2: Identification and enumeration of the activities",
        "Step 3: Assigning the duties and responsibilities",
        "Step 4: Delegating the authority",
        "Step 5: Establishing authority relationships"
      ]

### ANKI DECK FORMAT
    {
      "id": "A-C4-010",
      "lesson": "Chapter 4",
      "tag": "departmentation",
      "front": "What is Departmentation?",
      "back": "Departmentation is dividing the large and monolithic functional organization into smaller, flexible administrative units. For example, a CEO oversees departments such as Marketing, Production, Human Resources, Information Technology, and Customer Service."
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

          <div className="relative">
            <pre className="bg-muted p-6 rounded-lg overflow-auto max-h-48 md:max-h-96 text-sm font-mono">
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
