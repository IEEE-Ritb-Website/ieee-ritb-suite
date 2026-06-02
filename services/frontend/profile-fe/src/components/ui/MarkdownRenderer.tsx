import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export function MarkdownRenderer({ content }: { content?: string | null }) {
  if (!content) return null;

  const rawHtml = marked.parse(content, { async: false }) as string;
  const sanitized = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ["p", "br", "b", "i", "strong", "em", "a", "ul", "ol", "li", "code", "pre", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });

  return (
    <div
      className="prose-invert prose-sm max-w-none [&_a]:text-[#00ff9d] [&_a]:underline [&_code]:text-[#ff4fd8] [&_code]:bg-[rgba(255,79,216,0.08)] [&_code]:px-1 [&_code]:rounded [&_pre]:bg-[rgba(0,0,0,0.3)] [&_pre]:p-3 [&_pre]:rounded [&_pre]:border [&_pre]:border-[rgba(0,255,157,0.1)] [&_blockquote]:border-l-[#00ff9d] [&_blockquote]:pl-3 [&_blockquote]:text-[rgba(200,255,232,0.55)]"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
