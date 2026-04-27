import { type PropsWithChildren } from "react";
import { Navbar } from "@/components/Navbar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh bg-[#07070b] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-240px] right-[-200px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </div>
    </div>
  );
}

