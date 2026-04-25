import { NoteContent } from "../../lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DefinitionNote } from "./DefinitionNote";
import { ListNote } from "./ListNote";
import { TableNote } from "./TableNote";
import { ProcessNote } from "./ProcessNote";
import { ComparisonNote } from "./ComparisonNote";

interface NoteCardProps {
  note: NoteContent;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="font-notes">
      <CardHeader>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{note.lesson}</div>
          <CardTitle>{note.topic}</CardTitle>
          {note.subtopic && (
            <div className="text-sm text-muted-foreground italic">{note.subtopic}</div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {note.type === 'definition' && <DefinitionNote content={note.content as string} />}
        {note.type === 'list' && <ListNote content={note.content as string[]} />}
        {note.type === 'table' && <TableNote content={note.content as Record<string, any>[]} />}
        {note.type === 'process' && <ProcessNote content={note.content as string[]} />}
        {note.type === 'comparison' && <ComparisonNote content={note.content as Record<string, any>[]} />}
      </CardContent>
    </Card>
  );
}
