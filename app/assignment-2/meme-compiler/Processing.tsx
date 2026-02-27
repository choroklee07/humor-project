'use client';

import { useEffect, useState } from 'react';

type ProcessingProps = {
  imageUrl?: string | null;
};

const STATUS_LINES = [
  'INITIALIZING NEURAL NETWORK',
  'SCANNING IMAGE MATRIX',
  'EXTRACTING VISUAL CONTEXT',
  'SYNTHESIZING CAPTION DATA',
  'RUNNING HUMOR ALGORITHMS',
];

export default function Processing({ imageUrl }: ProcessingProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(4);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_LINES.length);
    }, 1400);

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 7 + 1;
        return next >= 90 ? 90 : next;
      });
    }, 600);

    const dotsTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);

    return () => {
      clearInterval(statusTimer);
      clearInterval(progressTimer);
      clearInterval(dotsTimer);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-6 py-10 px-4">
      {/* Corner brackets */}
      <span className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-cyan-400/60" />
      <span className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-cyan-400/60" />
      <span className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-cyan-400/60" />
      <span className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-cyan-400/60" />

      {/* System header */}
      <div className="flex items-center gap-2 text-cyan-400/70 font-mono text-xs tracking-widest animate-flicker">
        <span className="text-pink-500/80">◈</span>
        CAPTION.SYS
        <span className="text-pink-500/80">◈</span>
      </div>

      {/* Spinner stack */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-cyber-cw"
          style={{ borderTopColor: 'rgba(0,255,240,0.9)', borderRightColor: 'rgba(0,255,240,0.3)' }} />
        {/* Middle ring */}
        <div className="absolute inset-2 rounded-full border border-pink-500/20 animate-cyber-ccw"
          style={{ borderBottomColor: 'rgba(236,72,153,0.85)', borderLeftColor: 'rgba(236,72,153,0.25)' }} />
        {/* Inner square rotated */}
        <div className="absolute inset-[28%] border border-cyan-300/50 animate-cyber-cw"
          style={{ transform: 'rotate(45deg)', animation: 'cyber-spin-cw 3s linear infinite' }} />
        {/* Center dot */}
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(0,255,240,0.8)]" />
      </div>

      {/* Glitch title */}
      <div className="relative font-mono font-bold tracking-[0.3em] text-lg select-none">
        <span className="text-white/90">PROCESSING</span>
        {/* glitch layer */}
        <span
          aria-hidden
          className="absolute inset-0 text-cyan-400/70 animate-glitch pointer-events-none"
          style={{ textShadow: '2px 0 rgba(236,72,153,0.7)' }}
        >
          PROCESSING
        </span>
      </div>

      {/* Terminal status */}
      <div className="w-full max-w-xs font-mono text-xs">
        <div className="border border-cyan-400/15 bg-black/30 rounded px-3 py-2.5 flex items-start gap-2">
          <span className="text-cyan-400/60 shrink-0 mt-px">▶</span>
          <span className="text-cyan-300/80">
            {STATUS_LINES[statusIndex]}{dots}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs flex flex-col gap-1.5">
        <div className="relative h-1.5 rounded-full bg-white/[0.05] overflow-hidden border border-cyan-400/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 animate-progress-glow transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-white/20">
          <span>0x0000</span>
          <span className="text-cyan-400/50">{Math.round(progress)}%</span>
          <span>0xFFFF</span>
        </div>
      </div>

      {/* Image with scanline overlay */}
      {imageUrl && (
        <div className="relative mt-1 rounded overflow-hidden border border-cyan-400/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Processing"
            className="max-h-32 block opacity-20 saturate-0"
          />
          {/* cyan tint */}
          <div className="absolute inset-0 bg-cyan-500/10 mix-blend-screen pointer-events-none" />
          {/* scanline strip */}
          <div className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent animate-scanline pointer-events-none" />
          {/* horizontal line overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,240,0.03) 3px, rgba(0,255,240,0.03) 4px)',
            }}
          />
        </div>
      )}
    </div>
  );
}
