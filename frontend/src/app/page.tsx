export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center z-10 space-y-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-10 rounded-2xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Phase 5A — Frontend Foundation Initialized
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Delivery Agent Management System
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Frontend application shell successfully configured with Next.js App Router, TypeScript, and Tailwind CSS. Connects to Node.js backend REST API at{' '}
          <code className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-sm">
            http://localhost:4000
          </code>.
        </p>

        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
            <span className="text-slate-500">Backend Status:</span>
            <span className="text-emerald-400 font-medium">Ready (Port 4000)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
            <span className="text-slate-500">Dashboard UI:</span>
            <span className="text-indigo-400 font-medium">Pending Phase 5B</span>
          </div>
        </div>
      </div>
    </main>
  );
}
