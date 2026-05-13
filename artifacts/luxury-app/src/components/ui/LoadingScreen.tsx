import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isVisible: boolean;
  progress?: number;
  brandName?: string;
  tagline?: string;
}

export function LoadingScreen({
  isVisible,
  progress = 0,
  brandName = "LUXE",
  tagline = "Crafted for the Extraordinary",
}: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "hsl(0 0% 4%)" }}
        >
          {/* Radial background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)",
            }}
          />

          {/* Corner ornaments */}
          <Ornament className="absolute top-8 left-8" />
          <Ornament className="absolute top-8 right-8 rotate-90" />
          <Ornament className="absolute bottom-8 left-8 -rotate-90" />
          <Ornament className="absolute bottom-8 right-8 rotate-180" />

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-10 px-8">
            {/* Gold emblem ring */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="url(#gold-ring)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  style={{ animation: "spin 12s linear infinite" }}
                />
                <circle cx="40" cy="40" r="28" stroke="url(#gold-ring)" strokeWidth="0.75" opacity="0.5" />
                <path
                  d="M40 20 L44 34 L40 38 L36 34 Z"
                  fill="url(#gold-fill)"
                  opacity="0.9"
                />
                <path
                  d="M40 60 L44 46 L40 42 L36 46 Z"
                  fill="url(#gold-fill)"
                  opacity="0.9"
                />
                <path
                  d="M20 40 L34 36 L38 40 L34 44 Z"
                  fill="url(#gold-fill)"
                  opacity="0.9"
                />
                <path
                  d="M60 40 L46 36 L42 40 L46 44 Z"
                  fill="url(#gold-fill)"
                  opacity="0.9"
                />
                <circle cx="40" cy="40" r="4" fill="url(#gold-fill)" />
                <defs>
                  <linearGradient id="gold-ring" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a07830" />
                    <stop offset="0.4" stopColor="#f0d080" />
                    <stop offset="0.7" stopColor="#d4af37" />
                    <stop offset="1" stopColor="#c8a84b" />
                  </linearGradient>
                  <linearGradient id="gold-fill" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c8a84b" />
                    <stop offset="0.5" stopColor="#f0d080" />
                    <stop offset="1" stopColor="#a07830" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-3"
            >
              <h1
                className="text-gold-gradient text-5xl font-display font-bold tracking-widest-luxury select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {brandName}
              </h1>

              {/* Horizontal rule with diamond */}
              <div className="flex items-center gap-3 w-48">
                <div className="divider-gold flex-1" />
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <rect x="4" y="0" width="5.66" height="5.66" transform="rotate(45 4 0)" fill="url(#diamond-grad)" />
                  <defs>
                    <linearGradient id="diamond-grad" x1="0" y1="0" x2="8" y2="8" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#c8a84b" />
                      <stop offset="1" stopColor="#f0d080" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="divider-gold flex-1" />
              </div>

              <p
                className="text-xs tracking-luxury uppercase select-none"
                style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'Inter', sans-serif" }}
              >
                {tagline}
              </p>
            </motion.div>

            {/* Progress bar area */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-64 flex flex-col gap-2"
            >
              {/* Track */}
              <div
                className="relative h-px w-full overflow-hidden rounded-full"
                style={{ background: "rgba(212,175,55,0.15)" }}
              >
                {/* Fill */}
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #a07830, #c8a84b, #f0d080, #d4af37)",
                    boxShadow: "0 0 8px rgba(212,175,55,0.7)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {/* Moving shimmer on top of fill */}
                <motion.div
                  className="absolute top-0 h-full w-16 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    left: `${Math.max(0, progress - 15)}%`,
                  }}
                  animate={{ left: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Percentage */}
              <div className="flex justify-between items-center">
                <span
                  className="text-[10px] tracking-luxury uppercase"
                  style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
                >
                  Loading
                </span>
                <motion.span
                  className="text-[10px] font-medium tabular-nums"
                  style={{ color: "rgba(212,175,55,0.7)", fontFamily: "'Inter', sans-serif" }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Bottom gold shimmer bar */}
          <div className="absolute bottom-0 left-0 right-0 h-px gold-shimmer-bar" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={{ opacity: 0.3 }}
    >
      <path d="M1 1 L12 1 L1 12 Z" stroke="url(#orn-gold)" strokeWidth="0.75" fill="none" />
      <path d="M1 1 L8 1" stroke="url(#orn-gold)" strokeWidth="0.75" />
      <path d="M1 1 L1 8" stroke="url(#orn-gold)" strokeWidth="0.75" />
      <defs>
        <linearGradient id="orn-gold" x1="0" y1="0" x2="12" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0d080" />
          <stop offset="1" stopColor="#a07830" />
        </linearGradient>
      </defs>
    </svg>
  );
}
