import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useQuery } from "@tanstack/react-query";
import { getMyRestaurant } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

export function QRPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: getMyRestaurant,
  });

  const baseUrl = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "");
  const restaurantUrl = restaurant?.slug
    ? `${baseUrl}/restaurant/${restaurant.slug}`
    : `${baseUrl}/restaurant/your-restaurant`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(restaurantUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [restaurantUrl]);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) { setDownloading(false); return; }

    // Create a padded export canvas
    const size = 512;
    const padding = 48;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = size + padding * 2;
    exportCanvas.height = size + padding * 2;
    const ctx = exportCanvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Gold border
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    ctx.strokeRect(padding / 2, padding / 2, size + padding, size + padding);

    // Inner glow
    const grad = ctx.createRadialGradient(
      exportCanvas.width / 2, exportCanvas.height / 2, size / 4,
      exportCanvas.width / 2, exportCanvas.height / 2, size
    );
    grad.addColorStop(0, "rgba(212,175,55,0.05)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // QR code
    ctx.drawImage(canvas, padding, padding, size, size);

    // Restaurant name
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 18px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText(restaurant?.name ?? "MenuLux", exportCanvas.width / 2, exportCanvas.height - 16);

    const url = exportCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${restaurant?.slug ?? "menulux"}-qr.png`;
    a.click();
    setDownloading(false);
  }, [restaurant]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-2" style={{ background: "rgba(212,175,55,0.08)" }} />
        <Skeleton className="h-4 w-72 mb-8" style={{ background: "rgba(212,175,55,0.05)" }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-md" style={{ background: "rgba(212,175,55,0.06)" }} />
          <Skeleton className="h-96 rounded-md" style={{ background: "rgba(212,175,55,0.06)" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <motion.div initial="initial" animate="animate" variants={stagger} className="mb-8">
        <motion.p
          variants={fadeUp}
          className="text-[10px] tracking-widest-luxury uppercase mb-2"
          style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
        >
          ✦ &nbsp; QR Generator
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
        >
          Your <span className="text-gold-gradient">QR Code</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-xs"
          style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
        >
          Share this code on tables, receipts, and marketing materials.
        </motion.p>
        <motion.div variants={fadeUp} className="divider-gold w-20 mt-4" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* QR Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass border-gold-gradient rounded-md p-8 flex flex-col items-center gap-6"
          style={{ background: "rgba(10,8,4,0.85)" }}
        >
          {/* Gold-framed QR */}
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-md pointer-events-none"
              style={{
                boxShadow: "0 0 40px rgba(212,175,55,0.18), 0 0 80px rgba(212,175,55,0.08)",
              }}
            />
            {/* Gold border frame */}
            <div
              className="p-4 rounded-md relative"
              style={{
                background: "hsl(0 0% 6%)",
                border: "2px solid rgba(212,175,55,0.45)",
                boxShadow: "inset 0 0 20px rgba(212,175,55,0.05)",
              }}
            >
              {/* Corner accents */}
              {[
                "top-0 left-0 border-t-2 border-l-2",
                "top-0 right-0 border-t-2 border-r-2",
                "bottom-0 left-0 border-b-2 border-l-2",
                "bottom-0 right-0 border-b-2 border-r-2",
              ].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute w-4 h-4 ${pos}`}
                  style={{ borderColor: "#d4af37" }}
                />
              ))}

              {/* QR Canvas */}
              <div ref={canvasRef} className="relative">
                <QRCodeCanvas
                  value={restaurantUrl}
                  size={220}
                  bgColor="#0d0b06"
                  fgColor="#d4af37"
                  level="H"
                  imageSettings={
                    restaurant?.logo_url
                      ? {
                          src: restaurant.logo_url,
                          x: undefined,
                          y: undefined,
                          height: 44,
                          width: 44,
                          excavate: true,
                        }
                      : undefined
                  }
                />
                {/* Center logo fallback */}
                {!restaurant?.logo_url && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-sm flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080)",
                      color: "hsl(0 0% 4%)",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "14px",
                      pointerEvents: "none",
                    }}
                  >
                    {(restaurant?.name ?? "ML").slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Restaurant name */}
          <div className="text-center">
            <div
              className="text-base font-bold text-gold-gradient mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {restaurant?.name ?? "Your Restaurant"}
            </div>
            <div
              className="text-[10px] tracking-widest-luxury uppercase"
              style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'Inter', sans-serif" }}
            >
              Scan to view menu
            </div>
          </div>
        </motion.div>

        {/* Actions Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="flex flex-col gap-5"
        >
          {/* URL display */}
          <div className="glass border-gold-gradient rounded-md p-5">
            <div
              className="text-[10px] tracking-widest-luxury uppercase mb-3"
              style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
            >
              Menu URL
            </div>
            <div
              className="text-xs break-all mb-4 px-3 py-2.5 rounded-sm"
              style={{
                background: "rgba(212,175,55,0.04)",
                border: "1px solid rgba(212,175,55,0.12)",
                color: "rgba(212,175,55,0.65)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {restaurantUrl}
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-sm text-sm font-semibold transition-all duration-300 hover:glow-gold-sm flex items-center justify-center gap-2"
              style={{
                background: copied
                  ? "linear-gradient(135deg, #2d6a2d, #4a8a4a)"
                  : "rgba(212,175,55,0.08)",
                border: "1px solid",
                borderColor: copied ? "#4a8a4a" : "rgba(212,175,55,0.2)",
                color: copied ? "#7dc87d" : "rgba(212,175,55,0.8)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span>{copied ? "✓" : "⧉"}</span>
              {copied ? "Link Copied!" : "Copy Share Link"}
            </button>
          </div>

          {/* Download */}
          <div className="glass border-gold-gradient rounded-md p-5">
            <div
              className="text-[10px] tracking-widest-luxury uppercase mb-2"
              style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
            >
              Export
            </div>
            <p
              className="text-xs mb-4"
              style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
            >
              Download a high-quality PNG with gold border — perfect for print menus, table cards, and digital marketing.
            </p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 rounded-sm text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080)",
                color: "hsl(0 0% 4%)",
                fontFamily: "'Inter', sans-serif",
                opacity: downloading ? 0.7 : 1,
                boxShadow: downloading ? "none" : "0 4px 20px rgba(212,175,55,0.25)",
              }}
            >
              {downloading ? (
                <>
                  <span className="animate-spin">◌</span> Preparing...
                </>
              ) : (
                <>
                  <span>↓</span> Download as PNG
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="glass border-gold-gradient rounded-md p-5">
            <div
              className="text-[10px] tracking-widest-luxury uppercase mb-3"
              style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
            >
              Usage Tips
            </div>
            <ul className="flex flex-col gap-2.5">
              {[
                { icon: "◈", tip: "Place on table tents for dine-in guests" },
                { icon: "◇", tip: "Add to your social media bio link" },
                { icon: "▶", tip: "Print on receipts and packaging" },
                { icon: "⬡", tip: "Use in Google Business profile" },
              ].map(({ icon, tip }) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.45)" }}>
                    {icon}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
