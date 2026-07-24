import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fffaf0] px-4 text-stone-950">
      <div className="w-full max-w-lg rounded-[8px] border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">404</p>
        <h1 className="mt-3 text-3xl font-black">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">This Pahuna page may have moved, or the listing is not public yet.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Go home</Link>
          <Link href="/hotels" className="rounded-md border border-emerald-200 px-5 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-50">Browse stays</Link>
        </div>
      </div>
    </main>
  );
}
