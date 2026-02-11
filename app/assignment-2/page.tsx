import Image from "next/image";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function Assignment2() {
  const { data: captions, error } = await supabase
    .from("captions")
    .select("id, content, like_count, images(id, url)")
    .order("like_count", { ascending: false })
    .limit(10);

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/8 blur-[100px] animate-pulse [animation-delay:4s]" />

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-16">
        <div className="flex flex-col items-center gap-4">
          <p className="text-emerald-400/60 text-sm tracking-[0.3em] uppercase font-light">
            Assignment 02
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white/90">
            Top Captions
          </h1>
          <div className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        </div>

        {error && (
          <p className="text-red-400/80 text-sm">
            Failed to load captions. Please try again later.
          </p>
        )}

        {captions && captions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            {captions.map((caption, index) => (
              <div
                key={caption.id}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-5 transition-all hover:border-emerald-400/20 hover:bg-white/[0.06]"
              >
                {/* Rank badge */}
                <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-400/20">
                  {index + 1}
                </span>

                {/* Image */}
                {caption.images && (
                  <div className="relative mb-4 overflow-hidden rounded-xl h-48">
                    <Image
                      src={(caption.images as unknown as { id: string; url: string }).url}
                      alt="Caption image"
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Caption text */}
                <p className="text-white/80 font-light leading-relaxed">
                  {caption.content}
                </p>

                {/* Like count */}
                <div className="mt-3 flex items-center gap-1.5 text-emerald-400/50 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{caption.like_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {captions && captions.length === 0 && (
          <p className="text-white/40 text-sm mt-8">No captions found.</p>
        )}
      </div>
    </div>
  );
}
