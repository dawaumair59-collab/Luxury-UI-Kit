import { useState } from "react";
import { SidebarContent, MobileSidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "hsl(0 0% 4%)" }}
    >
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(212,175,55,0.03) 0%, transparent 60%)",
        }}
      />

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 relative z-10"
        style={{
          background: "hsl(0 0% 5%)",
          borderRight: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        {/* Top nav */}
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ color: "hsl(45 15% 92%)" }}
        >
          {children}
        </main>
      </div>

      {/* Bottom gold bar */}
      <div className="fixed bottom-0 left-0 right-0 h-px gold-shimmer-bar pointer-events-none z-50" />
    </div>
  );
}
