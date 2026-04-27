import Link from "next/link";
import { Card } from "@/components/Card";
import { previewText } from "@/lib/text";

export function PostCard(props: {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  rightSlot?: string;
  href?: string;
}) {
  const href = props.href ?? `/blog/${props.id}`;
  const when = (() => {
    const d = new Date(props.createdAt);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  })();

  return (
    <Link href={href} className="block">
      <Card className="p-5 transition hover:border-white/15">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {props.title}
            </div>
            <div className="mt-1 max-h-20 overflow-hidden text-sm text-zinc-400">
              {previewText(props.content, 200)}
            </div>
          </div>
          <div className="shrink-0 text-right text-xs text-zinc-500">
            <div>{when}</div>
            {props.rightSlot ? <div className="mt-1 text-zinc-300">{props.rightSlot}</div> : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
