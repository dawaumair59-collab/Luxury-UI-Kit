import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const WORDS = ["Digital Menus", "QR Experiences", "Restaurant Growth", "Guest Delight"];

function AnimatedWord() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let idx = 0;
    const el = ref.current;
    if (!el) return;

    function swap() {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      setTimeout(() => {
        idx = (idx + 1) % WORDS.length;
        el.textContent = WORDS[idx];
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 350);
    }

    el.textContent = WORDS[0];
    el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
    el.style.opacity = "1";

    const interval = setInterval(swap, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      ref={ref}
      className="text-gold-gradient inline-block"
      style={{ minWidth: "340px", display: "inline-block" }}
    />
  );
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
});

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-12 px-6">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(212,175,55,0.06) 0%, transparent 68%)",
        }}
      />

      {/* Floating grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Badge */}
      <motion.div {...fade(0)} className="mb-8">
        <span
          className="glass-gold rounded-full px-4 py-1.5 text-[10px] tracking-widest-luxury uppercase"
          style={{ color: "rgba(212,175,55,0.8)", fontFamily: "'Inter', sans-serif" }}
        >
          ✦ &nbsp; The future of restaurant menus is here
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div {...fade(0.08)} className="text-center mb-6 max-w-4xl">
        <h1
          className="font-display font-bold leading-[1.1] mb-3"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "hsl(45 15% 92%)",
          }}
        >
          Elevate Your Menu Into
          <br />
          <AnimatedWord />
        </h1>
      </motion.div>

      {/* Sub */}
      <motion.p
        {...fade(0.16)}
        className="text-center max-w-xl text-base leading-relaxed mb-10"
        style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}
      >
        MenuLux gives restaurants a stunning digital menu experience — QR codes, real-time
        updates, and analytics — all in one elegant platform.
      </motion.p>

      {/* CTAs */}
      <motion.div {...fade(0.22)} className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <button
          className="px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 hover:glow-gold hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #a07830, #d4af37 40%, #f0d080 65%, #c8a84b)",
            color: "hsl(0 0% 4%)",
            fontFamily: "'Inter', sans-serif",
            borderRadius: "3px",
          }}
        >
          Start for Free
        </button>
        <button
          className="px-8 py-3.5 text-sm font-medium tracking-wide glass-gold rounded-sm transition-all duration-300 hover:glow-gold-sm hover:scale-105 active:scale-95"
          style={{ color: "rgba(212,175,55,0.9)", fontFamily: "'Inter', sans-serif" }}
        >
          Watch Demo &nbsp;→
        </button>
      </motion.div>

      {/* Social proof strip */}
      <motion.div {...fade(0.3)} className="flex flex-col items-center gap-3">
        <div className="flex -space-x-2">
          {["A", "B", "C", "D", "E"].map((l, i) => (
            <div
              key={l}
              className="w-8 h-8 rounded-full glass-gold flex items-center justify-center text-[10px] font-bold border border-[rgba(212,175,55,0.3)]"
              style={{ color: "rgba(212,175,55,0.9)", zIndex: 5 - i }}
            >
              {l}
            </div>
          ))}
        </div>
        <p
          className="text-[11px] tracking-wide"
          style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
        >
          Trusted by <strong style={{ color: "rgba(212,175,55,0.75)" }}>2,400+</strong> restaurants worldwide
        </p>
      </motion.div>

      {/* Hero device mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-16 w-full max-w-3xl mx-auto"
      >
        <div
          className="glass border-gold-gradient rounded-lg overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.08)" }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: "rgba(212,175,55,0.1)", background: "rgba(0,0,0,0.4)" }}
          >
            {["#e74c3c", "#f39c12", "#2ecc71"].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
            ))}
            <div
              className="flex-1 mx-3 rounded-full px-3 py-0.5 text-[10px]"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(212,175,55,0.3)", fontFamily: "'Inter',sans-serif" }}
            >
              app.menulux.com/your-restaurant
            </div>
          </div>

          {/* Mock menu UI */}
          <div className="p-6 md:p-8 grid grid-cols-3 gap-4">
            {MOCK_ITEMS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                className="glass rounded-md p-4 flex flex-col gap-2 group hover:glass-gold transition-all duration-300 cursor-pointer"
              >
                <div
                  className="text-2xl flex items-center justify-center w-10 h-10 rounded-full glass-gold"
                >
                  {item.emoji}
                </div>
                <div
                  className="text-[11px] font-semibold"
                  style={{ color: "hsl(45 15% 88%)", fontFamily: "'Playfair Display',serif" }}
                >
                  {item.name}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter',sans-serif" }}
                >
                  {item.price}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Glow under card */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 blur-2xl pointer-events-none"
          style={{ background: "rgba(212,175,55,0.12)" }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, hsl(0 0% 4%) 0%, transparent 100%)" }}
      />
    </section>
  );
}

const MOCK_ITEMS = [
  { emoji: "🥩", name: "Wagyu Steak", price: "$68" },
  { emoji: "🦞", name: "Lobster Bisque", price: "$32" },
  { emoji: "🍷", name: "Bordeaux Reserve", price: "$95" },
  { emoji: "🫐", name: "Truffle Risotto", price: "$44" },
  { emoji: "🍮", name: "Crème Brûlée", price: "$18" },
  { emoji: "🫒", name: "Burrata & Prosciutto", price: "$26" },
];
