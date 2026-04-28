import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserSingleton: SupabaseClient | null = null;

export function getBrowserSupabaseClient(): SupabaseClient {
  // Use static `process.env.NEXT_PUBLIC_*` access so Next.js inlines them in
  // the browser bundle. Dynamic `process.env[name]` is not replaced and is
  // always undefined on the client.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local (see .env.local.example).",
    );
  }

  // One client per browser tab — avoids Supabase "Multiple GoTrueClient instances"
  // warnings when several pages/hooks each call this via useMemo.
  if (typeof window !== "undefined") {
    if (!browserSingleton) {
      browserSingleton = createClient(url, anonKey);
    }
    return browserSingleton;
  }

  // SSR: never share a module singleton across requests.
  return createClient(url, anonKey);
}

