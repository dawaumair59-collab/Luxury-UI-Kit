import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyRestaurant } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};
const stagger = { animate: { transition: { staggerChildren: 0.09 } } };

export interface Subscription {
  id: string;
  restaurant_id: string;
  plan: "free" | "pro" | "premium";
  status: "active" | "cancelled" | "past_due";
  razorpay_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
}

async function getSubscription(restaurantId: string): Promise<Subscription | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();
  return data as Subscription | null;
}

async function saveSubscription(payload: Partial<Subscription> & { restaurant_id: string; plan: string }) {
  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "restaurant_id" })
    .select()
    .single();
  if (error) throw error;
  return data as Subscription;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with a beautiful digital menu.",
    features: [
      { label: "Up to 10 menu items", included: true },
      { label: "QR code generator", included: true },
      { label: "Public restaurant page", included: true },
      { label: "Basic analytics", included: true },
      { label: "Video reels", included: false },
      { label: "Custom branding", included: false },
      { label: "Priority support", included: false },
    ],
    badge: null,
    cta: "Current Plan",
    razorpayPlanId: null,
    amount: 0,
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    period: "month",
    description: "For growing restaurants ready to impress.",
    features: [
      { label: "Unlimited menu items", included: true },
      { label: "QR code generator", included: true },
      { label: "Public restaurant page", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Up to 10 video reels", included: true },
      { label: "Custom branding", included: true },
      { label: "Priority support", included: false },
    ],
    badge: "Most Popular",
    cta: "Upgrade to Pro",
    razorpayPlanId: "plan_pro",
    amount: 99900, // in paise
  },
  {
    id: "premium",
    name: "Premium",
    price: 2499,
    period: "month",
    description: "Everything unlimited — the ultimate luxury experience.",
    features: [
      { label: "Unlimited menu items", included: true },
      { label: "QR code generator", included: true },
      { label: "Public restaurant page", included: true },
      { label: "Full analytics suite", included: true },
      { label: "Unlimited video reels", included: true },
      { label: "Custom branding", included: true },
      { label: "Priority support", included: true },
    ],
    badge: "Best Value",
    cta: "Upgrade to Premium",
    razorpayPlanId: "plan_premium",
    amount: 249900,
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BillingPage() {
  const queryClient = useQueryClient();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const { data: restaurant, isLoading: loadingR } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: getMyRestaurant,
  });

  const { data: subscription, isLoading: loadingSub } = useQuery({
    queryKey: ["subscription", restaurant?.id],
    queryFn: () => getSubscription(restaurant!.id),
    enabled: !!restaurant?.id,
  });

  const saveMutation = useMutation({
    mutationFn: saveSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  const currentPlan = subscription?.plan ?? "free";

  const handleUpgrade = async (plan: typeof PLANS[0]) => {
    if (plan.id === "free" || plan.id === currentPlan) return;
    if (!restaurant) return;

    setProcessingPlan(plan.id);
    setPaymentStatus("idle");

    const loaded = await loadRazorpay();
    if (!loaded) {
      setProcessingPlan(null);
      alert("Failed to load Razorpay. Please try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID ?? "rzp_test_placeholder",
      amount: plan.amount,
      currency: "INR",
      name: "MenuLux",
      description: `${plan.name} Plan — Monthly Subscription`,
      image: "/menulux-logo.png",
      prefill: {
        name: restaurant.name,
        email: "",
      },
      theme: {
        color: "#d4af37",
        backdrop_color: "rgba(0,0,0,0.85)",
      },
      modal: {
        ondismiss: () => setProcessingPlan(null),
      },
      handler: async (response: any) => {
        try {
          await saveMutation.mutateAsync({
            restaurant_id: restaurant.id,
            plan: plan.id as "pro" | "premium",
            status: "active",
            razorpay_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id ?? null,
          });
          setPaymentStatus("success");
          setSuccessPlan(plan.name);
        } catch {
          setPaymentStatus("failed");
        } finally {
          setProcessingPlan(null);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      setPaymentStatus("failed");
      setProcessingPlan(null);
    });
    rzp.open();
  };

  const isLoading = loadingR || loadingSub;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl space-y-6">
        <Skeleton className="h-8 w-48 mb-2" style={{ background: "rgba(212,175,55,0.08)" }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-md" style={{ background: "rgba(212,175,55,0.06)" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <motion.div initial="initial" animate="animate" variants={stagger} className="mb-10">
        <motion.p
          variants={fadeUp}
          className="text-[10px] tracking-widest-luxury uppercase mb-2"
          style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
        >
          ✦ &nbsp; Billing
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: "hsl(45 15% 92%)" }}
        >
          Choose Your <span className="text-gold-gradient">Plan</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-xs"
          style={{ color: "rgba(212,175,55,0.32)", fontFamily: "'Inter', sans-serif" }}
        >
          Unlock the full MenuLux experience with a premium subscription.
        </motion.p>
        <motion.div variants={fadeUp} className="divider-gold w-20 mt-4" />
      </motion.div>

      {/* Payment status banners */}
      <AnimatePresence>
        {paymentStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 px-5 py-4 rounded-md flex items-center gap-3"
            style={{
              background: "rgba(34,85,34,0.3)",
              border: "1px solid rgba(74,138,74,0.4)",
            }}
          >
            <span className="text-green-400 text-lg">✓</span>
            <div>
              <div className="text-sm font-semibold text-green-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                Payment Successful!
              </div>
              <div className="text-xs text-green-400/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                Welcome to {successPlan} — your plan is now active.
              </div>
            </div>
            <button onClick={() => setPaymentStatus("idle")} className="ml-auto text-green-400/50 hover:text-green-400">✕</button>
          </motion.div>
        )}
        {paymentStatus === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 px-5 py-4 rounded-md flex items-center gap-3"
            style={{
              background: "rgba(85,34,34,0.3)",
              border: "1px solid rgba(138,74,74,0.4)",
            }}
          >
            <span className="text-red-400 text-lg">✕</span>
            <div>
              <div className="text-sm font-semibold text-red-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                Payment Failed
              </div>
              <div className="text-xs text-red-400/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                Please try again or contact support.
              </div>
            </div>
            <button onClick={() => setPaymentStatus("idle")} className="ml-auto text-red-400/50 hover:text-red-400">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Plan Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 glass border-gold-gradient rounded-md px-5 py-4 flex items-center gap-4"
      >
        <div
          className="w-10 h-10 rounded-sm flex items-center justify-center text-sm"
          style={{
            background: currentPlan === "premium"
              ? "linear-gradient(135deg, #a07830, #d4af37, #f0d080)"
              : currentPlan === "pro"
              ? "linear-gradient(135deg, #6a5acd, #8a7aed)"
              : "rgba(212,175,55,0.1)",
            color: currentPlan === "free" ? "rgba(212,175,55,0.5)" : "hsl(0 0% 4%)",
          }}
        >
          {currentPlan === "premium" ? "★" : currentPlan === "pro" ? "◆" : "○"}
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: "hsl(45 15% 82%)", fontFamily: "'Inter', sans-serif" }}>
            Current Plan
          </div>
          <div
            className="text-base font-bold text-gold-gradient"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            {subscription?.status === "active" && currentPlan !== "free" && (
              <span className="ml-2 text-xs text-green-400/80 font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                Active
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {PLANS.map((plan, i) => {
          const isCurrentPlan = plan.id === currentPlan;
          const isPro = plan.id === "pro";
          const isPremium = plan.id === "premium";
          const isProcessing = processingPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.55 }}
              className="relative rounded-md flex flex-col overflow-hidden"
              style={{
                background: isPro
                  ? "rgba(10,8,4,0.9)"
                  : "rgba(8,6,2,0.8)",
                border: "1px solid",
                borderColor: isPro
                  ? "rgba(212,175,55,0.5)"
                  : isPremium
                  ? "rgba(212,175,55,0.3)"
                  : "rgba(212,175,55,0.12)",
                boxShadow: isPro ? "0 0 40px rgba(212,175,55,0.12)" : "none",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute top-0 right-0 text-[9px] font-bold px-3 py-1 tracking-widest uppercase"
                  style={{
                    background: isPro
                      ? "linear-gradient(135deg, #a07830, #d4af37)"
                      : "linear-gradient(135deg, #5a3acd, #7a5aed)",
                    color: "hsl(0 0% 4%)",
                    fontFamily: "'Inter', sans-serif",
                    borderBottomLeftRadius: "4px",
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Plan name */}
                <div
                  className="text-xs tracking-widest uppercase mb-3"
                  style={{ color: "rgba(212,175,55,0.45)", fontFamily: "'Inter', sans-serif" }}
                >
                  {plan.name}
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className="text-4xl font-bold text-gold-gradient"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span
                      className="text-xs mb-1.5"
                      style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'Inter', sans-serif" }}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>

                <p
                  className="text-xs mb-6"
                  style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
                >
                  {plan.description}
                </p>

                {/* Divider */}
                <div className="divider-gold mb-5" />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2.5">
                      <span
                        className="text-xs mt-0.5 flex-shrink-0"
                        style={{ color: f.included ? "#d4af37" : "rgba(212,175,55,0.18)" }}
                      >
                        {f.included ? "✓" : "✕"}
                      </span>
                      <span
                        className="text-xs"
                        style={{
                          color: f.included ? "rgba(212,175,55,0.6)" : "rgba(212,175,55,0.25)",
                          fontFamily: "'Inter', sans-serif",
                          textDecoration: f.included ? "none" : "line-through",
                        }}
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrentPlan || plan.id === "free" || isProcessing}
                  className="mt-6 w-full py-3 rounded-sm text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: isCurrentPlan
                      ? "rgba(212,175,55,0.08)"
                      : plan.id === "free"
                      ? "rgba(212,175,55,0.05)"
                      : isPro
                      ? "linear-gradient(135deg, #a07830, #d4af37, #f0d080)"
                      : "linear-gradient(135deg, #5a3acd, #8a6aed, #c0a0ff)",
                    color: isCurrentPlan || plan.id === "free"
                      ? "rgba(212,175,55,0.35)"
                      : "hsl(0 0% 4%)",
                    fontFamily: "'Inter', sans-serif",
                    cursor: isCurrentPlan || plan.id === "free" ? "default" : "pointer",
                    boxShadow: !isCurrentPlan && plan.id !== "free" && !isProcessing
                      ? isPro
                        ? "0 4px 20px rgba(212,175,55,0.25)"
                        : "0 4px 20px rgba(90,60,205,0.3)"
                      : "none",
                    opacity: isProcessing ? 0.8 : 1,
                  }}
                >
                  {isProcessing ? (
                    <><span className="animate-spin">◌</span> Processing...</>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Security note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex items-center justify-center gap-3 text-center"
      >
        <span className="text-sm" style={{ color: "rgba(212,175,55,0.2)" }}>🔒</span>
        <p
          className="text-[10px]"
          style={{ color: "rgba(212,175,55,0.25)", fontFamily: "'Inter', sans-serif" }}
        >
          Payments are secured by Razorpay · SSL encrypted · Cancel anytime
        </p>
      </motion.div>
    </div>
  );
}
