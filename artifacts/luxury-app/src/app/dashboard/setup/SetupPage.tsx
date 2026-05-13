import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { generateSlug, isSlugAvailable, upsertRestaurant } from "@/lib/db";
import { uploadToStorage } from "@/lib/upload";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/components/ui/LuxToast";

const THEMES = [
  { id: "gold", label: "Royal Gold", color: "#C9A84C" },
  { id: "rose", label: "Rose Blush", color: "#C9696B" },
  { id: "emerald", label: "Emerald Noir", color: "#2D9E6B" },
  { id: "sapphire", label: "Deep Sapphire", color: "#3B6BC9" },
  { id: "platinum", label: "Platinum", color: "#A0A0B0" },
];

const STEPS = ["Restaurant", "Logo", "Banner", "Theme", "Launch"];

export function SetupPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const [theme, setTheme] = useState("gold");

  // Auto-generate slug from name
  useEffect(() => {
    if (!name) { setSlug(""); setSlugAvailable(null); return; }
    const base = generateSlug(name);
    setSlug(base);
    setSlugChecking(true);
    setSlugAvailable(null);
    const t = setTimeout(async () => {
      const ok = await isSlugAvailable(base);
      setSlugAvailable(ok);
      setSlugChecking(false);
    }, 500);
    return () => clearTimeout(t);
  }, [name]);

  // Preview logo
  useEffect(() => {
    if (!logoFile) return;
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  // Preview banner
  useEffect(() => {
    if (!bannerFile) return;
    const url = URL.createObjectURL(bannerFile);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

  const uploadLogo = async () => {
    if (!logoFile || !user) return;
    setLogoUploading(true);
    try {
      const url = await uploadToStorage(logoFile, "restaurant-assets", `${user.id}/logo-${Date.now()}`);
      setLogoUrl(url);
      showToast("Logo uploaded", "success");
    } catch {
      showToast("Logo upload failed — check storage bucket permissions", "error");
    } finally {
      setLogoUploading(false);
    }
  };

  const uploadBanner = async () => {
    if (!bannerFile || !user) return;
    setBannerUploading(true);
    try {
      const url = await uploadToStorage(bannerFile, "restaurant-assets", `${user.id}/banner-${Date.now()}`);
      setBannerUrl(url);
      showToast("Banner uploaded", "success");
    } catch {
      showToast("Banner upload failed — check storage bucket permissions", "error");
    } finally {
      setBannerUploading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1 && logoFile && !logoUrl) await uploadLogo();
    if (step === 2 && bannerFile && !bannerUrl) await uploadBanner();
    if (step < STEPS.length - 1) { setStep((s) => s + 1); return; }
    // Final step — save to DB
    if (!user) return;
    setSaving(true);
    try {
      await upsertRestaurant({
        user_id: user.id,
        name,
        slug,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        theme,
      });
      showToast("Restaurant created! Welcome to MenuLux.", "success");
      setTimeout(() => setLocation("/dashboard"), 800);
    } catch (e: unknown) {
      showToast((e as Error).message ?? "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const canNext = () => {
    if (step === 0) return name.trim().length > 1 && slugAvailable === true;
    return true;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs tracking-[0.3em] text-gold/60 uppercase font-medium">MenuLux Setup</span>
          <h1 className="text-3xl font-serif text-white mt-2">Set up your restaurant</h1>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-1 rounded-full transition-all duration-500
                ${i <= step ? "bg-gold" : "bg-white/10"}`} />
              <span className={`text-[10px] tracking-wider transition-colors duration-300
                ${i === step ? "text-gold" : i < step ? "text-gold/50" : "text-white/20"}`}>
                {s.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-dark border border-white/10 rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif text-white mb-1">What's your restaurant called?</h2>
                  <p className="text-sm text-white/40">This will appear on your public menu page.</p>
                </div>
                <div className="space-y-3">
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. La Maison Dorée"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors"
                  />
                  {slug && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/40">menulux.app/</span>
                      <span className="text-white/70 font-mono">{slug}</span>
                      {slugChecking && <span className="text-white/30 text-xs">checking…</span>}
                      {!slugChecking && slugAvailable === true && <span className="text-emerald-400 text-xs">✓ available</span>}
                      {!slugChecking && slugAvailable === false && <span className="text-red-400 text-xs">✗ taken</span>}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif text-white mb-1">Add your logo</h2>
                  <p className="text-sm text-white/40">Square image, at least 200×200px. Skip if you don't have one yet.</p>
                </div>
                <ImageUpload
                  label="Restaurant Logo"
                  value={logoPreview}
                  onChange={setLogoFile}
                  aspect="square"
                  loading={logoUploading}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif text-white mb-1">Add a banner image</h2>
                  <p className="text-sm text-white/40">Shown as the hero on your public menu page. Wide landscape image works best.</p>
                </div>
                <ImageUpload
                  label="Hero Banner"
                  value={bannerPreview}
                  onChange={setBannerFile}
                  aspect="banner"
                  loading={bannerUploading}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif text-white mb-1">Choose your accent colour</h2>
                  <p className="text-sm text-white/40">Sets the primary colour on your public menu page.</p>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {THEMES.map((t) => (
                    <button key={t.id} onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                        ${theme === t.id ? "border-white/40 bg-white/10" : "border-white/10 hover:border-white/25"}`}>
                      <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: t.color }} />
                      <span className="text-[10px] text-white/50 text-center leading-tight">{t.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  {logoPreview
                    ? <img src={logoPreview} className="w-full h-full rounded-full object-cover" />
                    : <span className="text-3xl font-serif text-gold">{name[0]?.toUpperCase()}</span>}
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-white">{name}</h2>
                  <p className="text-sm text-white/40 mt-1 font-mono">/{slug}</p>
                </div>
                <div className="text-sm text-white/50">
                  Your luxury restaurant page is ready to launch. You can update everything later from your dashboard.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm">
                Back
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!canNext() || saving}
              className="flex-1 py-3 rounded-xl bg-gold text-black font-semibold text-sm
                disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold/90 transition-all relative overflow-hidden"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Saving…
                </span>
              ) : step === STEPS.length - 1 ? "Launch Restaurant" : "Continue"}
            </motion.button>
          </div>

          {(step === 1 || step === 2) && (
            <button onClick={() => setStep((s) => s + 1)}
              className="w-full mt-3 text-xs text-white/30 hover:text-white/50 transition-colors text-center">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
