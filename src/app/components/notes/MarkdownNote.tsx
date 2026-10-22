import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { MermaidDiagram } from "./MermaidDiagram";
import { withoutNodeProp } from "./markdown";

interface MarkdownNoteProps {
  content: string;
}

const markdownComponents: Components = {
  h2: ({ children, ...props }) => (
    <h2 className="text-xl font-semibold mt-6 mb-3 scroll-m-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg font-semibold mt-4 mb-2 scroll-m-20" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="font-semibold mt-3 mb-1 scroll-m-20" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="leading-relaxed mb-3 last:mb-0" {...props}>
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
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    const isMermaid = className === "language-mermaid";
    if (isMermaid) {
      return <MermaidDiagram chart={String(children)} />;
    }
    if (isInline) {
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm mb-4 last:mb-0">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  pre: ({ children, ...props }) => (
    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm mb-4 last:mb-0" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-2 border-l-primary pl-4 italic text-muted-foreground mb-3 last:mb-0"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-4 last:mb-0">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-border p-2 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border p-2" {...props}>
      {children}
    </td>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 space-y-1 mb-3 last:mb-0" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 space-y-1 mb-3 last:mb-0" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  hr: (props) => (
    <hr className="border-border my-4" {...props} />
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-primary underline hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
};

const safeMarkdownComponents = withoutNodeProp(markdownComponents);

export function MarkdownNote({ content }: MarkdownNoteProps) {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={safeMarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
