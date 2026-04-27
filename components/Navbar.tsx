import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "@/lib/useSession";

const navLinkBase =
  "rounded-full px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition";
const navLinkActive = "bg-white/10 text-white";

export function Navbar() {
  const router = useRouter();
  const path = router.pathname;
  const { supabase, session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-semibold tracking-tight text-white hover:bg-white/5"
        >
          <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_24px_rgba(99,102,241,0.7)]" />
          SoftBlog
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <nav className="flex items-center gap-1">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`${navLinkBase} ${path === "/dashboard" ? navLinkActive : ""}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/create-post"
                  className={`${navLinkBase} ${path === "/create-post" ? navLinkActive : ""}`}
                >
                  Create
                </Link>
                <button
                  type="button"
                  className="rounded-full px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
                  onClick={async () => {
                    await supabase?.auth.signOut();
                    await router.push("/sign-in");
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={`${navLinkBase} ${path === "/sign-in" ? navLinkActive : ""}`}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={`${navLinkBase} ${path === "/sign-up" ? navLinkActive : ""}`}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>

        <details className="relative md:hidden">
          <summary className="list-none rounded-full border border-white/10 bg-white/0 px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/5">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 p-1 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur">
            {session ? (
              <div className="flex flex-col">
                <Link
                  href="/dashboard"
                  className="rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <Link
                  href="/create-post"
                  className="rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  Create
                </Link>
                <button
                  type="button"
                  className="rounded-xl px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                  onClick={async () => {
                    await supabase?.auth.signOut();
                    await router.push("/sign-in");
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <Link
                  href="/sign-in"
                  className="rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}

