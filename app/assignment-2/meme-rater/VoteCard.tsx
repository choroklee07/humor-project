import Image from 'next/image';

type Caption = {
  id: string;
  content: string;
  like_count: number;
  images: { id: string; url: string } | null;
};

export default function VoteCard({ caption }: { caption: Caption }) {
  return (
    <div className="group relative w-full rounded-2xl border-2 border-pink-400 bg-pink-500/20 backdrop-blur-sm p-4 sm:p-4 transition-all">
      {/* Subtle top edge glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/20 to-transparent rounded-t-2xl" />

      {/* Meme image */}
      {caption.images ? (
        <div className="relative overflow-hidden rounded-xl aspect-[3/2] bg-black/30">
          <Image
            src={caption.images.url}
            alt="Meme"
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
          <span className="text-white/20 text-sm font-light tracking-wide">
            No image
          </span>
        </div>
      )}

      {/* Caption text */}
      <p className="relative text-lg sm:text-2xl text-white  leading-relaxed text-left">
        {caption.content}
      </p>
    </div>
  );
}
