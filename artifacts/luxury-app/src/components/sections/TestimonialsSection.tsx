import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "MenuLux transformed how our guests experience the menu. The elegance of the platform matches our restaurant's identity perfectly.",
    name: "Isabelle Fontaine",
    role: "Executive Chef & Owner",
    restaurant: "La Maison Dorée, Paris",
    avatar: "IF",
    stars: 5,
  },
  {
    quote:
      "We cut printing costs entirely and get real-time insight into what dishes are resonating. Our upsell revenue is up 22% since switching.",
    name: "Marcus Chen",
    role: "General Manager",
    restaurant: "The Obsidian, NYC",
    avatar: "MC",
    stars: 5,
  },
  {
    quote:
      "Setup took less than an hour. Our international guests love the automatic translation — it's a game-changer for a tourist-heavy location.",
    name: "Amara Osei",
    role: "Head of Operations",
    restaurant: "Soho Grand Kitchen, London",
    avatar: "AO",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "rgba(212,175,55,0.85)", fontSize: "12px" }}>
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-28 px-6 relative" id="testimonials">
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p
            className="text-[10px] tracking-widest-luxury uppercase mb-4"
            style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}
          >
            ✦ &nbsp; From our community
          </p>
          <h2
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
          >
            Restaurateurs Who
            <br />
            <span className="text-gold-gradient">Chose Excellence</span>
          </h2>
          <div className="divider-gold w-32 mx-auto" />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="glass border-gold-gradient rounded-md p-7 flex flex-col gap-5 hover:glass-gold hover:glow-gold-sm transition-all duration-500"
            >
              {/* Quote mark */}
              <span
                className="font-display text-5xl leading-none select-none"
                style={{
                  color: "rgba(212,175,55,0.2)",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                "
              </span>

              <Stars count={t.stars} />

              <p
                className="text-sm leading-relaxed flex-1 -mt-2"
                style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}
              >
                {t.quote}
              </p>

              <div className="divider-gold" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full glass-gold flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ color: "rgba(212,175,55,0.9)", fontFamily: "'Inter', sans-serif" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "hsl(45 15% 88%)", fontFamily: "'Playfair Display', serif" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {t.role} · {t.restaurant}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.65 }}
          className="mt-16 grid grid-cols-3 gap-6 glass border-gold-gradient rounded-md py-8"
        >
          {[
            { value: "2,400+", label: "Restaurants" },
            { value: "4.9★", label: "Average rating" },
            { value: "18M+", label: "Menus viewed" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl font-bold font-display text-gold-gradient"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </span>
              <span
                className="text-[11px] tracking-wide"
                style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
