'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type VoteType = 'upvote' | 'downvote';

function voteTypeToValue(voteType: VoteType): number {
  return voteType === 'upvote' ? 1 : -1;
}

function valueToVoteType(value: number): VoteType {
  return value === 1 ? 'upvote' : 'downvote';
}

export default function CaptionVoteButtons({
  captionId,
  initialCount,
}: {
  captionId: string;
  initialCount: number;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [activeVote, setActiveVote] = useState<VoteType | null>(null);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('caption_votes')
        .select('vote_value')
        .eq('caption_id', captionId)
        .eq('profile_id', user.id)
        .maybeSingle();

      if (data) setActiveVote(valueToVoteType(data.vote_value));
    }
    init();
  }, [captionId]);

  async function handleVote(voteType: VoteType) {
    if (loading) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: existingVote } = await supabase
      .from('caption_votes')
      .select('id, vote_value')
      .eq('caption_id', captionId)
      .eq('profile_id', user.id)
      .maybeSingle();

    const newVoteValue = voteTypeToValue(voteType);

    if (existingVote) {
      if (existingVote.vote_value === newVoteValue) {
        // Toggle off
        await supabase.from('caption_votes').delete().eq('id', existingVote.id);
        setActiveVote(null);
        setCount((c) => c - newVoteValue);
      } else {
        // Switch vote
        await supabase
          .from('caption_votes')
          .update({
            vote_value: newVoteValue,
            modified_datetime_utc: new Date().toISOString(),
          })
          .eq('id', existingVote.id);
        setActiveVote(voteType);
        setCount((c) => c + newVoteValue * 2);
      }
    } else {
      // New vote
      await supabase.from('caption_votes').insert({
        caption_id: captionId,
        profile_id: user.id,
        vote_value: newVoteValue,
        created_datetime_utc: new Date().toISOString(),
      });
      setActiveVote(voteType);
      setCount((c) => c + newVoteValue);
    }

    setLoading(false);
  }

  const countColor =
    activeVote === 'downvote'
      ? 'text-red-400'
      : activeVote === 'upvote' || count > 0
        ? 'text-emerald-400'
        : 'text-white/30';
  const countLabel =
    activeVote === 'downvote' ? `-${Math.abs(count)}` : count > 0 ? `+${count}` : `${count}`;

  return (
    <div className="mt-4 flex items-center gap-3">
      {/* Buttons grouped in one pill */}
      <div className="inline-flex rounded-lg border border-white/[0.08] overflow-hidden">
        <button
          onClick={() => handleVote('upvote')}
          disabled={loading}
          className={`flex items-center justify-center w-10 h-9 border-r border-white/[0.08] transition-all ${
            activeVote === 'upvote'
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-white/[0.03] text-white/40 hover:text-emerald-300 hover:bg-emerald-500/10'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3L3 9h10L8 3z" fill={activeVote === 'upvote' ? 'currentColor' : 'none'} />
          </svg>
        </button>

        <button
          onClick={() => handleVote('downvote')}
          disabled={loading}
          className={`flex items-center justify-center w-10 h-9 transition-all ${
            activeVote === 'downvote'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-white/[0.03] text-white/40 hover:text-red-400 hover:bg-red-500/10'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 13L3 7h10L8 13z" fill={activeVote === 'downvote' ? 'currentColor' : 'none'} />
          </svg>
        </button>
      </div>

      {/* Vote count outside the pill */}
      <span className={`text-sm font-semibold tabular-nums ${countColor}`}>
        {countLabel}
      </span>
    </div>
  );
}
