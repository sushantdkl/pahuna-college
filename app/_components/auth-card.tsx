import type { ReactNode } from "react";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-b from-white via-green-50 to-white px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200/70 bg-white/90 p-8 shadow-xl shadow-green-100/60 backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
      </div>
    </div>
  );
}
