'use client';

import { useState, useCallback } from 'react';
import { processImageAndGenerateCaptions } from './functions';
import Processing from './Processing';

type Step = 'upload' | 'processing' | 'results' | 'meme';

const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
];

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export default function MemeCompilerClient() {
  const [step, setStep] = useState<Step>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = useCallback((file: File) => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      setError(
        'Unsupported image type. Please use JPEG, PNG, WebP, GIF, or HEIC.',
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be less than 1MB');
      return;
    }

    setError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const processImage = async () => {
    if (!selectedImage || !imageFile) {
      setError('Please select an image first');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      const result = await processImageAndGenerateCaptions(
        selectedImage,
        imageFile.type,
      );

      if (!result.success || !result.captions) {
        throw new Error(result.error || 'Failed to generate captions');
      }

      setCaptions(result.captions);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('upload');
    }
  };

  const reset = () => {
    setStep('upload');
    setSelectedImage(null);
    setImageFile(null);
    setCaptions([]);
    setSelectedCaption(null);
    setError(null);
  };

  const selectCaption = (caption: string) => {
    setSelectedCaption(caption);
    setStep('meme');
  };

  const backToResults = () => {
    setSelectedCaption(null);
    setStep('results');
  };

  const downloadMeme = async () => {
    if (!selectedImage || !selectedCaption) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const gradientHeight = img.height * 0.25;
      const gradient = ctx.createLinearGradient(
        0,
        img.height - gradientHeight,
        0,
        img.height,
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, img.height - gradientHeight, img.width, gradientHeight);

      const fontSize = Math.max(16, img.width / 20);
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const maxWidth = img.width - 40;
      const words = selectedCaption.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = fontSize * 1.3;
      const startY = img.height - 20 - (lines.length - 1) * lineHeight;
      lines.forEach((line, i) => {
        ctx.fillText(line, img.width / 2, startY + i * lineHeight);
      });

      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = selectedImage;
  };

  return (
    <div className="px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl md:text-4xl lg:text-3xl font-extralight tracking-tight text-white/90">
            Meme Compiler
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl border border-pink-400/30 bg-pink-500/10 text-pink-300 text-sm">
            {error}
          </div>
        )}

        {step === 'upload' && (
          <div className="flex flex-col gap-5 items-center">
            {/* Drop zone */}
            <div className="relative w-[70%]">
              {/* Corner brackets */}
              <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-pink-400/70 z-10 pointer-events-none" />
              <div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-pink-400/70 z-10 pointer-events-none" />
              <div className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-pink-400/70 z-10 pointer-events-none" />
              <div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-pink-400/70 z-10 pointer-events-none" />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border border-pink-500/20 bg-[linear-gradient(rgba(236,72,153,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.025)_1px,transparent_1px)] bg-[size:28px_28px] aspect-[4/3] cursor-pointer hover:border-pink-400/40 hover:bg-pink-500/[0.04] transition-all overflow-hidden group"
              >
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)] pointer-events-none" />

                <input
                  type="file"
                  accept={SUPPORTED_TYPES.join(',')}
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  {selectedImage ? (
                    <div className="flex flex-col items-center gap-3 w-full h-full p-5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="flex-1 min-h-0 max-w-full object-contain"
                      />
                      <p className="text-pink-400/50 text-xs shrink-0 font-mono tracking-widest uppercase">
                        ▸ click or drag to swap
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="text-pink-400/30 mb-2 group-hover:text-pink-400/50 transition-colors"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p className="text-white/70 text-sm font-mono tracking-widest uppercase">
                        Drop Image
                      </p>
                      <p className="text-white/30 text-xs font-mono">
                        or click to browse · max 1MB
                      </p>
                      <p className="text-pink-400/30 text-xs mt-2 font-mono tracking-widest">
                        JPG · PNG · WEBP · GIF · HEIC
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={processImage}
              disabled={!selectedImage}
              className={`px-10 py-2.5 text-xs font-mono tracking-widest uppercase transition-all ${
                selectedImage
                  ? 'border border-pink-400/60 bg-pink-500/10 text-pink-300 shadow-[0_0_20px_-4px_rgba(236,72,153,0.5),inset_0_0_14px_-6px_rgba(236,72,153,0.15)] hover:bg-pink-500/18 hover:shadow-[0_0_28px_-4px_rgba(236,72,153,0.65),inset_0_0_18px_-6px_rgba(236,72,153,0.2)] cursor-pointer'
                  : 'border border-white/[0.05] text-white/15 cursor-not-allowed'
              }`}
            >
              ▸ Generate Captions
            </button>
          </div>
        )}

        {step === 'processing' && <Processing imageUrl={selectedImage} />}

        {step === 'results' && (
          <div
            className={`grid gap-6 items-start ${selectedImage ? 'grid-cols-2' : 'grid-cols-1'}`}
          >
            {selectedImage && (
              <div className="sticky top-5 flex flex-col items-center gap-4 p-4 rounded-2xl border border-white/[0.2] bg-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="max-w-full max-h-[480px] rounded-xl object-contain"
                />
                <div className="flex gap-2">
                  <button
                    onClick={processImage}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-pink-400/50 bg-pink-500/15 text-pink-300 text-xs font-medium hover:bg-pink-500/25 transition-all cursor-pointer shadow-[0_0_12px_-4px_rgba(236,72,153,0.3)]"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                    Regenerate
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 text-xs font-medium hover:border-white/20 hover:text-white/70 transition-all cursor-pointer"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    New
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h2 className="text-white text-sm font-light tracking-wide">
                Pick your favorite:
              </h2>
              <div className="flex flex-col gap-2">
                {captions.map((caption, index) => (
                  <div
                    key={index}
                    onClick={() => selectCaption(caption)}
                    className="flex items-stretch rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden cursor-pointer hover:border-pink-400/30 hover:bg-pink-500/10 transition-all group"
                  >
                    <div className="flex items-center justify-center w-9 bg-white/[0.2] text-white/20 text-xs font-medium shrink-0 group-hover:text-pink-400/60 transition-colors">
                      {index + 1}
                    </div>
                    <p className="m-0 px-3 py-3 flex-1 text-white text-lg leading-snug group-hover:text-white/90 transition-colors">
                      {caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'meme' && selectedImage && selectedCaption && (
          <div className="flex flex-col items-center gap-5">
            <div className="relative inline-block max-w-full rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Meme"
                className="max-w-full max-h-96 block rounded-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 px-3 py-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                <p className="m-0 text-white text-lg font-bold text-center leading-snug [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">
                  {selectedCaption}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={backToResults}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 text-sm font-medium hover:border-white/20 hover:text-white/70 transition-all cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back
              </button>
              <button
                onClick={downloadMeme}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-400/50 bg-emerald-500/15 text-emerald-300 text-sm font-medium hover:bg-emerald-500/25 transition-all cursor-pointer shadow-[0_0_12px_-4px_rgba(52,211,153,0.3)]"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-pink-400/50 bg-pink-500/15 text-pink-300 text-sm font-medium hover:bg-pink-500/25 transition-all cursor-pointer shadow-[0_0_12px_-4px_rgba(236,72,153,0.3)]"
              >
                New Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
