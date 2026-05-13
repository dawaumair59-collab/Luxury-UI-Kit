import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getMyRestaurant, getMenuItems, getCategories } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

const GOLD = "#d4af37";
const GOLD_DARK = "#a07830";
const GOLD_LIGHT = "#f0d080";
const GOLD_MUTED = "rgba(212,175,55,0.3)";
const BLACK = "#0d0b06";

const PIE_COLORS = [
  "#d4af37", "#a07830", "#f0d080", "#c8973a", "#e8c85a", "#8a6520"
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};
const stagger = { animate: { transition: { staggerChildren: 0.09 } } };

// Animated number counter
function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Custom Tooltip
function GoldTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-sm text-xs"
      style={{
        background: "rgba(10,8,4,0.95)",
        border: "1px solid rgba(212,175,55,0.3)",
        color: "rgba(212,175,55,0.9)",
        fontFamily: "'Inter', sans-serif",
        backdropFilter: "blur(8px)",
      }}
    >
      {label && <div className="mb-1 opacity-60">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span style={{ color: p.color }}>●</span>
          <span>{p.name}: <strong>{p.value?.toLocaleString()}</strong></span>
        </div>
      ))}
    </div>
  );
}

// Mock analytics data generator
function useAnalyticsData(restaurantId: string | undefined) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyViews = days.map((day) => ({
    day,
    views: Math.floor(Math.random() * 180) + 20,
  }));

  return { dailyViews };
}

