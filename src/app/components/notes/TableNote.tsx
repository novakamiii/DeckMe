interface TableNoteProps {
  content: Record<string, any>[];
}

export function TableNote({ content }: TableNoteProps) {
  if (!content || content.length === 0) return null;

  const headers = Object.keys(content[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-primary">
            {headers.map((header) => (
              <th key={header} className="text-left p-3 font-medium capitalize">
                {header.replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border">
              {headers.map((header) => (
                <td key={header} className="p-3">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
