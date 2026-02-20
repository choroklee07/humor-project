import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950">
      <main className="flex flex-col items-center gap-12">
        <h1 className="text-4xl font-extralight tracking-tight text-white/90">
          Assignments
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/assignment-1"
            className="flex h-14 w-56 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            Assignment 1
          </Link>
          <Link
            href="/assignment-2"
            className="flex h-14 w-56 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            Assignment 2-4
          </Link>
        </div>
      </main>
    </div>
  );
}
