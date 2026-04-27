import { type PropsWithChildren } from "react";

export function Card({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-zinc-950/60 shadow-[0_10px_60px_rgba(0,0,0,0.55)]",
        "backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

