import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { PostCard } from "@/components/PostCard";
import { Button, ButtonGhost } from "@/components/ui";
import { getBrowserSupabaseClient } from "@/lib/supabaseClient";
import { listPublishedPosts, type PostListRow } from "@/lib/posts";

export default function Home() {
  const supabase = useMemo(() => {
    try {
      return getBrowserSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  const [posts, setPosts] = useState<PostListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!supabase) {
        setError("Supabase env vars missing. Copy .env.local.example to .env.local.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const { data, error: loadError } = await listPublishedPosts(supabase, 12);
      if (loadError) {
        if (!cancelled) {
          setError(
            loadError.message ??
              "Failed to load posts. Did you run the Supabase SQL setup?",
          );
          setPosts([]);
        }
        setLoading(false);
        return;
      }

      if (!cancelled) setPosts(data ?? []);
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [supabase]);
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">SoftBlog</h1>
          <p className="text-sm leading-6 text-zinc-400">
            A modern, minimal blog UI with a dark theme—rounded cards, soft
            shadows, and a clean navbar. Authentication + posts are powered by
            Supabase.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up">
              <Button>Get started</Button>
            </Link>
            <Link href="/sign-in">
              <ButtonGhost>Sign in</ButtonGhost>
            </Link>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-white">What’s included</div>
            <ul className="space-y-1 text-sm text-zinc-400">
              <li>
                <span className="text-zinc-200">Home</span> — published posts
              </li>
              <li>
                <span className="text-zinc-200">Dashboard</span> — your posts
              </li>
              <li>
                <span className="text-zinc-200">Create</span> — publish a post
              </li>
              <li>
                <span className="text-zinc-200">Blog detail</span> —{" "}
                <span className="text-zinc-200">/blog/[id]</span>
              </li>
            </ul>
            <div className="pt-3 text-xs text-zinc-500">
              Configure <span className="text-zinc-300">.env.local</span> and run
              the SQL in <span className="text-zinc-300">supabase/schema.sql</span>
              .
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Latest posts</h2>
            <p className="text-sm text-zinc-400">
              Public posts where <span className="text-zinc-200">published = true</span>
              .
            </p>
          </div>
        </div>

        {error ? (
          <Card className="p-6">
            <div className="text-sm text-zinc-200">{error}</div>
          </Card>
        ) : null}

        {loading ? (
          <div className="text-sm text-zinc-400">Loading posts…</div>
        ) : !error && posts.length === 0 ? (
          <Card className="p-6">
            <div className="text-sm text-zinc-300">No published posts yet.</div>
            <div className="mt-1 text-sm text-zinc-500">
              Sign in, create a post, and you’ll see it here.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                id={p.id}
                title={p.title}
                content={p.content}
                createdAt={p.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
