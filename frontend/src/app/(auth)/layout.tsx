import Navbar from "@/components/layout/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-14">{children}</main>
    </div>
  );
}
