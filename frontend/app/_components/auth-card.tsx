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
    <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--pahuna-cream)] px-4 py-12">
      <div className="w-full max-w-md rounded-[8px] border border-[var(--pahuna-border)] bg-white p-8 shadow-[var(--pahuna-shadow)]">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black text-stone-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-stone-500">{footer}</div>
      </div>
    </div>
  );
}
