"use client";

import Link from "next/link";
import { Leaf, ShieldCheck, Mail, Lock, CheckCircle2, Phone, KeyRound, Loader2, Hexagon, RefreshCw } from "lucide-react";
import { PredinexLogo } from "@/components/PredinexLogo";
import { login, loginWithGoogle, sendOTPSms, verifyOTPSms } from "./actions";
import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForms() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  
  // Phone OTP State
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otpError, setOtpError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSendOtp = () => {
    setOtpError("");
    if (!phone) { setOtpError("Please enter a valid phone number with country code (e.g. +1234567890)"); return; }
    startTransition(async () => {
      const res = await sendOTPSms(phone);
      if (res?.error) setOtpError(res.error);
      else setOtpStep(2);
    });
  };

  const handleVerifyOtp = () => {
    setOtpError("");
    if (!token) { setOtpError("Please enter the 6-digit confirmation code"); return; }
    startTransition(async () => {
      const res = await verifyOTPSms(phone, token);
      if (res?.error) setOtpError(res.error);
      // If success, it redirects serverside
    });
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Logo */}
      <div className="mb-10">
        <PredinexLogo size="md" />
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Secure Login
        </h1>
        <p className="text-gray-500 mb-6">
          Log in with email, phone code, or Google to access your health data.
        </p>
        {(errorParam || otpError) && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
            <span>{errorParam || otpError}</span>
          </div>
        )}
      </div>

      <form className="space-y-6" action={login}>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
            <input type="email" id="email" name="email" required className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="john@example.com" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-gray-700" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-sm font-bold text-emerald-600 hover:text-emerald-500">Forgot password?</Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
            <input type="password" id="password" name="password" required className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="••••••••" />
          </div>
        </div>
        <button type="submit" className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_8px_16px_-6px_rgba(16,185,129,0.4)] text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all">
          Sign in with Email
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-3 bg-gray-50 text-gray-500 font-medium">Or continue with</span></div>
        </div>

        <div className="mt-6 flex gap-3">
          <form action={loginWithGoogle} className="w-full">
            <button type="submit" className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors">
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              Google
            </button>
          </form>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500 font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-500">Sign up</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <Suspense fallback={<div className="flex animate-pulse items-center justify-center p-20"><Loader2 className="animate-spin text-emerald-500" /></div>}>
          <LoginForms />
        </Suspense>
      </div>

      <div className="hidden md:flex flex-1 relative bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop" alt="Healthy Food" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800/90 to-emerald-950/80"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-24 w-full text-white">
          <div className="mb-8 p-3 bg-white/10 backdrop-blur-md rounded-2xl inline-block w-max border border-white/20"><ShieldCheck size={32} className="text-emerald-400" /></div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">Prevent insulin resistance with <span className="text-emerald-400">precision</span>.</h2>
          <p className="text-lg text-emerald-100 mb-12 max-w-lg leading-relaxed">Join thousands of users who have successfully managed their pre-diabetes through our expert-guided nutrition and lifestyle program.</p>
          <div className="space-y-4">
            {["Personalized 30-day health plans", "Real-time blood sugar predictive modeling", "Expert-curated recipes and exercise routines"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" size={20} /><span className="font-medium">{feature}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
