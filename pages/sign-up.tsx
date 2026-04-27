import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, ButtonGhost, Input } from "@/components/ui";
import { getBrowserSupabaseClient } from "@/lib/supabaseClient";

export default function SignUpPage() {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      // If email confirmations are enabled, session may be null here.
      if (!data.session) {
        setStatus("Check your email to confirm your account, then sign in.");
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
        <h1 className="text-3xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm leading-6 text-zinc-400">
          A clean, modern blog starter with a dark theme, rounded cards, and soft
          shadows.
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
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {status ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
              {status}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign up"}
            </Button>
            <Link className="w-full" href="/sign-in">
              <ButtonGhost className="w-full" type="button">
                I already have an account
              </ButtonGhost>
            </Link>
          </div>

          <p className="text-xs text-zinc-500">
            If Supabase email confirmation is enabled, you’ll need to confirm
            before signing in.
          </p>
        </form>
      </Card>
    </div>
  );
}

