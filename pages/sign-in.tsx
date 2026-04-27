import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, ButtonGhost, Input } from "@/components/ui";
import { getBrowserSupabaseClient } from "@/lib/supabaseClient";

export default function SignInPage() {
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return getBrowserSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!supabase) {
      setStatus("Supabase env vars missing. Copy .env.local.example to .env.local.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setStatus(error.message);
        return;
      }
      await router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm leading-6 text-zinc-400">
          Sign in to your dashboard. Minimal UI, soft shadows, and a clean dark
          theme—ready to map to Figma.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Email</label>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {status ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
              {status}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <Link className="w-full" href="/sign-up">
              <ButtonGhost className="w-full" type="button">
                Create account
              </ButtonGhost>
            </Link>
          </div>

          <p className="text-xs text-zinc-500">
            Tip: set <span className="text-zinc-300">NEXT_PUBLIC_SUPABASE_URL</span>{" "}
            and <span className="text-zinc-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>{" "}
            in <span className="text-zinc-300">.env.local</span>.
          </p>
        </form>
      </Card>
    </div>
  );
}

