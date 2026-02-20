'use client';

import { useState, useEffect } from 'react';
import { useVotingFunction, VoteType } from './useVotingFunction';

export default function VoteButtons({ captionId, onVoted }: { captionId: string; onVoted?: () => void }) {
  const { vote, getUserVote, loading } = useVotingFunction();
  const [activeVote, setActiveVote] = useState<VoteType | null>(null);

  useEffect(() => {
    getUserVote(captionId).then(setActiveVote);
  }, [captionId]);

  async function handleVote(voteType: VoteType) {
    const result = await vote(captionId, voteType);
    if (!result) return;

    if (result.action === 'removed') {
      setActiveVote(null);
    } else {
      setActiveVote(result.voteType);
      onVoted?.();
    }
  }

  return (
    <div className="flex flex-row items-center gap-3">
      {/* Upvote */}
      <button
        onClick={() => handleVote('upvote')}
        disabled={loading}
        className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${
          activeVote === 'upvote'
            ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300 shadow-[0_0_16px_-4px_rgba(52,211,153,0.3)]'
            : 'border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-emerald-400/30 hover:text-emerald-300 hover:bg-emerald-500/10'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M8 3L3 9h10L8 3z"
            fill={activeVote === 'upvote' ? 'currentColor' : 'none'}
          />
        </svg>
      </button>

      <div className="w-px h-6 bg-white/[0.06]" />

      {/* Downvote */}
      <button
        onClick={() => handleVote('downvote')}
        disabled={loading}
        className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${
          activeVote === 'downvote'
            ? 'border-pink-400/50 bg-pink-500/15 text-pink-300 shadow-[0_0_16px_-4px_rgba(236,72,153,0.3)]'
            : 'border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-pink-400/30 hover:text-pink-300 hover:bg-pink-500/10'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M8 13L3 7h10L8 13z"
            fill={activeVote === 'downvote' ? 'currentColor' : 'none'}
          />
        </svg>
      </button>
    </div>
  );
}
