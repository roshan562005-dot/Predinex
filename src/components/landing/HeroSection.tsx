"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";
import { useRef } from "react";

const stats = [
  { value: "96%", label: "Accuracy" },
  { value: "10k+", label: "Enrolled Patients" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "30", label: "Days to Improvement" },
];

export function HeroSection() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={scrollRef} className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

      {/* Glow Orbs */}
      <motion.div style={{ y: yBackground }} className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></motion.div>
      <motion.div style={{ y: yBackground }} className="absolute bottom-0 right-1/4 translate-x-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></motion.div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-center mb-8 relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full w-40 h-40 m-auto"></div>
             <div className="relative w-40 h-40 md:w-56 md:h-56">
               <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="w-full h-full relative z-10"
               >
                 <Image 
                    src="/images/predinex_hex_3d.png" 
                    alt="Predinex Health Platform" 
                    fill
                    priority
                    sizes="(max-width: 768px) 160px, 224px"
                    className="object-contain"
                 />
               </motion.div>
             </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-12 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md"
          >
            <Stethoscope size={14} className="animate-pulse" />
            Next-Generation Metabolic Care
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Prevent Diabetes <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Before It Begins.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Predinex is a secure, patient-centred metabolic health tracking platform designed to reverse pre-diabetes through evidence-based lifestyle interventions and personalised clinical guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative">
            <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full w-3/4 mx-auto animate-pulse pointer-events-none"></div>
            <Link
              href="/login"
              className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-[length:200%_auto] text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_40px_rgba(16,185,129,0.5)] w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Begin My Health Journey
              <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm font-semibold mt-8 flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-teal-500" />
            Private & Secure · Your Data Never Leaves Your Device
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
              <div className="text-3xl md:text-5xl font-black text-white tracking-tighter relative z-10">
                 {stat.value}
              </div>
              <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
