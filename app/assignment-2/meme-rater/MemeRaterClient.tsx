'use client';

import { useState } from 'react';
import VoteCard from './VoteCard';
import VoteButtons from './VoteButtons';

type Caption = {
  id: string;
  content: string;
  like_count: number;
  images: { id: string; url: string } | null;
};

export default function MemeRaterClient({ captions }: { captions: Caption[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (currentIndex >= captions.length) {
    return (
      <p className="mt-12 text-white/40 text-sm font-light">
        You've rated all the memes!
      </p>
    );
  }

  const caption = captions[currentIndex];

  function handleVoted() {
    setCurrentIndex((i) => i + 1);
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-5 w-full max-w-xl">
      <span className="text-white/40 text-sm font-light">
        {currentIndex + 1} / {captions.length}
      </span>
      <VoteCard caption={caption} />
      <VoteButtons captionId={caption.id} key={caption.id} onVoted={handleVoted} />
    </div>
  );
}
