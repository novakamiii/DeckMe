interface ComparisonNoteProps {
  content: Record<string, any>[];
}

export function ComparisonNote({ content }: ComparisonNoteProps) {
  if (!content || content.length === 0) return null;

  const headers = Object.keys(content[0]).filter(key => key !== 'point');

  return (
    <div className="space-y-4">
      {content.map((item, index) => (
        <div key={index} className="border-l-4 border-primary pl-4">
          <div className="font-medium mb-2">{item.point}</div>
          <div className="grid grid-cols-2 gap-4">
            {headers.map((header) => (
              <div key={header}>
                <div className="text-sm text-muted-foreground capitalize mb-1">
                  {header}
                </div>
                <div>{item[header]}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
