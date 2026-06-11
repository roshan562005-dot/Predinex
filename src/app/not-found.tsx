"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { PredinexLogo } from "@/components/PredinexLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans selection:bg-primary-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-panel p-12 rounded-[3rem] border border-white/10 text-center shadow-2xl bg-black/40 backdrop-blur-xl">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <PredinexLogo size="lg" linked={false} />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full -z-10"
              />
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <p className="text-primary-500 font-black tracking-[0.3em] text-sm uppercase flex items-center justify-center gap-2">
              <AlertTriangle size={14} /> Protocol 404
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight italic">
              Health Route <br /> Not Found.
            </h1>
            <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm mx-auto">
              The metabolic path you followed appears to be out of sync. Let's get you back on track.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black transition-all hover:bg-primary-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] shadow-xl"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Return to Dashboard
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center opacity-70">
          <PredinexLogo size="sm" linked={false} />
        </div>
      </motion.div>
    </div>
  );
}
