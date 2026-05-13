import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { getRestaurantBySlug, getVideos, getMenuItems, type Video, type MenuItem } from "@/lib/db";

interface ReelItem {
  video: Video;
  item?: MenuItem;
}

function ReelCard({
  reel,
  isActive,
}: {
  reel: ReelItem;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount] = useState(() => Math.floor(200 + Math.random() * 800));

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  const handleShare = async () => {
    try {
      await navigator.share({ title: reel.video.title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Blurred background */}
      {reel.video.thumbnail_url && (
        <div className="absolute inset-0">
          <img src={reel.video.thumbnail_url} className="w-full h-full object-cover scale-110 blur-2xl opacity-30" />
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video.video_url}
        className="absolute inset-0 w-full h-full object-contain"
        muted loop playsInline autoPlay={isActive}
        poster={reel.video.thumbnail_url ?? undefined}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Info overlay */}
      <div className="absolute bottom-24 left-4 right-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
          transition={{ delay: 0.2 }}
        >
          {reel.item && (
            <div className="glass-dark border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md inline-block">
              <p className="text-white font-semibold text-base">{reel.item.name}</p>
              <p className="text-gold font-bold text-lg">${Number(reel.item.price).toFixed(2)}</p>
              {reel.item.description && (
                <p className="text-white/50 text-xs mt-1 line-clamp-2">{reel.item.description}</p>
              )}
            </div>
          )}
          <p className="text-white/60 text-sm mt-2 ml-1">{reel.video.title}</p>
        </motion.div>
      </div>

      {/* Side actions */}
      <div className="absolute right-3 bottom-32 flex flex-col gap-5 items-center">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setLiked((l) => !l)}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all
            ${liked ? "bg-red-500/30 border-red-500/50" : "glass-dark border-white/20"}`}>
            <svg className={`w-5 h-5 transition-colors ${liked ? "text-red-400" : "text-white"}`}
              fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-white/60 text-xs">{(likeCount + (liked ? 1 : 0)).toLocaleString()}</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full glass-dark border border-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <span className="text-white/60 text-xs">Share</span>
        </motion.button>
      </div>
    </div>
  );
}

export function ReelsPage() {
  const [, params] = useRoute("/restaurant/:slug/reels");
  const slug = params?.slug ?? "";
  const [, setLocation] = useLocation();

  const [reels, setReels] = useState<ReelItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [-80, 0, 80], [0.4, 1, 0.4]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const r = await getRestaurantBySlug(slug);
      if (!r) { setLoading(false); return; }
      const [vids, its] = await Promise.all([getVideos(r.id), getMenuItems(r.id)]);
      const itemMap = new Map(its.map((it) => [it.id, it]));
      setReels(vids.map((v) => ({ video: v, item: v.menu_item_id ? itemMap.get(v.menu_item_id) : undefined })));
      setLoading(false);
    })();
  }, [slug]);

  const goNext = useCallback(() => setCurrentIndex((i) => Math.min(i + 1, reels.length - 1)), [reels.length]);
  const goPrev = useCallback(() => setCurrentIndex((i) => Math.max(i - 1, 0)), []);

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  // Wheel
  const wheelLock = useRef(false);
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLock.current) return;
    wheelLock.current = true;
    if (e.deltaY > 30) goNext();
    else if (e.deltaY < -30) goPrev();
    setTimeout(() => { wheelLock.current = false; }, 600);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (!reels.length) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4 text-white/50">
      <span className="text-4xl">🎬</span>
      <p>No videos available.</p>
      <button onClick={() => setLocation(`/restaurant/${slug}`)} className="text-gold text-sm hover:underline">Back to menu</button>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Back button */}
      <button
        onClick={() => setLocation(`/restaurant/${slug}`)}
        className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full glass-dark border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Progress dots */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-1">
        {reels.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)}
            className={`w-1 rounded-full transition-all ${i === currentIndex ? "h-6 bg-gold" : "h-2 bg-white/30"}`} />
        ))}
      </div>

      {/* Reel cards */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ y: currentIndex > 0 ? "100%" : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ opacity }}
        >
          <ReelCard reel={reels[currentIndex]} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* Swipe hint */}
      {currentIndex === 0 && reels.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 pointer-events-none"
        >
          <motion.div animate={{ y: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7 7 7-7" />
            </svg>
          </motion.div>
          <span className="text-xs">Swipe up</span>
        </motion.div>
      )}
    </div>
  );
}
