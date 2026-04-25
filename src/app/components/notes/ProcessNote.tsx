interface ProcessNoteProps {
  content: string[];
}

export function ProcessNote({ content }: ProcessNoteProps) {
  return (
    <ol className="space-y-3">
      {content.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            {index + 1}
          </div>
          <div className="flex-1 pt-1">
            {step.replace(/^Step \d+:\s*/, '')}
          </div>
        </li>
      ))}
    </ol>
  );
}
