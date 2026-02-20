'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type VoteType = 'upvote' | 'downvote';

// Map vote types to the smallint values stored in the DB
function voteTypeToValue(voteType: VoteType): number {
  return voteType === 'upvote' ? 1 : -1;
}

function valueToVoteType(value: number): VoteType {
  return value === 1 ? 'upvote' : 'downvote';
}

export function useVotingFunction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function vote(captionId: string, voteType: VoteType) {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to vote.');
      setLoading(false);
      return null;
    }

    // Check if the user has already voted on this caption
    const { data: existingVote } = await supabase
      .from('caption_votes')
      .select('id, vote_value')
      .eq('caption_id', captionId)
      .eq('profile_id', user.id)
      .maybeSingle();

    let result;
    const newVoteValue = voteTypeToValue(voteType);

    if (existingVote) {
      if (existingVote.vote_value === newVoteValue) {
        // Same vote again — remove it (toggle off)
        const { error: deleteError } = await supabase
          .from('caption_votes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteError) {
          setError(deleteError.message);
          setLoading(false);
          return null;
        }

        result = { action: 'removed' as const, voteType };
      } else {
        // Different vote — update it
        const { error: updateError } = await supabase
          .from('caption_votes')
          .update({
            vote_value: newVoteValue,
            modified_datetime_utc: new Date().toISOString(),
          })
          .eq('id', existingVote.id);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return null;
        }

        result = { action: 'changed' as const, voteType };
      }
    } else {
      // No existing vote — insert a new row
      const { error: insertError } = await supabase
        .from('caption_votes')
        .insert({
          caption_id: captionId,
          profile_id: user.id,
          vote_value: newVoteValue,
          created_datetime_utc: new Date().toISOString(),
        });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return null;
      }

      result = { action: 'voted' as const, voteType };
    }

    setLoading(false);
    return result;
  }

  async function getUserVote(captionId: string): Promise<VoteType | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from('caption_votes')
      .select('vote_value')
      .eq('caption_id', captionId)
      .eq('profile_id', user.id)
      .maybeSingle();

    if (!data) return null;
    return valueToVoteType(data.vote_value);
  }

  return { vote, getUserVote, loading, error };
}
