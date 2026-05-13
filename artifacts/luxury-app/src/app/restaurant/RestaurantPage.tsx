import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getRestaurantBySlug, getCategories, getMenuItems, getVideos, type Restaurant, type MenuCategory, type MenuItem, type Video } from "@/lib/db";

// ── Floating particles ─────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold/30"
          initial={{ x: `${Math.random() * 100}%`, y: "110%", opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 0.6, 0] }}
          transition={{ duration: 6 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 8, ease: "linear" }}
          style={{ left: `${Math.random() * 100}%` }}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="relative w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={video.video_url}
          className="w-full rounded-2xl shadow-2xl"
          autoPlay muted loop playsInline controls
        />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-dark rounded-xl px-4 py-3 border border-white/10">
            <p className="text-white font-semibold">{item.name}</p>
            <p className="text-gold font-bold">${Number(item.price).toFixed(2)}</p>
          </div>
        </div>
        <button onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass-dark border border-white/20 flex items-center justify-center text-white/70 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Food card ──────────────────────────────────────────────────────────────
function FoodCard({ item, video, onVideoClick }: { item: MenuItem; video?: Video; onVideoClick?: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-dark border border-white/10 rounded-2xl overflow-hidden group cursor-pointer"
      onClick={video ? onVideoClick : undefined}
    >
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        )}
        {video && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-gold ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        {video && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] bg-gold/20 border border-gold/40 text-gold px-2 py-0.5 rounded-full backdrop-blur-sm">VIDEO</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm leading-tight">{item.name}</h3>
            {item.description && <p className="text-white/45 text-xs mt-1 line-clamp-2">{item.description}</p>}
          </div>
          <span className="text-gold font-bold text-sm flex-shrink-0">${Number(item.price).toFixed(2)}</span>
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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (notFound || !restaurant) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white/50">
      <span className="text-5xl">🍽️</span>
      <p className="text-xl font-serif text-white">Restaurant not found</p>
      <a href="/" className="text-gold text-sm hover:underline">Back to home</a>
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative">
      <Particles />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[380px] overflow-hidden">
        {restaurant.banner_url ? (
          <img src={restaurant.banner_url} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Logo + name */}
        <div className="absolute bottom-8 left-0 right-0 px-6 flex items-end gap-5">
          {restaurant.logo_url ? (
            <img src={restaurant.logo_url} alt="logo" className="w-20 h-20 rounded-2xl object-cover border-2 border-gold/40 shadow-xl" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gold/10 border-2 border-gold/40 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-serif text-gold">{restaurant.name[0]}</span>
            </div>
          )}
          <div className="pb-1">
            <p className="text-xs text-gold/60 tracking-[0.25em] uppercase font-medium mb-1">Restaurant</p>
            <h1 className="text-3xl md:text-4xl font-serif text-white leading-tight">{restaurant.name}</h1>
          </div>
        </div>

        {/* Reels button */}
        {videos.length > 0 && (
          <button
            onClick={() => setLocation(`/restaurant/${slug}/reels`)}
            className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 glass-dark border border-gold/30 rounded-full text-gold text-sm font-medium hover:bg-gold/10 transition-colors backdrop-blur-md"
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
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/8">
          <div className="max-w-5xl mx-auto px-4 py-0 flex gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`relative flex-shrink-0 px-5 py-4 text-sm font-medium transition-colors ${activeCat === cat.id ? "text-gold" : "text-white/50 hover:text-white/80"}`}
              >
                {cat.name}
                {activeCat === cat.id && (
                  <motion.div layoutId="cat-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <span className="text-4xl block mb-3">🍽️</span>
            <p>No items in this category yet.</p>
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
      <div className="text-center py-8 text-white/20 text-xs border-t border-white/5">
        Powered by <span className="text-gold/50">MenuLux</span>
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
