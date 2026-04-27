import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button, Input } from "@/components/ui";
import { useSession } from "@/lib/useSession";

export default function CreatePostPage() {
  const router = useRouter();
  const { supabase, session, loading, envMissing } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !envMissing && !session) {
      void router.replace("/sign-in");
    }
  }, [envMissing, loading, router, session]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!supabase) {
      setStatus("Supabase env vars missing. Copy .env.local.example to .env.local.");
      return;
    }
    if (!session) return;

    setSaving(true);
    try {
      const { error, data } = await supabase
        .from("posts")
        .insert({
          title,
          content,
          published: true,
        })
        .select("id")
        .single();

      if (error) {
        setStatus(
          `${error.message} (Do you have a 'posts' table with title/content/user_id?)`,
        );
        return;
      }

      await router.push(`/blog/${data.id}`);
    } finally {
      setSaving(false);
    }
  }

  if (envMissing) {
    return (
      <Card className="p-6">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Supabase not configured</h1>
          <p className="text-sm text-zinc-400">
            Create <span className="text-zinc-200">.env.local</span> from{" "}
            <span className="text-zinc-200">.env.local.example</span> and add
            your Supabase URL + anon key.
          </p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return <div className="text-sm text-zinc-400">Loading…</div>;
  }

  if (!session) return null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create Post</h1>
        <p className="text-sm text-zinc-400">
          This will insert into Supabase table{" "}
          <span className="text-zinc-200">posts</span>.
        </p>
      </div>

      <Card className="p-6">
        <form className="space-y-4" onSubmit={onCreate}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A clean, modern post title"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Content</label>
            <textarea
              className={[
                "min-h-40 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm text-white",
                "placeholder:text-zinc-500 outline-none",
                "focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10",
              ].join(" ")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something…"
              required
            />
          </div>

          {status ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
              {status}
            </div>
          ) : null}

          <div className="flex items-center justify-end">
            <Button disabled={saving} type="submit">
              {saving ? "Saving…" : "Publish"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

