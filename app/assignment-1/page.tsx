export default function Assignment1() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/8 blur-[100px] animate-pulse [animation-delay:4s]" />

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-emerald-400/60 text-sm tracking-[0.3em] uppercase font-light">
          Assignment 01
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight text-white/90">
          Hello World!
        </h1>
        <div className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      </div>
    </div>
  );
}
