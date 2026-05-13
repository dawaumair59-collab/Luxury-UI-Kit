import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Create Your Menu",
    description:
      "Import your existing menu or build from scratch with our elegant drag-and-drop editor. Add photos, descriptions, prices, and allergen tags in minutes.",
    detail: "Avg. setup time: 15 minutes",
  },
  {
    number: "02",
    title: "Generate Your QR Code",
    description:
      "Get a custom-branded QR code for your restaurant. Assign unique codes per table, takeout, or location — all managed from one dashboard.",
    detail: "Unlimited QR codes on all plans",
  },
  {
    number: "03",
    title: "Watch Your Guests Delight",
    description:
      "Your guests scan, browse your stunning menu, and order or inquire. Track views, popular items, and session data to constantly refine the experience.",
    detail: "Live analytics from day one",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-28 px-6 relative" id="how-it-works">
      {/* Section bg accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(212,175,55,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p
            className="text-[10px] tracking-widest-luxury uppercase mb-4"
            style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}
          >
            ✦ &nbsp; Simple to start
          </p>
          <h2
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
          >
            Up and Running in
            <br />
            <span className="text-gold-gradient">Three Simple Steps</span>
          </h2>
          <div className="divider-gold w-32 mx-auto" />
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-start gap-8 md:gap-12 pb-12 ${
                i < STEPS.length - 1 ? "border-b" : ""
              }`}
              style={{ borderColor: "rgba(212,175,55,0.1)" }}
            >
              {/* Number */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-16 h-16 glass-gold rounded-sm flex items-center justify-center font-bold text-lg glow-gold-sm"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "rgba(212,175,55,0.9)",
                  }}
                >
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-px flex-1 mt-4"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(212,175,55,0.3), transparent)",
                      minHeight: "48px",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pt-3 pb-12 flex flex-col gap-3">
                <h3
                  className="text-2xl font-semibold"
                  style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-xl"
                  style={{ color: "rgba(212,175,55,0.45)", fontFamily: "'Inter', sans-serif" }}
                >
                  {step.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgba(212,175,55,0.6)" }}
                  />
                  <span
                    className="text-[11px] tracking-wide"
                    style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.detail}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
