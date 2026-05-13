import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const navItems = [
  { label: "Collection", href: "#" },
  { label: "About", href: "#" },
  { label: "Atelier", href: "#" },
  { label: "Contact", href: "#" },
];

export function Header({ className }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 glass-heavy",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
          <span
            className="text-gold-gradient text-xl font-bold tracking-widest-luxury select-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            LUXE
          </span>
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs tracking-luxury uppercase transition-colors duration-200"
              style={{
                color: "rgba(212,175,55,0.55)",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "rgba(240,208,128,0.95)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "rgba(212,175,55,0.55)";
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button
          className="hidden md:flex items-center gap-2 px-5 py-2 glass-gold rounded-sm text-xs tracking-luxury uppercase transition-all duration-200 hover:glow-gold-sm"
          style={{
            color: "rgba(212,175,55,0.9)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Reserve
        </button>
      </div>

      {/* Bottom border shimmer */}
      <div className="divider-gold" />
    </motion.header>
  );
}
