"use client";

import { useState } from "react";
import { Lock, CheckCircle2, Zap, Shield, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function PaywallOverlay() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // 1. Load Razorpay Script
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 2. Create Order on our server
      const response = await fetch("/api/razorpay/order", { method: "POST" });
      const data = await response.json();

      if (!data.order) {
        throw new Error("Server failed to create order");
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: data.key_id, 
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Predinex Clinical",
        description: "1 Month Premium Clinical Access",
        image: "/logo.png",
        order_id: data.order.id,
        handler: async function (response: any) {
          // 4. Verify payment signature on our server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // Payment success! Refresh the page to remove the paywall
            router.refresh();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#10b981", // Emerald green
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
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
        
        {/* Header Icon */}
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-emerald-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Unlock Predinex Pro
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Get unlimited access to Clinical Diet Plans, the AI Meal Analyzer, and advanced Video Lectures.
        </p>

        {/* Pricing Box */}
        <div className="bg-slate-950 rounded-2xl p-6 mb-6 border border-slate-800/50">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-xl text-slate-500 line-through font-semibold">₹1,499</span>
            <span className="text-emerald-400 font-bold text-sm bg-emerald-400/10 px-2 py-1 rounded-md">
              80% OFF LAUNCH
            </span>
          </div>
          <div className="flex items-end justify-center gap-1">
            <span className="text-5xl font-black text-white">₹299</span>
            <span className="text-slate-400 pb-1 font-medium">/ month</span>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-3 mb-8 text-left">
          {[
            "Personalised Clinical Diet Protocols",
            "Unlimited AI Meal Analysis",
            "Cinematic Medical Video Library",
            "Metabolic Bio-Twin Advanced Data"
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5" fill="currentColor" />
              Unlock Premium Access
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <Shield className="w-4 h-4" />
          <span>Secured by Razorpay</span>
        </div>
      </div>
    </div>
  );
}
