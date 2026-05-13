import { motion } from "framer-motion";

const LINKS = {
  Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

export function FooterSection() {
  return (
    <footer className="relative pt-20 pb-10 px-6" id="footer">
      {/* Top divider */}
      <div className="divider-gold mb-16" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand col */}
          <div className="md:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
              <span
                className="text-gold-gradient text-2xl font-bold tracking-widest-luxury select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                MENULUX
              </span>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
            </div>

            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
            >
              The world's most elegant digital menu platform. Crafted for restaurants who refuse to
              compromise on guest experience.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-1">
              {["𝕏", "in", "ig", "yt"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 glass-gold rounded-sm flex items-center justify-center text-xs transition-all duration-200 hover:glow-gold-sm"
                  style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'Inter', sans-serif" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-4">
              <h4
                className="text-[10px] tracking-widest-luxury uppercase font-semibold"
                style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Inter', sans-serif" }}
              >
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = "rgba(212,175,55,0.75)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = "rgba(212,175,55,0.32)";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="glass border-gold-gradient rounded-md p-7 mb-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <h4
              className="text-lg font-semibold mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 90%)" }}
            >
              Stay in the know
            </h4>
            <p
              className="text-xs"
              style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
            >
              Tips, product updates, and restaurant industry insights — monthly.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@restaurant.com"
              className="flex-1 sm:w-52 px-4 py-2.5 glass-dark rounded-sm text-sm outline-none border focus:border-[rgba(212,175,55,0.4)] transition-colors duration-200"
              style={{
                color: "rgba(212,175,55,0.7)",
                borderColor: "rgba(212,175,55,0.15)",
                fontFamily: "'Inter', sans-serif",
                background: "transparent",
              }}
            />
            <button
              className="px-5 py-2.5 text-xs font-semibold rounded-sm transition-all duration-300 hover:glow-gold-sm whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080)",
                color: "hsl(0 0% 4%)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* Bottom row */}
        <div className="divider-gold mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[10px]"
            style={{ color: "rgba(212,175,55,0.25)", fontFamily: "'Inter', sans-serif" }}
          >
            © {new Date().getFullYear()} MenuLux, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span
              className="text-[10px]"
              style={{ color: "rgba(212,175,55,0.2)", fontFamily: "'Inter', sans-serif" }}
            >
              Crafted with care for the restaurant industry
            </span>
            <span style={{ color: "rgba(212,175,55,0.4)", fontSize: "10px" }}> ✦ </span>
          </div>
        </div>
      </div>

      {/* Bottom gold shimmer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px gold-shimmer-bar" />
    </footer>
  );
}
