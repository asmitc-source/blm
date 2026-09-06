import type { ReactNode } from "react";

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);
  return (
    <div className="space-y-5 text-[17px] leading-relaxed text-ink-soft">
      {blocks.map((block, i) => (
        <Block key={i} text={block.trim()} />
      ))}
    </div>
  );
}

function Block({ text }: { text: string }) {
  if (text.startsWith("## ")) {
    return (
      <h2 className="pt-4 font-display text-2xl font-semibold tracking-tight text-ink">
        {inline(text.slice(3))}
      </h2>
    );
  }
  if (text.startsWith("### ")) {
    return (
      <h3 className="pt-2 font-display text-xl font-semibold text-ink">{inline(text.slice(4))}</h3>
    );
  }
  if (text.startsWith("- ")) {
    const items = text.split(/\n/).filter((l) => l.startsWith("- "));
    return (
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{inline(item.slice(2))}</li>
        ))}
      </ul>
    );
  }
  return <p>{inline(text)}</p>;
}

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let k = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={k} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const href = m[2];
        const label = m[1];
        parts.push(
          <a
            key={k}
            href={href}
            className="font-semibold text-mint underline-offset-2 hover:underline"
            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {label}
          </a>,
        );
      }
    }
    k += 1;
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
