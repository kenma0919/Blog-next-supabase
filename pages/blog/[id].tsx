import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { ButtonGhost } from "@/components/ui";
import { getPostById, type PostDetail } from "@/lib/posts";
import { useSession } from "@/lib/useSession";

export default function BlogDetailPage() {
  const router = useRouter();
  const { supabase, session, envMissing } = useSession();
  const [post, setPost] = useState<PostDetail | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const rawId = router.query.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!router.isReady) return;
      if (envMissing) {
        setError("Supabase env vars missing. Copy .env.local.example to .env.local.");
        setPost(null);
        return;
      }
      if (!id || !supabase) return;

      setError(null);
      setPost(undefined);

      const { data, error: loadError } = await getPostById(supabase, id);
      if (loadError) {
        if (!cancelled) setError(loadError.message);
        setPost(null);
        return;
      }

      if (!data) {
        if (!cancelled) setPost(null);
        return;
      }

      if (!data.published) {
        const isOwner = session?.user.id === data.user_id;
        if (!isOwner) {
          if (!cancelled) {
            setError("This post is not published yet.");
            setPost(null);
          }
          return;
        }
      }

      if (!cancelled) setPost(data);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [envMissing, id, router.isReady, session?.user.id, supabase]);

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

  if (!router.isReady || id === undefined) {
    return <div className="text-sm text-zinc-400">Loading…</div>;
  }

  if (!id) {
    return (
      <Card className="p-6">
        <div className="text-sm text-zinc-200">Invalid post id.</div>
      </Card>
    );
  }

  if (post === undefined) {
    return <div className="text-sm text-zinc-400">Loading post…</div>;
  }

  if (error || !post) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="text-sm text-zinc-200">
            {error ?? "Post not found."}
          </div>
          <div className="mt-4">
            <Link href="/">
              <ButtonGhost>Back to home</ButtonGhost>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const created = (() => {
    const d = new Date(post.created_at);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  })();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <div className="text-xs text-zinc-500">{created}</div>
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        {!post.published ? (
          <div className="text-sm text-amber-200/80">Draft (only visible to you)</div>
        ) : null}
      </div>

      <Card className="p-6">
        <article className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
          {post.content}
        </article>
      </Card>
    </div>
  );
}

