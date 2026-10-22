import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { withoutNodeProp } from "./markdown";

interface DefinitionNoteProps {
  content: string;
}

const defComponents: Components = {
  p: ({ children, ...props }) => (
    <p className="leading-relaxed mb-2 last:mb-0" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-foreground" {...props}>
      {children}
    </em>
  ),
  code: ({ className, children, ...props }) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-2 border-l-primary pl-4 italic text-muted-foreground mb-2 last:mb-0"
      {...props}
    >
      {children}
    </blockquote>
  ),
};

const safeDefComponents = withoutNodeProp(defComponents);

export function DefinitionNote({ content }: DefinitionNoteProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={safeDefComponents}>
      {content}
    </ReactMarkdown>
  );
}
