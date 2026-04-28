import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui";
import { listMyPosts, type PostListRow } from "@/lib/posts";
import { useSession } from "@/lib/useSession";

export default function DashboardPage() {
  const router = useRouter();
  const { supabase, session, loading, envMissing } = useSession();
  const [posts, setPosts] = useState<PostListRow[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !envMissing && !session) {
      void router.replace("/sign-in");
    }
  }, [envMissing, loading, router, session]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (envMissing) {
        setPostsLoading(false);
        return;
      }
      if (!supabase || !session) {
        setPostsLoading(false);
        return;
      }

      setPostsLoading(true);
      setPostsError(null);
      const { data, error } = await listMyPosts(supabase);
      if (error) {
        if (!cancelled) {
          setPostsError(error.message);
          setPosts([]);
        }
        setPostsLoading(false);
        return;
      }

      if (!cancelled) setPosts(data ?? []);
      setPostsLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [envMissing, session, supabase]);

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
    return (
      <div className="text-sm text-zinc-400">
        Loading your session…
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Signed in as{" "}
          <span className="text-zinc-200">{session.user.email}</span>
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-sm font-semibold">Your posts</div>
            <div className="text-sm text-zinc-400">
              Drafts and published posts (based on your Supabase RLS rules).
            </div>
          </div>
          <Link href="/create-post">
            <Button>Create post</Button>
          </Link>
        </div>
      </Card>

      {postsError ? (
        <Card className="p-6">
          <div className="text-sm text-zinc-200">{postsError}</div>
        </Card>
      ) : null}

      {postsLoading ? (
        <div className="text-sm text-zinc-400">Loading your posts…</div>
      ) : !postsError && posts.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm text-zinc-300">No posts yet.</div>
          <div className="mt-1 text-sm text-zinc-500">
            Create your first post to see it here and on the home feed (when
            published).
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
              rightSlot={p.published ? "Published" : "Draft"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

