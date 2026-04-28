import type { SupabaseClient } from "@supabase/supabase-js";

export type PostListRow = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
};

export type PostDetail = PostListRow & {
  user_id: string;
  updated_at: string;
};

export async function listPublishedPosts(
  supabase: SupabaseClient,
  limit = 12,
) {
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,content,published,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: (data ?? null) as PostListRow[] | null, error };
}

export async function listMyPosts(supabase: SupabaseClient) {
  // Do not trust a caller-provided user id. Always derive it from the current
  // authenticated user to prevent accidental/unsafe impersonation patterns.
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) return { data: null as PostListRow[] | null, error: userError };
  const userId = userData.user?.id;
  if (!userId) {
    return {
      data: null as PostListRow[] | null,
      error: new Error("Not authenticated"),
    };
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,content,published,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data: (data ?? null) as PostListRow[] | null, error };
}

export async function getPostById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,content,published,created_at,updated_at,user_id")
    .eq("id", id)
    .maybeSingle();

  return { data: (data ?? null) as PostDetail | null, error };
}
