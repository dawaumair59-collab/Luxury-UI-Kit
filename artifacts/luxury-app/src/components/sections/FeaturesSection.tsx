import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "⬡",
    title: "QR Code Generation",
    description:
      "Instant, branded QR codes for tables, takeout bags, and windows. Scan-to-menu in under a second.",
  },
  {
    icon: "⟳",
    title: "Real-Time Updates",
    description:
      "Update your menu on the fly — 86 a dish, adjust prices, add specials — with zero reprinting.",
  },
  {
    icon: "◈",
    title: "Rich Media Menus",
    description:
      "Showcase your dishes with stunning photos, chef's notes, allergen info, and pairing suggestions.",
  },
  {
    icon: "📊",
    title: "Guest Analytics",
    description:
      "Know exactly which dishes get the most views, clicks, and conversions. Drive upsells with data.",
  },
  {
    icon: "🌐",
    title: "Multi-Language",
    description:
      "Serve international guests with automatic translation into 40+ languages, right from your dashboard.",
  },
  {
    icon: "◆",
    title: "POS Integration",
    description:
      "Connects seamlessly with Square, Toast, Revel, and Lightspeed — your data, your workflow.",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function FeaturesSection() {
  return (
    <section className="py-28 px-6" id="features">
      <div className="max-w-6xl mx-auto">
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
            ✦ &nbsp; Everything you need
          </p>
          <h2
            className="text-4xl md:text-5xl font-display font-bold mb-5"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
          >
            Built for Modern
            <br />
            <span className="text-gold-gradient">Restaurant Excellence</span>
          </h2>
          <div className="divider-gold w-32 mx-auto mb-5" />
          <p
            className="text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(212,175,55,0.45)", fontFamily: "'Inter', sans-serif" }}
          >
            Every feature is crafted with the same attention to detail you bring to your kitchen.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariant}
              className="glass border-gold-gradient rounded-md p-7 flex flex-col gap-4 group hover:glass-gold hover:glow-gold-sm transition-all duration-500 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-sm glass-gold flex items-center justify-center text-xl transition-all duration-300 group-hover:glow-gold-sm"
                style={{ color: "rgba(212,175,55,0.85)" }}
              >
                {f.icon}
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(212,175,55,0.42)", fontFamily: "'Inter', sans-serif" }}
              >
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
