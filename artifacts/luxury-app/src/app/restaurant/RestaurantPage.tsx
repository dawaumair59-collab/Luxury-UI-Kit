import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getRestaurantBySlug, getCategories, getMenuItems, getVideos, type Restaurant, type MenuCategory, type MenuItem, type Video } from "@/lib/db";
import { SeoMeta } from "@/components/ui/SeoMeta";

// ── Floating particles ─────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: "rgba(212,175,55,0.35)", left: `${(i * 4.17) % 100}%` }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 0.6, 0] }}
          transition={{ duration: 6 + (i % 6), repeat: Infinity, delay: i * 0.33, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ── Steam effect ───────────────────────────────────────────────────────────
function SteamEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-6 rounded-full"
          style={{
            left: `${25 + i * 25}%`,
            height: "40px",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
          initial={{ y: 0, opacity: 0, scaleX: 1 }}
          animate={{ y: -30, opacity: [0, 0.6, 0], scaleX: [1, 1.5, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.65, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ── Video modal ────────────────────────────────────────────────────────────
function VideoModal({ video, item, onClose }: { video: Video; item: MenuItem; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play();
    return () => { videoRef.current?.pause(); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold glow border */}
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.4), transparent, rgba(212,175,55,0.4))", zIndex: 1 }}
        />
        <video
          ref={videoRef}
          src={video.video_url}
          className="w-full rounded-2xl shadow-2xl relative z-0"
          autoPlay muted loop playsInline controls
        />
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(212,175,55,0.2)", backdropFilter: "blur(12px)" }}
          >
            <p className="font-semibold text-sm" style={{ color: "hsl(45 15% 92%)", fontFamily: "'Playfair Display', serif" }}>{item.name}</p>
            <p className="font-bold text-sm" style={{ color: "#d4af37", fontFamily: "'Inter', sans-serif" }}>₹{Number(item.price).toFixed(0)}</p>
          </div>
        </div>
        <button onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.7)" }}
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Food card with glow/steam ──────────────────────────────────────────────
function FoodCard({ item, video, onVideoClick }: { item: MenuItem; video?: Video; onVideoClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        background: "rgba(10,8,4,0.9)",
        border: "1px solid rgba(212,175,55,0.15)",
        boxShadow: hovered
          ? "0 8px 40px rgba(212,175,55,0.18), 0 2px 8px rgba(0,0,0,0.6)"
          : "0 2px 12px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.35s ease",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={video ? onVideoClick : undefined}
    >
      {/* Image */}
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
            style={{ transition: "transform 0.6s ease" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: "rgba(212,175,55,0.04)" }}
          >
            🍽️
          </div>
        )}

        {/* Gold gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(212,175,55,0.12) 100%)" }}
        />

        {/* Steam effect on hover */}
        <AnimatePresence>
          {hovered && item.image_url && <SteamEffect />}
        </AnimatePresence>

        {/* Video play indicator */}
        {video && (
          <>
            <div
              className="absolute inset-0 flex items-center justify-center transition-colors duration-300"
              style={{ background: hovered ? "rgba(0,0,0,0.3)" : "transparent" }}
            >
              <motion.div
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
                transition={{ duration: 0.25 }}
                className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)" }}
              >
                <svg className="w-5 h-5 ml-0.5" style={{ color: "#d4af37" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>
            <div className="absolute top-2 right-2">
              <span
                className="text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm"
                style={{ background: "rgba(212,175,55,0.18)", border: "1px solid rgba(212,175,55,0.35)", color: "#d4af37", fontFamily: "'Inter', sans-serif" }}
              >
                VIDEO
              </span>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Top gold line on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)" }}
        />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="font-semibold text-sm leading-tight"
              style={{ color: "hsl(45 15% 92%)", fontFamily: "'Playfair Display', serif" }}
            >
              {item.name}
            </h3>
            {item.description && (
              <p
                className="text-xs mt-1 line-clamp-2"
                style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
              >
                {item.description}
              </p>
            )}
          </div>
          <span
            className="font-bold text-sm flex-shrink-0"
            style={{ color: "#d4af37", fontFamily: "'Inter', sans-serif" }}
          >
            ₹{Number(item.price).toFixed(0)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export function RestaurantPage() {
  const [, params] = useRoute("/restaurant/:slug");
  const [, params2] = useRoute("/restaurant/:slug/reels");
  const slug = params?.slug ?? params2?.slug ?? "";
  const [, setLocation] = useLocation();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ video: Video; item: MenuItem } | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const r = await getRestaurantBySlug(slug);
      if (!r) { setNotFound(true); setLoading(false); return; }
      setRestaurant(r);
      const [cats, its, vids] = await Promise.all([getCategories(r.id), getMenuItems(r.id), getVideos(r.id)]);
      setCategories(cats);
      setItems(its);
      setVideos(vids);
      if (cats.length) setActiveCat(cats[0].id);
      setLoading(false);
    })();
  }, [slug]);

  const filteredItems = activeCat ? items.filter((it) => it.category_id === activeCat) : items;
  const videoMap = new Map(videos.map((v) => [v.menu_item_id, v]));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(0 0% 4%)" }}>
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: "rgba(212,175,55,0.2)", borderTopColor: "#d4af37" }}
      />
    </div>
  );

  if (notFound || !restaurant) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "hsl(0 0% 4%)", color: "rgba(212,175,55,0.4)" }}>
      <span className="text-5xl">🍽️</span>
      <p className="text-xl" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 80%)" }}>Restaurant not found</p>
      <a href="/" style={{ color: "#d4af37", fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>← Back to home</a>
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{ background: "hsl(0 0% 4%)" }}>
      <SeoMeta
        title={`${restaurant.name} — Digital Menu`}
        description={`Explore the menu of ${restaurant.name}. View dishes, prices, and video reels.`}
        image={restaurant.banner_url ?? restaurant.logo_url ?? undefined}
      />
      <Particles />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[380px] overflow-hidden">
        {restaurant.banner_url ? (
          <img src={restaurant.banner_url} alt="banner" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, hsl(0 0% 6%), hsl(0 0% 4%))" }}
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />

        {/* Logo + name */}
        <div className="absolute bottom-8 left-0 right-0 px-6 flex items-end gap-5">
          {restaurant.logo_url ? (
            <img
              src={restaurant.logo_url}
              alt="logo"
              loading="lazy"
              className="w-20 h-20 rounded-2xl object-cover shadow-xl"
              style={{ border: "2px solid rgba(212,175,55,0.4)" }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: "rgba(212,175,55,0.1)", border: "2px solid rgba(212,175,55,0.35)" }}
            >
              <span className="text-3xl" style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif" }}>
                {restaurant.name[0]}
              </span>
            </div>
          )}
          <div className="pb-1">
            <p className="text-xs mb-1 tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter', sans-serif" }}>
              Restaurant
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}>
              {restaurant.name}
            </h1>
          </div>
        </div>

        {/* Reels button */}
        {videos.length > 0 && (
          <button
            onClick={() => setLocation(`/restaurant/${slug}/reels`)}
            className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#d4af37",
              backdropFilter: "blur(12px)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Reels
          </button>
        )}
      </div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div
          className="sticky top-0 z-20 border-b"
          style={{ background: "rgba(4,4,4,0.92)", borderColor: "rgba(212,175,55,0.1)", backdropFilter: "blur(16px)" }}
        >
          <div className="max-w-5xl mx-auto px-4 py-0 flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="relative flex-shrink-0 px-5 py-4 text-sm font-medium transition-colors duration-200"
                style={{
                  color: activeCat === cat.id ? "#d4af37" : "rgba(212,175,55,0.38)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {cat.name}
                {activeCat === cat.id && (
                  <motion.div
                    layoutId="cat-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20" style={{ color: "rgba(212,175,55,0.25)" }}>
            <span className="text-4xl block mb-3">🍽️</span>
            <p style={{ fontFamily: "'Playfair Display', serif" }}>No items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const video = videoMap.get(item.id);
              return (
                <FoodCard
                  key={item.id}
                  item={item}
                  video={video}
                  onVideoClick={video ? () => setSelectedVideo({ video, item }) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="text-center py-8 text-xs border-t"
        style={{ color: "rgba(212,175,55,0.2)", borderColor: "rgba(212,175,55,0.07)", fontFamily: "'Inter', sans-serif" }}
      >
        Powered by <span style={{ color: "rgba(212,175,55,0.4)" }}>MenuLux</span>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal
            video={selectedVideo.video}
            item={selectedVideo.item}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
