import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';
import MemeCompilerClient from './MemeCompilerClient';

export default async function MemeCompilerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/assignment-2');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/15 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/8 blur-[100px]" />

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar user={user} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <MemeCompilerClient />
      </div>
    </div>
  );
}
