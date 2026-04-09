import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import Navbar from './assignment-2/components/Navbar';
import AuthButton from './assignment-2/components/AuthButton';
import CaptionVoteButtons from './components/CaptionVoteButtons';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  type Caption = {
    id: string;
    content: string;
    like_count: number;
    images: { id: string; url: string } | null;
  };

  let captions: Caption[] | null = null;
  let fetchError = false;

  if (user) {
    const result = await supabase
      .from('captions')
      .select('id, content, like_count, images(id, url)')
      .order('like_count', { ascending: false })
      .limit(10);

    captions = result.data as Caption[] | null;
    fetchError = !!result.error;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/8 blur-[100px] animate-pulse [animation-delay:4s]" />

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Navbar */}
      {user && (
        <div className="relative z-10">
          <Navbar user={user} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-6 px-6 pb-32">
        {!user && (
          <div className="flex flex-col items-center gap-5">
            {/* Title */}
            <div className="relative inline-flex flex-col items-center">
              <div className="mb-3 flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-500/50" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-500/50" />
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white whitespace-nowrap">
                THE <span className="text-emerald-400/80">HUMOR</span> PROJECT
              </h1>
              <div className="mt-1 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            </div>
            <p className="font-mono text-center text-white text-xl tracking-widest">
              <span className="text-emerald-500/60">{'// '}</span>
              Rate, compile, and share the funniest meme you generate
            </p>
          </div>
        )}

        {params.error && (
          <p className="text-red-400/80 text-sm">
            Authentication failed. Please try again.
          </p>
        )}

        {!user && (
          <div className="flex flex-col items-center gap-6 mt-4">
            <p className="text-white/80 text-lg font-light">
              Sign in with Google to view the top captions.
            </p>
            <AuthButton user={user} />
          </div>
        )}

        {user && (
          <div className="flex flex-col items-center gap-2 pt-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white/90">
              Top Captions
            </h1>
            <div className="w-10 h-0.5 bg-emerald-500/60 rounded-full" />
          </div>
        )}

        {user && fetchError && (
          <p className="text-red-400/80 text-sm">
            Failed to load captions. Please try again later.
          </p>
        )}

        {user && captions && captions.length > 0 && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            {captions.map((caption, index) => (
              <div
                key={caption.id}
                className="group relative rounded-2xl border-2 border-pink-400/40 bg-pink-500/20 backdrop-blur-sm p-5 transition-all"
              >
                {/* Rank badge */}
                <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-400/20">
                  {index + 1}
                </span>

                {/* Image */}
                {caption.images && (
                  <div className="relative mb-4 overflow-hidden rounded-xl h-70">
                    <Image
                      src={caption.images.url}
                      alt="Caption image"
                      fill
                      unoptimized
                      className="object-contain transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Caption text */}
                <p className="text-white/90 font-bold leading-relaxed text-xl">
                  {caption.content}
                </p>

                {/* Vote buttons */}
                <CaptionVoteButtons
                  captionId={caption.id}
                  initialCount={caption.like_count}
                />
              </div>
            ))}
          </div>
        )}

        {user && captions && captions.length === 0 && (
          <p className="text-white/40 text-sm mt-8">No captions found.</p>
        )}
      </div>
    </div>
  );
}
