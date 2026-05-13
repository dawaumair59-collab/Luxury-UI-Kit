import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/menus": "Menus",
  "/dashboard/qr": "QR Codes",
  "/dashboard/analytics": "Analytics",
  "/dashboard/integrations": "Integrations",
  "/dashboard/settings": "Settings",
  "/dashboard/help": "Help & Docs",
};

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const restaurantName = (user?.user_metadata?.restaurant_name as string) || "Your Restaurant";
  const email = user?.email ?? "";
  const initials = restaurantName.slice(0, 2).toUpperCase();
  const pageTitle = PAGE_TITLES[location] ?? "Dashboard";

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Sign out failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Signed out", description: "See you next time." });
    navigate("/login");
  }

  return (
    <header
      className="h-16 flex items-center justify-between px-5 flex-shrink-0 relative"
      style={{
        background: "hsl(0 0% 5%)",
        borderBottom: "1px solid rgba(212,175,55,0.1)",
      }}
    >
      {/* Left side — hamburger + breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex flex-col justify-center gap-1.5 w-8 h-8 glass-gold rounded-sm items-center transition-all duration-200 hover:glow-gold-sm"
          aria-label="Open menu"
        >
          <span className="w-4 h-px" style={{ background: "rgba(212,175,55,0.7)" }} />
          <span className="w-3 h-px" style={{ background: "rgba(212,175,55,0.5)" }} />
          <span className="w-4 h-px" style={{ background: "rgba(212,175,55,0.7)" }} />
        </button>

        {/* Page title */}
        <div>
          <p
            className="text-[9px] tracking-widest-luxury uppercase"
            style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}
          >
            MenuLux
          </p>
          <h2
            className="text-base font-semibold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
          >
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Right side — actions + avatar */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-8 h-8 glass rounded-sm flex items-center justify-center transition-all duration-200 hover:glass-gold"
          style={{ color: "rgba(212,175,55,0.45)", fontSize: "14px" }}
        >
          ◇
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(212,175,55,0.8)", boxShadow: "0 0 4px rgba(212,175,55,0.6)" }}
          />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 glass rounded-sm transition-all duration-200 hover:glass-gold group"
          >
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080)",
                color: "hsl(0 0% 4%)",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div
                className="text-[11px] font-medium max-w-[120px] truncate"
                style={{ color: "hsl(45 15% 88%)", fontFamily: "'Inter', sans-serif" }}
              >
                {restaurantName}
              </div>
            </div>
            <span
              className="text-[10px] transition-transform duration-200"
              style={{
                color: "rgba(212,175,55,0.4)",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                display: "inline-block",
              }}
            >
              ▾
            </span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-52 glass-heavy border-gold-gradient rounded-sm overflow-hidden z-50"
              >
                {/* User info */}
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: "rgba(212,175,55,0.1)" }}
                >
                  <div
                    className="text-xs font-semibold truncate"
                    style={{ color: "hsl(45 15% 88%)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {restaurantName}
                  </div>
                  <div
                    className="text-[10px] truncate mt-0.5"
                    style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {email}
                  </div>
                </div>

                {[
                  { label: "Profile & Restaurant", icon: "◈" },
                  { label: "Billing", icon: "◇" },
                  { label: "Settings", icon: "⬡" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150"
                    style={{ color: "rgba(212,175,55,0.45)", fontFamily: "'Inter', sans-serif" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.06)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.45)";
                    }}
                  >
                    <span className="text-xs w-4 text-center">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}

                <div className="divider-gold mx-4" />

                <button
                  onClick={() => { setDropdownOpen(false); handleSignOut(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150"
                  style={{ color: "rgba(239,68,68,0.6)", fontFamily: "'Inter', sans-serif" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.6)";
                  }}
                >
                  <span className="text-xs w-4 text-center">↪</span>
                  <span className="text-xs">Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
