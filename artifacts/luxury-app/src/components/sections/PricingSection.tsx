import { motion } from "framer-motion";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    tagline: "For new restaurateurs",
    features: [
      "1 menu",
      "Up to 30 items",
      "Basic QR code",
      "MenuLux branding",
      "Email support",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: { monthly: 49, annual: 39 },
    tagline: "For growing restaurants",
    features: [
      "Unlimited menus",
      "Unlimited items",
      "Custom-branded QR codes",
      "Photo uploads & rich media",
      "Guest analytics dashboard",
      "Multi-language (40+ langs)",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Premium",
    price: { monthly: 119, annual: 95 },
    tagline: "For multi-location groups",
    features: [
      "Everything in Pro",
      "Up to 15 locations",
      "POS integrations",
      "White-label platform",
      "Team management",
      "Custom domain",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="py-28 px-6" id="pricing">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p
            className="text-[10px] tracking-widest-luxury uppercase mb-4"
            style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}
          >
            ✦ &nbsp; Simple pricing
          </p>
          <h2
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
          >
            Invest in Your
            <br />
            <span className="text-gold-gradient">Guest Experience</span>
          </h2>
          <div className="divider-gold w-32 mx-auto mb-8" />

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span
              className="text-xs"
              style={{
                color: !annual ? "rgba(212,175,55,0.9)" : "rgba(212,175,55,0.35)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full transition-all duration-300 glass-gold"
              style={{ border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #c8a84b, #f0d080)",
                  left: annual ? "calc(100% - 20px)" : "4px",
                  boxShadow: "0 0 6px rgba(212,175,55,0.5)",
                }}
              />
            </button>
            <span
              className="text-xs"
              style={{
                color: annual ? "rgba(212,175,55,0.9)" : "rgba(212,175,55,0.35)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Annual
              <span
                className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full glass-gold"
                style={{ color: "rgba(212,175,55,0.7)" }}
              >
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col rounded-md p-7 transition-all duration-500 ${
                plan.featured
                  ? "border-gold-gradient glow-gold-sm"
                  : "glass border-gold-gradient"
              }`}
              style={
                plan.featured
                  ? {
                      background:
                        "linear-gradient(160deg, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0.6) 60%)",
                      backdropFilter: "blur(20px)",
                    }
                  : {}
              }
            >
              {plan.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] tracking-widest-luxury uppercase"
                  style={{
                    background: "linear-gradient(135deg, #a07830, #f0d080, #c8a84b)",
                    color: "hsl(0 0% 4%)",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-[11px]"
                  style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
                >
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-end gap-1">
                <span
                  className="text-5xl font-bold font-display text-gold-gradient"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {plan.price[annual ? "annual" : "monthly"] === 0
                    ? "Free"
                    : `$${plan.price[annual ? "annual" : "monthly"]}`}
                </span>
                {plan.price.monthly > 0 && (
                  <span
                    className="text-xs mb-2"
                    style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
                  >
                    /mo
                  </span>
                )}
              </div>

              <div className="divider-gold mb-6" />

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span style={{ color: "rgba(212,175,55,0.7)", fontSize: "10px", marginTop: "3px" }}>◆</span>
                    <span
                      className="text-sm"
                      style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter', sans-serif" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3 text-sm font-medium tracking-wide rounded-sm transition-all duration-300 ${
                  plan.featured
                    ? "hover:glow-gold hover:scale-105 active:scale-95"
                    : "glass-gold hover:glow-gold-sm"
                }`}
                style={
                  plan.featured
                    ? {
                        background:
                          "linear-gradient(135deg, #a07830, #d4af37 40%, #f0d080 65%, #c8a84b)",
                        color: "hsl(0 0% 4%)",
                        fontFamily: "'Inter', sans-serif",
                      }
                    : {
                        color: "rgba(212,175,55,0.8)",
                        fontFamily: "'Inter', sans-serif",
                      }
                }
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-8 text-[11px]"
          style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
