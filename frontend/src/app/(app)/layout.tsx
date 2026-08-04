import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - Left margin offsets fixed sidebar (w-64 = 16rem = 256px) */}
      <div className="flex-1 lg:pl-64 min-w-0 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
