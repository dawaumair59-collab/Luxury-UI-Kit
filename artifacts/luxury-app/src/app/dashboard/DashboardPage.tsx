import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const STATS = [
  {
    label: "Active Menus",
    value: "1",
    change: "+0 this week",
    trend: "neutral",
    icon: "◈",
  },
  {
    label: "QR Scans Today",
    value: "0",
    change: "Start sharing your QR",
    trend: "neutral",
    icon: "◻",
  },
  {
    label: "Menu Items",
    value: "0",
    change: "Add your first dish",
    trend: "neutral",
    icon: "⬡",
  },
  {
    label: "Avg. Session",
    value: "—",
    change: "No data yet",
    trend: "neutral",
    icon: "◇",
  },
];

const QUICK_ACTIONS = [
  {
    icon: "＋",
    title: "Create a Menu",
    description: "Build your digital menu with items, photos, and pricing.",
    cta: "Get started",
    href: "/dashboard/menus",
  },
  {
    icon: "◻",
    title: "Generate QR Code",
    description: "Create a branded QR code for your tables and marketing.",
    cta: "Generate",
    href: "/dashboard/qr",
  },
  {
    icon: "◇",
    title: "View Analytics",
    description: "Track how guests interact with your menu in real time.",
    cta: "Open analytics",
    href: "/dashboard/analytics",
  },
];

const ACTIVITY: { label: string; time: string; icon: string }[] = [];

export function DashboardPage() {
  const { user } = useAuth();
  const restaurantName = (user?.user_metadata?.restaurant_name as string) || "Your Restaurant";

  return (
    <div className="p-6 md:p-8 max-w-5xl">
        {/* Welcome header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="mb-8"
        >
          <motion.p
            variants={fadeUp}
            className="text-[10px] tracking-widest-luxury uppercase mb-2"
            style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
          >
            ✦ &nbsp; Welcome back
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
          >
            Good to see you,{" "}
            <span className="text-gold-gradient">{restaurantName}</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-xs"
            style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
          >
            Here's what's happening with your restaurant today.
          </motion.p>
          <motion.div variants={fadeUp} className="divider-gold w-20 mt-4" />
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="glass border-gold-gradient rounded-md p-5 flex flex-col gap-3 group hover:glass-gold transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-xs w-8 h-8 glass-gold rounded-sm flex items-center justify-center"
                  style={{ color: "rgba(212,175,55,0.65)" }}
                >
                  {stat.icon}
                </span>
                <span
                  className="text-[9px] tracking-wide px-1.5 py-0.5 glass rounded-full"
                  style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}
                >
                  24h
                </span>
              </div>

              <div>
                <div
                  className="text-3xl font-bold text-gold-gradient"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs font-medium mt-0.5"
                  style={{ color: "hsl(45 15% 82%)", fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </div>
              </div>

              <div
                className="text-[10px]"
                style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}
              >
                {stat.change}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Two-column: quick actions + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Quick actions — 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-3 flex flex-col gap-3"
          >
            <h3
              className="text-xs font-semibold tracking-widest-luxury uppercase"
              style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
            >
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.title}
                  className="glass border-gold-gradient rounded-md p-5 flex items-center gap-4 text-left hover:glass-gold hover:glow-gold-sm transition-all duration-300 group"
                >
                  <span
                    className="w-10 h-10 flex-shrink-0 glass-gold rounded-sm flex items-center justify-center text-lg"
                    style={{ color: "rgba(212,175,55,0.75)" }}
                  >
                    {action.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold mb-0.5"
                      style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
                    >
                      {action.title}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
                    >
                      {action.description}
                    </div>
                  </div>
                  <span
                    className="text-xs flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color: "rgba(212,175,55,0.4)" }}
                  >
                    →
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Activity feed — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-3"
          >
            <h3
              className="text-xs font-semibold tracking-widest-luxury uppercase"
              style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
            >
              Recent Activity
            </h3>
            <div className="glass border-gold-gradient rounded-md flex-1 flex flex-col">
              {ACTIVITY.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
                  <span className="text-3xl" style={{ color: "rgba(212,175,55,0.2)" }}>◇</span>
                  <p
                    className="text-xs text-center"
                    style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}
                  >
                    No activity yet.
                    <br />
                    Share your menu to see guest interactions.
                  </p>
                </div>
              ) : (
                <ul>
                  {ACTIVITY.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 border-b"
                      style={{ borderColor: "rgba(212,175,55,0.08)" }}
                    >
                      <span style={{ color: "rgba(212,175,55,0.5)", fontSize: "12px" }}>{a.icon}</span>
                      <span className="flex-1 text-xs" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}>{a.label}</span>
                      <span className="text-[10px]" style={{ color: "rgba(212,175,55,0.25)", fontFamily: "'Inter', sans-serif" }}>{a.time}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>

        {/* Setup checklist */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass border-gold-gradient rounded-md p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className="text-base font-semibold mb-0.5"
                style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
              >
                Getting Started
              </h3>
              <p
                className="text-xs"
                style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
              >
                Complete these steps to launch your digital menu.
              </p>
            </div>
            <div
              className="text-xs px-3 py-1 glass-gold rounded-full"
              style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'Inter', sans-serif" }}
            >
              1 / 4 done
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-px w-full mb-5 rounded-full overflow-hidden"
            style={{ background: "rgba(212,175,55,0.12)" }}
          >
            <div
              className="h-full w-1/4 rounded-full"
              style={{
                background: "linear-gradient(90deg, #a07830, #d4af37, #f0d080)",
                boxShadow: "0 0 8px rgba(212,175,55,0.4)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHECKLIST.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-sm"
                style={{
                  background: item.done ? "rgba(212,175,55,0.06)" : "rgba(0,0,0,0.2)",
                  border: "1px solid",
                  borderColor: item.done ? "rgba(212,175,55,0.2)" : "rgba(212,175,55,0.07)",
                }}
              >
                <span
                  className="w-5 h-5 rounded-sm flex items-center justify-center text-[10px] flex-shrink-0"
                  style={{
                    background: item.done
                      ? "linear-gradient(135deg, #a07830, #d4af37)"
                      : "rgba(212,175,55,0.08)",
                    color: item.done ? "hsl(0 0% 4%)" : "rgba(212,175,55,0.3)",
                  }}
                >
                  {item.done ? "✓" : "○"}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: item.done ? "rgba(212,175,55,0.7)" : "rgba(212,175,55,0.38)",
                    textDecoration: item.done ? "line-through" : "none",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
    </div>
  );
}

const CHECKLIST = [
  { label: "Create your account", done: true },
  { label: "Build your first menu", done: false },
  { label: "Generate a QR code", done: false },
  { label: "Share with your first guest", done: false },
];
