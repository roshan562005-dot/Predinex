"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Binary, Check, ChevronRight } from "lucide-react";

export function TelemetryShowcase() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Binary size={12} className="animate-pulse" />
              Live Telemetry AI
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
              The World's First <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Metabolic BioTwin.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Connect your wearable devices to the Predinex AI engine. Our proprietary <strong>Zero Error Protocol</strong> monitors your Heart Rate Variability, Glucose Variance, and Cortisol proxies in real-time. 
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Predicts metabolic shock before it happens",
                "AES-256 E2E encrypted data streams",
                "Personalized AI health forecasts"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 font-medium text-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <Check size={12} className="text-emerald-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/telemetry" className="inline-flex items-center gap-2 text-teal-400 font-bold hover:text-teal-300 transition-colors group">
              Explore Telemetry Dashboard <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Visual representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-teal-500/20 blur-[100px] rounded-full"></div>
            <div className="relative bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden aspect-square flex flex-col justify-between max-h-[500px]">
               <div className="absolute top-0 right-0 p-8 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Stream Live</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                  </span>
               </div>
               
               <div className="flex-1 flex items-center justify-center relative">
                  <div className="absolute inset-0 border border-teal-500/10 rounded-full w-48 h-48 m-auto animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-0 border border-blue-500/10 rounded-full w-32 h-32 m-auto animate-[spin_15s_linear_infinite_reverse]"></div>
                  <Activity className="text-teal-400 w-16 h-16 animate-pulse drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
               </div>

               <div className="bg-black/50 backdrop-blur-md rounded-2xl p-5 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">HRV Index</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-500/10 px-2 py-1 rounded">Optimal</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-3xl font-black text-white tracking-tighter">62.2<span className="text-sm font-bold text-gray-500 ml-1">ms</span></span>
                     <div className="h-6 w-16 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-teal-500/20 rounded border border-teal-500/30 opacity-70"></div>
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
