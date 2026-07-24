export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fffaf0] px-4 text-stone-950">
      <div className="w-full max-w-md rounded-[8px] border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-black">Loading Pahuna</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">Preparing the latest public travel, stay, route, and training information.</p>
      </div>
    </main>
  );
}
