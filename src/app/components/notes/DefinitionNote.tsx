interface DefinitionNoteProps {
  content: string;
}

export function DefinitionNote({ content }: DefinitionNoteProps) {
  return (
    <p className="leading-relaxed text-foreground">
      {content}
    </p>
  );
}
