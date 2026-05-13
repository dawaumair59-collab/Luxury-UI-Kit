import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const STATS = [
  { label: "Menus", value: "1", sub: "Active" },
  { label: "Scans today", value: "0", sub: "QR views" },
  { label: "Menu items", value: "0", sub: "Published" },
  { label: "Locations", value: "1", sub: "Configured" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const restaurantName =
    (user?.user_metadata?.restaurant_name as string) || "Your Restaurant";
  const email = user?.email ?? "";

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
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(0 0% 4%)", color: "hsl(45 15% 92%)" }}
    >
      {/* Ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(212,175,55,0.04) 0%, transparent 65%)",
        }}
      />

      {/* Top nav */}
      <header className="glass-heavy fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
            <span
              className="text-gold-gradient text-lg font-bold tracking-widest-luxury"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              MENULUX
            </span>
            <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
            <span
              className="text-[10px] tracking-widest-luxury uppercase ml-2 px-2 py-0.5 glass-gold rounded-sm"
              style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'Inter', sans-serif" }}
            >
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span
                className="text-[11px] font-medium"
                style={{ color: "hsl(45 15% 85%)", fontFamily: "'Inter', sans-serif" }}
              >
                {restaurantName}
              </span>
              <span
                className="text-[10px]"
                style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
              >
                {email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-1.5 glass-gold rounded-sm text-[11px] tracking-wide transition-all duration-200 hover:glow-gold-sm"
              style={{ color: "rgba(212,175,55,0.7)", fontFamily: "'Inter', sans-serif" }}
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="divider-gold" />
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Welcome */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="mb-12"
        >
          <motion.p
            variants={fadeUp}
            className="text-[10px] tracking-widest-luxury uppercase mb-3"
            style={{ color: "rgba(212,175,55,0.45)", fontFamily: "'Inter', sans-serif" }}
          >
            ✦ &nbsp; Welcome back
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
          >
            Good to see you,{" "}
            <span className="text-gold-gradient">{restaurantName}</span>
          </motion.h1>
          <motion.div variants={fadeUp} className="divider-gold w-24 mt-4" />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="glass border-gold-gradient rounded-md p-5 flex flex-col gap-1"
            >
              <span
                className="text-3xl font-bold font-display text-gold-gradient"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "hsl(45 15% 85%)", fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </span>
              <span
                className="text-[10px]"
                style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
              >
                {stat.sub}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
        >
          {ACTIONS.map((action, i) => (
            <button
              key={action.title}
              className="glass border-gold-gradient rounded-md p-6 text-left flex flex-col gap-3 group hover:glass-gold hover:glow-gold-sm transition-all duration-400"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span
                className="text-2xl w-10 h-10 glass-gold rounded-sm flex items-center justify-center"
                style={{ color: "rgba(212,175,55,0.8)" }}
              >
                {action.icon}
              </span>
              <div>
                <div
                  className="text-base font-semibold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
                >
                  {action.title}
                </div>
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
                >
                  {action.description}
                </div>
              </div>
              <span
                className="text-xs mt-auto"
                style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter', sans-serif" }}
              >
                {action.cta} →
              </span>
            </button>
          ))}
        </motion.div>

        {/* Empty state notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass border-gold-gradient rounded-md p-8 text-center"
        >
          <div
            className="text-3xl mb-4"
            style={{ color: "rgba(212,175,55,0.4)" }}
          >
            ◈
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 88%)" }}
          >
            Your menu awaits
          </h3>
          <p
            className="text-sm max-w-sm mx-auto mb-6"
            style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
          >
            You're all set up. Create your first menu to start generating QR codes and
            tracking guest engagement.
          </p>
          <button
            className="px-7 py-3 text-sm font-semibold rounded-sm transition-all duration-300 hover:glow-gold"
            style={{
              background: "linear-gradient(135deg, #a07830, #d4af37 40%, #f0d080 65%, #c8a84b)",
              color: "hsl(0 0% 4%)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Create Your First Menu
          </button>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-px gold-shimmer-bar pointer-events-none" />
    </div>
  );
}

const ACTIONS = [
  {
    icon: "＋",
    title: "Create a Menu",
    description: "Build your digital menu with items, photos, and pricing.",
    cta: "Get started",
  },
  {
    icon: "◻",
    title: "Generate QR Code",
    description: "Create a branded QR code ready for tables and marketing.",
    cta: "Generate",
  },
  {
    icon: "◈",
    title: "View Analytics",
    description: "See how guests interact with your menu in real time.",
    cta: "Open analytics",
  },
];
