import Navbar from "@/components/layout/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Decorative Gradient Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl" />

      <Navbar />
      <main className="relative z-10 flex items-center justify-center px-4 py-12 sm:py-16">
        {children}
      </main>
    </div>
  );
}
