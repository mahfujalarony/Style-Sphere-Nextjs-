export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-14">
        <div className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100" />
        <div className="space-y-4 lg:pt-8">
          <div className="h-8 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="h-28 w-full animate-pulse rounded bg-slate-100" />
        </div>
      </section>
    </main>
  );
}
