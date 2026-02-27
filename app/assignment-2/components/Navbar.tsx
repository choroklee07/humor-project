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
  const isMemeCompiler = pathname.startsWith('/assignment-2/meme-compiler');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/assignment-2');
  };

  return (
    <nav className="w-full border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link
          href="/assignment-2"
          className="text-white/50 transition-colors hover:text-emerald-400"
          aria-label="Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            {!isMemeRater && (
              <Link
                href="/assignment-2/meme-rater"
                className="text-white/70 text-sm underline transition-colors hover:text-emerald-400"
              >
                Meme Rater
              </Link>
            )}
            {!isMemeCompiler && (
              <Link
                href="/assignment-2/meme-compiler"
                className="text-white/70 text-sm underline transition-colors hover:text-emerald-400"
              >
                Meme Compiler
              </Link>
            )}
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
