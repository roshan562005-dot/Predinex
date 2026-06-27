"use client";

import Link from "next/link";
import { ShieldCheck, Mail, Lock, CheckCircle2, Loader2, HeartPulse, Activity } from "lucide-react";
import { PredinexLogo } from "@/components/PredinexLogo";
import { loginWithGoogle, sendOTPSms, verifyOTPSms } from "./actions";
import { useState, useTransition, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

function EmailSubmitButton({ pending }: { pending: boolean }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="submit" 
      disabled={pending} 
      className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-[0_8px_30px_-6px_rgba(16,185,129,0.3)] text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in with Email"}
    </motion.button>
  );
}

function GoogleSubmitButton({ onClick }: { onClick: () => void }) {
  const [isClicking, setIsClicking] = useState(false);
  
  const handleClick = () => {
    setIsClicking(true);
    onClick();
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.01, backgroundColor: "rgba(249, 250, 251, 1)" }}
      whileTap={{ scale: 0.98 }}
      type="button" 
      onClick={handleClick} 
      disabled={isClicking} 
      className="w-full flex justify-center items-center py-4 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-sm font-black text-gray-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
    >
      {isClicking ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <>
          <img className="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
          Continue with Google
        </>
      )}
    </motion.button>
  );
}

function LoginForms() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  
  const [otpError, setOtpError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        
        if (res?.error) {
          setOtpError("Incorrect email or password. Please try again gently.");
        } else if (res?.ok) {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        setOtpError("Our servers are taking a brief moment. Please try again.");
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-md w-full mx-auto"
    >
      {/* Logo */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-10 flex justify-center"
      >
        <PredinexLogo size="lg" />
      </motion.div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
          Welcome Back
        </h1>
        <p className="text-gray-500 font-medium">
          Enter your details to access your personalized metabolic health dashboard.
        </p>
      </div>

      <AnimatePresence>
        {(errorParam || otpError) && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 flex items-center gap-3">
              <Activity className="h-5 w-5 shrink-0" />
              <span>{errorParam === "Configuration" ? "We are fine-tuning our servers. Please try again in a moment." : (errorParam || otpError)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="space-y-5" onSubmit={handleEmailLogin}>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 pl-1" htmlFor="email">Email address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-gray-400"><Mail className="h-5 w-5" /></div>
            <input type="email" id="email" name="email" required className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 text-gray-900 font-medium focus:bg-white focus:ring-0 focus:border-emerald-500 transition-all shadow-sm outline-none" placeholder="john@example.com" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2 pl-1 pr-1">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs font-black text-emerald-600 hover:text-emerald-500 transition-colors">Forgot?</Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-gray-400"><Lock className="h-5 w-5" /></div>
            <input type="password" id="password" name="password" required className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 text-gray-900 font-medium focus:bg-white focus:ring-0 focus:border-emerald-500 transition-all shadow-sm outline-none" placeholder="••••••••" />
          </div>
        </div>
        <div className="pt-2">
          <EmailSubmitButton pending={isPending} />
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest">Or</span></div>
        </div>

        <div className="mt-8 flex gap-3">
          <GoogleSubmitButton onClick={() => signIn("google", { callbackUrl: "/dashboard" })} />
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500 font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-black text-emerald-600 hover:text-emerald-500 transition-colors">Create one now</Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative z-10 bg-white shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
        <Suspense fallback={<div className="flex animate-pulse items-center justify-center p-20"><Loader2 className="animate-spin text-emerald-500" /></div>}>
          <LoginForms />
        </Suspense>
      </div>

      <div className="hidden md:flex flex-1 relative bg-emerald-900 overflow-hidden items-center justify-center">
        {mounted && (
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop" alt="Healthy Food" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-teal-900/90 to-emerald-950/95"></div>
          </motion.div>
        )}
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-24 w-full text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-3xl inline-block w-max border border-white/10 shadow-2xl">
              <HeartPulse size={40} className="text-emerald-400" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
              Prevent Diabetes <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Before It Begins.</span>
            </h2>
            <p className="text-lg text-emerald-50/80 mb-12 max-w-lg leading-relaxed font-medium">
              Join thousands of users who have successfully managed their pre-diabetes through our expert-guided clinical nutrition and lifestyle programs.
            </p>
            <div className="space-y-5">
              {[
                "Personalized 30-day clinical health plans", 
                "Real-time blood sugar predictive modeling", 
                "Expert-curated precision nutrition"
              ].map((feature, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (i * 0.1), duration: 0.5 }}
                  key={i} 
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                >
                  <div className="bg-emerald-500/20 p-2 rounded-xl">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                  </div>
                  <span className="font-bold tracking-wide">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
    </div>
  );
}
