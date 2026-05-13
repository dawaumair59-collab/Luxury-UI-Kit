import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyRestaurant } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import type { Subscription } from "./billing/BillingPage";

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: "⬡", label: "Overview", href: "/dashboard" },
  { icon: "◈", label: "Menu", href: "/dashboard/menu" },
  { icon: "▶", label: "Videos", href: "/dashboard/videos" },
  { icon: "◻", label: "QR Codes", href: "/dashboard/qr" },
  { icon: "◇", label: "Analytics", href: "/dashboard/analytics" },
  { icon: "◆", label: "Billing", href: "/dashboard/billing" },
];

const BOTTOM_ITEMS: NavItem[] = [
  { icon: "?", label: "Help & Docs", href: "/dashboard/help" },
];

const PLAN_CONFIG = {
  free: { label: "Free Plan", color: "rgba(212,175,55,0.12)", textColor: "rgba(212,175,55,0.5)", upgrade: true },
  pro: { label: "Pro Plan", color: "linear-gradient(135deg, rgba(100,80,200,0.3), rgba(130,110,220,0.3))", textColor: "#8a7aed", upgrade: false },
  premium: { label: "Premium", color: "linear-gradient(135deg, rgba(160,120,48,0.3), rgba(212,175,55,0.3))", textColor: "#d4af37", upgrade: false },
};

interface SidebarContentProps {
  onClose?: () => void;
}

export function SidebarContent({ onClose }: SidebarContentProps) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const restaurantName = (user?.user_metadata?.restaurant_name as string) || "Your Restaurant";
  const email = user?.email ?? "";
  const initials = restaurantName.slice(0, 2).toUpperCase();

  const { data: restaurant } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: getMyRestaurant,
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription", restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return null;
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .maybeSingle();
      return data as Subscription | null;
    },
    enabled: !!restaurant?.id,
  });

  const currentPlan = (subscription?.plan ?? "free") as "free" | "pro" | "premium";
  const planConfig = PLAN_CONFIG[currentPlan];

  function go(href: string) {
    navigate(href);
    onClose?.();
  }

  function isActive(href: string) {
    if (href === "/dashboard") return location === "/dashboard";
    return location.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex-shrink-0">
        <button onClick={() => go("/dashboard")} className="flex items-center gap-3">
          <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
          <span
            className="text-gold-gradient text-base font-bold tracking-widest-luxury select-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            MENULUX
          </span>
          <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
        </button>
      </div>

      <div className="divider-gold mx-5 mb-5" />

      {/* Restaurant badge */}
      <div className="px-4 mb-6">
        <div className="glass-gold rounded-sm px-3 py-2.5 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080)",
              color: "hsl(0 0% 4%)",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div
              className="text-xs font-semibold truncate"
              style={{ color: "hsl(45 15% 88%)", fontFamily: "'Inter', sans-serif" }}
            >
              {restaurantName}
            </div>
            <div
              className="text-[10px] truncate"
              style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
            >
              {email}
            </div>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div
        className="px-5 mb-2 text-[9px] tracking-widest-luxury uppercase"
        style={{ color: "rgba(212,175,55,0.28)", fontFamily: "'Inter', sans-serif" }}
      >
        Navigation
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-200 group"
              style={{
                background: active ? "rgba(212,175,55,0.1)" : "transparent",
              }}
            >
              {/* Active indicator bar */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(to bottom, #c8a84b, #f0d080, #c8a84b)",
                    boxShadow: "0 0 8px rgba(212,175,55,0.6)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <span
                className="w-5 text-center flex-shrink-0 text-sm transition-colors duration-200"
                style={{
                  color: active ? "rgba(212,175,55,0.9)" : "rgba(212,175,55,0.35)",
                }}
              >
                {item.icon}
              </span>

              <span
                className="flex-1 text-sm transition-colors duration-200"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: active ? "hsl(45 15% 92%)" : "rgba(212,175,55,0.45)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {item.label}
              </span>

              {item.badge && (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full glass-gold"
                  style={{ color: "rgba(212,175,55,0.7)", fontFamily: "'Inter', sans-serif" }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-5 flex-shrink-0">
        <div className="divider-gold mb-3" />
        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => go(item.href)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-200"
          >
            <span
              className="w-5 text-center flex-shrink-0 text-xs border rounded-full flex items-center justify-center"
              style={{
                width: "16px",
                height: "16px",
                color: "rgba(212,175,55,0.3)",
                borderColor: "rgba(212,175,55,0.2)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
              }}
            >
              {item.icon}
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
            >
              {item.label}
            </span>
          </button>
        ))}

        {/* Dynamic Plan badge */}
        <button
          onClick={() => go("/dashboard/billing")}
          className="mt-3 w-full px-3 py-2 glass border-gold-gradient rounded-sm flex items-center justify-between transition-all duration-300 hover:glass-gold"
        >
          <div>
            <div
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: planConfig.textColor, fontFamily: "'Inter', sans-serif" }}
            >
              {planConfig.label}
            </div>
            <div
              className="text-[9px]"
              style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}
            >
              {planConfig.upgrade ? "Upgrade for more" : "Active subscription"}
            </div>
          </div>
          {planConfig.upgrade && (
            <span
              className="text-[9px] tracking-wide px-2 py-1 rounded-sm transition-all duration-200 hover:glow-gold-sm flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080)",
                color: "hsl(0 0% 4%)",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              }}
            >
              Pro
            </span>
          )}
          {!planConfig.upgrade && (
            <span
              className="text-[9px] tracking-wide px-2 py-1 rounded-sm flex-shrink-0"
              style={{
                background: currentPlan === "premium"
                  ? "linear-gradient(135deg, #a07830, #d4af37)"
                  : "rgba(138,122,237,0.2)",
                color: currentPlan === "premium" ? "hsl(0 0% 4%)" : "#8a7aed",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                border: `1px solid ${currentPlan === "premium" ? "transparent" : "rgba(138,122,237,0.3)"}`,
              }}
            >
              {currentPlan === "premium" ? "★" : "◆"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-64"
            style={{
              background: "hsl(0 0% 5%)",
              borderRight: "1px solid rgba(212,175,55,0.12)",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 glass-gold rounded-sm flex items-center justify-center text-sm transition-all duration-200 hover:glow-gold-sm"
              style={{ color: "rgba(212,175,55,0.7)" }}
            >
              ✕
            </button>
            <SidebarContent onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
