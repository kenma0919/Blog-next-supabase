import { type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";

export function Button({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold",
        "bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function ButtonGhost({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold",
        "border border-white/10 bg-white/0 text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "h-11 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 text-sm text-white",
        "placeholder:text-zinc-500 outline-none",
        "focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

