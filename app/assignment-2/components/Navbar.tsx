'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Navbar({ user }: { user: User | null }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const isMemeRater = pathname.startsWith('/assignment-2/meme-rater');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="w-full border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-end px-6 py-3">
        {user && (
          <div className="flex items-center gap-4">
            <Link
              href={isMemeRater ? '/assignment-2' : '/assignment-2/meme-rater'}
              className="text-white/70 text-sm underline transition-colors hover:text-emerald-400"
            >
              {isMemeRater ? 'Assignment 2' : 'Meme Rater'}
            </Link>
            <span className="text-white/70 text-sm">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
