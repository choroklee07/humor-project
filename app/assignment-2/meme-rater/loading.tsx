'use client';

import { useEffect, useRef } from 'react';

export default function MemeRaterLoading() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const fontSize = 14;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789!@#$%ΨΩ∞◈▓░';
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    window.addEventListener('resize', () => {
      resize();
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    });

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const isHead = Math.random() > 0.92;

        ctx.shadowBlur = isHead ? 20 : 6;
        ctx.shadowColor = '#ff00aa';
        ctx.fillStyle = isHead ? '#ffffff' : Math.random() > 0.5 ? '#ff1493' : '#ff00ff';
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 38);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Matrix rain */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
        }}
      />

      {/* Pink vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(200,0,100,0.18) 100%)',
        }}
      />

      {/* Centered content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen gap-10 px-6">

        {/* Title */}
        <div className="flex flex-col items-center gap-3">
          <h1
            className="text-4xl md:text-6xl font-mono font-bold tracking-[0.2em] animate-pulse"
            style={{
              color: '#ff1493',
              textShadow:
                '0 0 8px #ff1493, 0 0 20px #ff00ff, 0 0 40px #ff00aa, 3px 0 #00ffff, -3px 0 #ff00ff',
            }}
          >
            LOADING
          </h1>

          <div
            className="h-px w-64"
            style={{
              background:
                'linear-gradient(to right, transparent, #ff00ff, #ff1493, #ff00ff, transparent)',
              boxShadow: '0 0 8px #ff00ff',
            }}
          />

          <p
            className="text-xs font-mono tracking-[0.4em] animate-pulse"
            style={{ color: '#ff69b4', textShadow: '0 0 10px #ff1493' }}
          >
            {'// INITIALIZING MEME MATRIX'}
          </p>
        </div>

        {/* Card skeleton */}
        <div className="w-full max-w-md">
          <div
            className="relative w-full rounded-2xl p-4 space-y-4"
            style={{
              border: '1px solid #ff1493',
              background: 'rgba(255, 20, 147, 0.04)',
              boxShadow:
                '0 0 25px rgba(255, 20, 147, 0.25), inset 0 0 25px rgba(255, 0, 255, 0.04)',
            }}
          >
            {/* Corner brackets */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
              <div
                key={corner}
                className="absolute w-5 h-5"
                style={{
                  top: corner.startsWith('t') ? 0 : 'auto',
                  bottom: corner.startsWith('b') ? 0 : 'auto',
                  left: corner.endsWith('l') ? 0 : 'auto',
                  right: corner.endsWith('r') ? 0 : 'auto',
                  borderTop: corner.startsWith('t') ? '2px solid #ff00ff' : 'none',
                  borderBottom: corner.startsWith('b') ? '2px solid #ff00ff' : 'none',
                  borderLeft: corner.endsWith('l') ? '2px solid #ff00ff' : 'none',
                  borderRight: corner.endsWith('r') ? '2px solid #ff00ff' : 'none',
                  borderRadius:
                    corner === 'tl'
                      ? '12px 0 0 0'
                      : corner === 'tr'
                      ? '0 12px 0 0'
                      : corner === 'bl'
                      ? '0 0 0 12px'
                      : '0 0 12px 0',
                  boxShadow: '0 0 8px #ff00ff',
                }}
              />
            ))}

            {/* Image placeholder */}
            <div
              className="relative overflow-hidden rounded-xl aspect-[3/2] flex items-center justify-center"
              style={{
                background: 'rgba(255, 20, 147, 0.06)',
                border: '1px solid rgba(255, 20, 147, 0.2)',
              }}
            >
              <span
                className="font-mono text-sm animate-pulse tracking-widest"
                style={{ color: '#ff1493', textShadow: '0 0 12px #ff1493' }}
              >
                [ DECRYPTING IMAGE ]
              </span>
            </div>

            {/* Caption lines */}
            <div className="space-y-2 animate-pulse">
              <div
                className="h-3 w-3/4 rounded-full"
                style={{ background: 'rgba(255, 20, 147, 0.25)' }}
              />
              <div
                className="h-3 w-1/2 rounded-full"
                style={{ background: 'rgba(255, 20, 147, 0.15)' }}
              />
            </div>
          </div>

          {/* Vote button skeletons */}
          <div className="mt-6 flex justify-center gap-6">
            {['↑', '↓'].map((arrow) => (
              <div
                key={arrow}
                className="h-12 w-12 rounded-full flex items-center justify-center animate-pulse"
                style={{
                  border: '1px solid rgba(255, 20, 147, 0.5)',
                  background: 'rgba(255, 20, 147, 0.08)',
                  boxShadow: '0 0 12px rgba(255, 20, 147, 0.3)',
                  color: '#ff1493',
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  textShadow: '0 0 8px #ff1493',
                }}
              >
                {arrow}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
