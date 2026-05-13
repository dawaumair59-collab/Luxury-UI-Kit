import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const field = {
  label: (text: string) => (
    <label
      className="text-[10px] tracking-widest-luxury uppercase mb-1.5 block"
      style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Inter', sans-serif" }}
    >
      {text}
    </label>
  ),
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({ title: "Welcome back", description: "Redirecting to your dashboard…" });
    navigate("/dashboard");
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: "hsl(0 0% 4%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Corner ornaments */}
      <Ornament className="absolute top-8 left-8" />
      <Ornament className="absolute top-8 right-8 rotate-90" />
      <Ornament className="absolute bottom-8 left-8 -rotate-90" />
      <Ornament className="absolute bottom-8 right-8 rotate-180" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="glass border-gold-gradient rounded-md p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-3 mb-8 group"
            >
              <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
              <span
                className="text-gold-gradient text-xl font-bold tracking-widest-luxury"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                MENULUX
              </span>
              <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
            </a>

            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
            >
              Welcome Back
            </h1>
            <p
              className="text-xs"
              style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
            >
              Sign in to your MenuLux account
            </p>
          </div>

          <div className="divider-gold mb-8" />

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              {field.label("Email address")}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@restaurant.com"
                className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  color: "hsl(45 15% 88%)",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.45)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.15)")}
              />
            </div>

            <div>
              {field.label("Password")}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  color: "hsl(45 15% 88%)",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.45)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.15)")}
              />
              <div className="flex justify-end mt-1.5">
                <a
                  href="#"
                  className="text-[10px] transition-colors duration-200"
                  style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(212,175,55,0.7)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(212,175,55,0.35)")}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold tracking-wide rounded-sm transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed hover:glow-gold hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: loading
                  ? "rgba(212,175,55,0.3)"
                  : "linear-gradient(135deg, #a07830, #d4af37 40%, #f0d080 65%, #c8a84b)",
                color: loading ? "rgba(212,175,55,0.6)" : "hsl(0 0% 4%)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin inline-block"
                    style={{ borderColor: "rgba(212,175,55,0.5)", borderTopColor: "transparent" }}
                  />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="divider-gold my-7" />

          <p
            className="text-center text-xs"
            style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
          >
            Don't have an account?{" "}
            <a
              href="/signup"
              className="underline underline-offset-2 transition-colors duration-200"
              style={{ color: "rgba(212,175,55,0.65)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(212,175,55,0.95)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(212,175,55,0.65)")}
            >
              Create your account
            </a>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px gold-shimmer-bar" />
    </div>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className} style={{ opacity: 0.25 }}>
      <path d="M1 1 L10 1 L1 10 Z" stroke="url(#o-g)" strokeWidth="0.75" fill="none" />
      <path d="M1 1 L7 1" stroke="url(#o-g)" strokeWidth="0.75" />
      <path d="M1 1 L1 7" stroke="url(#o-g)" strokeWidth="0.75" />
      <defs>
        <linearGradient id="o-g" x1="0" y1="0" x2="10" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0d080" /><stop offset="1" stopColor="#a07830" />
        </linearGradient>
      </defs>
    </svg>
  );
}
