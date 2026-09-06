import { useEffect, useRef } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";

function cmd(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export function RichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) el.innerHTML = value || "";
  }, [value]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-cream">
      <div className="flex flex-wrap gap-1 border-b border-line px-2 py-2">
        <Tool icon={Bold} label="Bold" onClick={() => cmd("bold")} />
        <Tool icon={Italic} label="Italic" onClick={() => cmd("italic")} />
        <Tool icon={Heading2} label="Heading" onClick={() => cmd("formatBlock", "h2")} />
        <Tool icon={Heading3} label="Subhead" onClick={() => cmd("formatBlock", "h3")} />
        <Tool icon={List} label="Bullets" onClick={() => cmd("insertUnorderedList")} />
        <Tool icon={ListOrdered} label="Numbers" onClick={() => cmd("insertOrderedList")} />
        <Tool icon={Quote} label="Quote" onClick={() => cmd("formatBlock", "blockquote")} />
        <Tool
          icon={LinkIcon}
          label="Link"
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) cmd("createLink", url);
          }}
        />
        <Tool icon={RemoveFormatting} label="Paragraph" onClick={() => cmd("formatBlock", "p")} />
      </div>
      <div
        ref={ref}
        className={cn("article-html min-h-[22rem] px-5 py-4 outline-none")}
        contentEditable
        data-placeholder={placeholder ?? "Write the article. Highlight text to bold, italicize, or turn into a list."}
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
      />
    </div>
  );
}

function Tool({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Bold;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="grid size-8 place-items-center rounded-lg text-ink-soft hover:bg-sand hover:text-ink"
    >
      <Icon className="size-4" />
    </button>
  );
}
