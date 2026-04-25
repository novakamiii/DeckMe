interface ListNoteProps {
  content: string[];
}

export function ListNote({ content }: ListNoteProps) {
  return (
    <ul className="space-y-2">
      {content.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-primary mr-3">•</span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}
