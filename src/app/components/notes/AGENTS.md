# NOTE COMPONENTS

Study note display components for different content types: definitions, lists, tables, processes, comparisons.

## STRUCTURE

```
notes/
├── NoteCard.tsx           # Container wrapper
├── DefinitionNote.tsx     # Text-based definition display
├── ListNote.tsx          # Bulleted/numbered lists
├── TableNote.tsx         # Data tables
├── ProcessNote.tsx       # Step-by-step procedures
└── ComparisonNote.tsx  # Side-by-side comparisons
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| New note type | Create component here, add to `mockData.ts` type union |
| Note rendering | `NoteCard.tsx` handles type dispatch |
| Data structure | `src/app/lib/mockData.ts` - `NoteContent` interface |

## CONVENTIONS

- Components receive `NoteContent` props from parent
- Use discriminated union on `type` field for rendering
- Wrap in Card from `../ui/card`
- Support markdown-like formatting in content strings

## DATA TYPES

```ts
type NoteType = 'definition' | 'list' | 'table' | 'process' | 'comparison';
interface NoteContent {
  id: string;
  lesson: string;
  topic: string;
  subtopic: string | null;
  content: string | string[] | Record<string, any>[];
  type: NoteType;
}
```

## ANTI-PATTERNS

- Don't hardcode note types - use the type union
- Avoid deeply nested content structures - keep flat arrays
- Don't bypass `NoteCard` - always render through it
