import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FAQS = [
  {
    q: "How long does it take to set up MenuLux?",
    a: "Most restaurants are fully live in under 30 minutes. You can import your existing menu as a CSV, PDF, or manually build it with our drag-and-drop editor. Our onboarding team is also available to help.",
  },
  {
    q: "Do my guests need to download an app?",
    a: "No app required — ever. Your guests simply scan the QR code with their phone's default camera and your menu opens instantly in the browser. Fully mobile-optimized and lightning-fast.",
  },
  {
    q: "Can I update my menu in real time?",
    a: "Yes, immediately. Change a price, 86 a dish, or add a special in your dashboard and guests see the update the next time they scan — no delays, no reprinting.",
  },
  {
    q: "What POS systems does MenuLux integrate with?",
    a: "MenuLux integrates with Square, Toast, Lightspeed, Revel, and Clover on the Premium plan. We're continuously adding new integrations. Contact us if yours isn't listed.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted in transit and at rest. We are SOC 2 Type II compliant and GDPR-ready. We never sell or share your data with third parties.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Absolutely. There are no contracts, no cancellation fees, and no hard feelings. Cancel any time from your dashboard. If you're on an annual plan, we'll prorate unused months.",
  },
  {
    q: "Do you support multiple locations?",
    a: "Yes — the Premium plan supports up to 15 locations under one account with centralized management, separate analytics per location, and a unified billing dashboard.",
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="border-b transition-colors duration-300"
      style={{ borderColor: isOpen ? "rgba(212,175,55,0.2)" : "rgba(212,175,55,0.08)" }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={onToggle}
      >
        <span
          className="text-sm font-medium transition-colors duration-200"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: isOpen ? "hsl(45 15% 92%)" : "rgba(212,175,55,0.65)",
          }}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0 w-6 h-6 glass-gold rounded-sm flex items-center justify-center text-sm"
          style={{ color: "rgba(212,175,55,0.8)" }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="pb-5 text-sm leading-relaxed"
              style={{ color: "rgba(212,175,55,0.42)", fontFamily: "'Inter', sans-serif" }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 px-6" id="faq">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p
            className="text-[10px] tracking-widest-luxury uppercase mb-4"
            style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}
          >
            ✦ &nbsp; Common questions
          </p>
          <h2
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
          >
            Questions <span className="text-gold-gradient">Answered</span>
          </h2>
          <div className="divider-gold w-32 mx-auto" />
        </motion.div>

        {/* FAQ list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass border-gold-gradient rounded-md px-7"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* CTA below */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mt-10 text-[11px]"
          style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
        >
          Still have questions?{" "}
          <a
            href="#"
            className="underline underline-offset-2 transition-colors duration-200"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Chat with our team
          </a>
        </motion.p>
      </div>
    </section>
  );
}
