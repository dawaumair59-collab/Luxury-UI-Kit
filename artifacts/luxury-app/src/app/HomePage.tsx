import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

export function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(0 0% 4%)", color: "hsl(45 15% 92%)" }}
    >
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(212,175,55,0.05) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Overline */}
          <motion.p
            variants={fadeUp}
            className="text-xs tracking-widest-luxury uppercase"
            style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter', sans-serif" }}
          >
            Est. MMXXV &nbsp;&bull;&nbsp; Maison de Luxe
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-gold-gradient text-6xl md:text-8xl font-display font-bold leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Beyond
            <br />
            <em className="not-italic" style={{ color: "hsl(45 15% 92%)" }}>
              Compare.
            </em>
          </motion.h1>

          {/* Divider */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 w-56">
            <div className="divider-gold flex-1" />
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <rect x="3" y="0" width="4.24" height="4.24" transform="rotate(45 3 0)" fill="#d4af37" opacity="0.7" />
            </svg>
            <div className="divider-gold flex-1" />
          </motion.div>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="text-base max-w-md leading-relaxed"
            style={{
              color: "rgba(212,175,55,0.5)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Uncompromising quality. Timeless design. An experience reserved for
            those who demand only the finest.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 pt-2">
            <button
              className="px-8 py-3 text-xs tracking-luxury uppercase font-medium transition-all duration-300 hover:glow-gold"
              style={{
                background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080, #c8a84b)",
                color: "hsl(0 0% 4%)",
                fontFamily: "'Inter', sans-serif",
                borderRadius: "2px",
              }}
            >
              Explore Collection
            </button>
            <button
              className="px-8 py-3 text-xs tracking-luxury uppercase font-medium glass-gold rounded-sm transition-all duration-300 hover:glow-gold-sm"
              style={{
                color: "rgba(212,175,55,0.85)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Our Story
            </button>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, hsl(0 0% 4%) 0%, transparent 100%)",
          }}
        />
      </section>

      {/* Feature cards */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="glass border-gold-gradient rounded-sm p-8 flex flex-col gap-4 group hover:glow-gold-sm transition-all duration-500"
            >
              <div
                className="text-2xl"
                style={{ color: "rgba(212,175,55,0.7)" }}
              >
                {f.icon}
              </div>
              <h3
                className="text-lg font-display font-semibold"
                style={{
                  color: "hsl(45 15% 92%)",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(212,175,55,0.45)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "◈",
    title: "Master Craftsmanship",
    description:
      "Every detail is refined by artisans with decades of expertise. No shortcuts. No compromises.",
  },
  {
    icon: "◇",
    title: "Rare Materials",
    description:
      "Sourced from the most exclusive suppliers across the globe. Only the finest materials pass our standards.",
  },
  {
    icon: "◆",
    title: "Timeless Legacy",
    description:
      "Pieces designed to endure generations. Investment in beauty, crafted to outlast trends.",
  },
];
