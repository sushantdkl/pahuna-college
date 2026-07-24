"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fffaf0] px-4 text-stone-950">
      <div className="w-full max-w-lg rounded-[8px] border border-red-100 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">Page error</p>
        <h1 className="mt-3 text-3xl font-black">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">The page could not finish loading. You can retry or return to the public homepage.</p>
        {error.digest ? <p className="mt-4 rounded-md bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-500">Error digest: {error.digest}</p> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Try again</button>
          <Link href="/" className="rounded-md border border-emerald-200 px-5 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-50">Go home</Link>
        </div>
      </div>
    </main>
  );
}
