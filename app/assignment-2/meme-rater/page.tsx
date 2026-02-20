import { createClient } from '@/lib/supabase/server';
import Navbar from '../components/Navbar';
import MemeRaterClient from './MemeRaterClient';

export default async function MemeRater() {
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

  if (user) {
    const { data } = await supabase
      .from('captions')
      .select('id, content, like_count, images!inner(id, url)')
      .not('images.url', 'is', null)
      .like('images.url', 'http%')
      .order('like_count', { ascending: false })
      .limit(100);

    if (data) {
      // Normalize inner join result (images comes as object, not array)
      const rows = (data as unknown as Caption[]);

      // Check which image URLs actually work (HEAD request, parallel)
      const checks = await Promise.all(
        rows.map(async (caption) => {
          try {
            const res = await fetch(caption.images!.url, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
            return res.ok ? caption : null;
          } catch {
            return null;
          }
        })
      );
      captions = checks.filter((c): c is Caption => c !== null).slice(0, 50);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/15 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/8 blur-[100px]" />

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Navbar */}
      {user && (
        <div className="relative z-10">
          <Navbar user={user} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-1 px-6 py-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl md:text-4xl lg:text-3xl font-extralight tracking-tight text-white/90">
            Meme Rater
          </h1>
          <div className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        </div>

        {user && captions && captions.length > 0 && (
          <MemeRaterClient captions={captions} />
        )}

        {user && captions && captions.length === 0 && (
          <p className="text-white/40 text-sm mt-8">No captions found.</p>
        )}
      </div>
    </div>
  );
}
