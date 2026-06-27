"use client";

import { useState } from "react";
import { Lock, CheckCircle2, Zap, Shield, Loader2, Gift, CreditCard } from "lucide-react";

export function PaywallOverlay() {
  const [loading, setLoading] = useState(false);

  // Temporary: Disable paywall until after July 2026 as per founder's instructions
  const currentDate = new Date();
  const targetDate = new Date('2026-08-01');
  if (currentDate < targetDate) {
    return null;
  }

  // Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleFreeTrial = async () => {
    setLoading(true);

    // 1. Load Razorpay Script
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 2. Create Subscription on our server (includes the 5-day trial)
      const response = await fetch("/api/razorpay/subscription", { method: "POST" });
      const data = await response.json();

      if (!data.subscription_id) {
        throw new Error(data.error || "Server failed to create subscription");
      }

      // 3. Open Razorpay Checkout Modal with Subscription ID
      const options = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: "Predinex Clinical",
        description: "5-Day Free Trial, then ₹299/month",
        image: "/logo.png",
        handler: async function (response: any) {
          // 4. Verify subscription signature on our server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // Trial started! Hard refresh to remove the paywall
            window.location.reload();
          } else {
            alert("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#10b981",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment setup failed: " + response.error.description);
      });

    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      {/* Heavy blur backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md rounded-3xl" />

      {/* Paywall Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">

        {/* Trial Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          <Gift className="w-4 h-4" /> 5-Day Free Trial
        </div>

        {/* Header Icon */}
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-emerald-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Start Your Free Trial
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Get <span className="text-emerald-400 font-bold">5 days completely free</span>, then just ₹299/month. Cancel anytime.
        </p>

        {/* Pricing Box */}
        <div className="bg-slate-950 rounded-2xl p-5 mb-6 border border-slate-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Today</p>
              <p className="text-white font-black text-2xl">₹0</p>
            </div>
            <div className="text-slate-600 font-bold text-xl">→</div>
            <div className="text-right">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">After 5 days</p>
              <p className="text-white font-black text-2xl">₹299<span className="text-slate-400 text-sm font-normal">/mo</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs justify-center mt-2 border-t border-slate-800 pt-3">
            <CreditCard className="w-3 h-3" />
            <span>Card details saved securely. Auto-renews monthly.</span>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-3 mb-8 text-left">
          {[
            "Personalised Clinical Diet Protocols",
            "Unlimited AI Meal Analysis",
            "Cinematic Medical Video Library",
            "Metabolic Bio-Twin Advanced Data",
            "Full Workout & Exercise Library",
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleFreeTrial}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5" fill="currentColor" />
              Start 5-Day Free Trial
            </>
          )}
        </button>

        <p className="text-slate-500 text-xs mt-3">No charge today. Cancel before Day 5 to avoid billing.</p>

        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
          <Shield className="w-4 h-4" />
          <span>Secured by Razorpay</span>
        </div>
      </div>
    </div>
  );
}