export function AnalyticsPage() {
  const { data: restaurant, isLoading: loadingR } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: getMyRestaurant,
  });

  const { data: items = [], isLoading: loadingI } = useQuery({
    queryKey: ["menu-items", restaurant?.id],
    queryFn: () => getMenuItems(restaurant!.id),
    enabled: !!restaurant?.id,
  });

  const { data: categories = [], isLoading: loadingC } = useQuery({
    queryKey: ["categories", restaurant?.id],
    queryFn: () => getCategories(restaurant!.id),
    enabled: !!restaurant?.id,
  });

  const isLoading = loadingR || loadingI || loadingC;
  const { dailyViews } = useAnalyticsData(restaurant?.id);

  // Derived mock data
  const totalViews = dailyViews.reduce((s, d) => s + d.views, 0);
  const uniqueVisitors = Math.floor(totalViews * 0.72);
  const avgSession = "2m 34s";
  const conversionRate = 34;

  const topItems = items.slice(0, 6).map((item, i) => ({
    name: item.name.length > 16 ? item.name.slice(0, 16) + "…" : item.name,
    views: Math.floor(Math.random() * 120) + 20 - i * 10,
  })).sort((a, b) => b.views - a.views);

  const categoryData = categories.slice(0, 6).map((cat, i) => ({
    name: cat.name,
    value: Math.floor(Math.random() * 40) + 10,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const recentActivity = [
    { icon: "◈", label: "Menu viewed from QR scan", time: "2m ago" },
    { icon: "◇", label: "New visitor from Google", time: "8m ago" },
    { icon: "▶", label: "Video reel watched", time: "15m ago" },
    { icon: "⬡", label: "Menu shared via link", time: "34m ago" },
    { icon: "◈", label: "Menu viewed from QR scan", time: "1h ago" },
    { icon: "◇", label: "Category browsed: Starters", time: "1h ago" },
    { icon: "▶", label: "Video reel watched", time: "2h ago" },
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" style={{ background: "rgba(212,175,55,0.08)" }} />
          <Skeleton className="h-4 w-72" style={{ background: "rgba(212,175,55,0.05)" }} />
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-md" style={{ background: "rgba(212,175,55,0.06)" }} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-md" style={{ background: "rgba(212,175,55,0.06)" }} />
          <Skeleton className="h-64 rounded-md" style={{ background: "rgba(212,175,55,0.06)" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-8">
      {/* Header */}
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.p
          variants={fadeUp}
          className="text-[10px] tracking-widest-luxury uppercase mb-2"
          style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
        >
          ✦ &nbsp; Analytics
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
        >
          Menu <span className="text-gold-gradient">Insights</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-xs"
          style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
        >
          Track guest interactions with your digital menu — last 7 days.
        </motion.p>
        <motion.div variants={fadeUp} className="divider-gold w-20 mt-4" />
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Views", value: totalViews, icon: "◈", suffix: "" },
          { label: "Unique Visitors", value: uniqueVisitors, icon: "◇", suffix: "" },
          { label: "Conversion Rate", value: conversionRate, icon: "⬡", suffix: "%" },
          { label: "Menu Items", value: items.length, icon: "◆", suffix: "" },
        ].map((stat) => (
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
                7d
              </span>
            </div>
            <div>
              <div
                className="text-3xl font-bold text-gold-gradient"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="text-xs font-medium mt-0.5"
                style={{ color: "hsl(45 15% 82%)", fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1: Line + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass border-gold-gradient rounded-md p-6"
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
          >
            Daily Views — This Week
          </h3>
          <p className="text-[10px] mb-5" style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}>
            Guest visits to your menu each day
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyViews} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(212,175,55,0.4)", fontSize: 10, fontFamily: "'Inter', sans-serif" }}
                axisLine={{ stroke: "rgba(212,175,55,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(212,175,55,0.3)", fontSize: 10, fontFamily: "'Inter', sans-serif" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<GoldTooltip />} />
              <defs>
                <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={GOLD_DARK} />
                  <stop offset="50%" stopColor={GOLD} />
                  <stop offset="100%" stopColor={GOLD_LIGHT} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="url(#goldLine)"
                strokeWidth={2}
                dot={{ fill: GOLD, r: 3, strokeWidth: 0 }}
                activeDot={{ fill: GOLD_LIGHT, r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Items Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="glass border-gold-gradient rounded-md p-6"
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
          >
            Most Viewed Menu Items
          </h3>
          <p className="text-[10px] mb-5" style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}>
            {topItems.length > 0 ? "Top items by guest interactions" : "Add menu items to see data"}
          </p>
          {topItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topItems} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(212,175,55,0.4)", fontSize: 9, fontFamily: "'Inter', sans-serif" }}
                  axisLine={{ stroke: "rgba(212,175,55,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(212,175,55,0.3)", fontSize: 10, fontFamily: "'Inter', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<GoldTooltip />} />
                <defs>
                  <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD_LIGHT} />
                    <stop offset="100%" stopColor={GOLD_DARK} />
                  </linearGradient>
                </defs>
                <Bar dataKey="views" name="Views" fill="url(#goldBar)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2" style={{ color: "rgba(212,175,55,0.2)" }}>◈</div>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}>
                  No menu items yet
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2: Pie + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2 glass border-gold-gradient rounded-md p-6"
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
          >
            Popular Categories
          </h3>
          <p className="text-[10px] mb-4" style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}>
            {categoryData.length > 0 ? "Category share of total views" : "Add categories to see data"}
          </p>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<GoldTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="text-[10px] flex-1 truncate" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}>
                      {cat.name}
                    </span>
                    <span className="text-[10px]" style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}>
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[180px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2" style={{ color: "rgba(212,175,55,0.2)" }}>◇</div>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}>
                  No categories yet
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="lg:col-span-3 glass border-gold-gradient rounded-md p-6"
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
          >
            Recent Activity
          </h3>
          <p className="text-[10px] mb-4" style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}>
            Live guest interactions with your menu
          </p>
          <div className="flex flex-col gap-0">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                className="flex items-center gap-3 py-3"
                style={{
                  borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(212,175,55,0.06)" : "none",
                }}
              >
                <span
                  className="w-7 h-7 glass-gold rounded-sm flex items-center justify-center text-[10px] flex-shrink-0"
                  style={{ color: "rgba(212,175,55,0.55)" }}
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-xs" style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter', sans-serif" }}>
                  {item.label}
                </span>
                <span className="text-[10px] flex-shrink-0" style={{ color: "rgba(212,175,55,0.25)", fontFamily: "'Inter', sans-serif" }}>
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
