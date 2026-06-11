"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Award, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function FounderSection() {
  return (
    <section id="founder" className="relative py-24 lg:py-32 overflow-hidden bg-[#020817]">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="container relative mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Image & Decorative Frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* The Outer Frame / Glow */}
            <div className="relative aspect-[4/5] rounded-[2.5rem] p-2 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-3xl shadow-[0_0_80px_rgba(16,185,129,0.15)] border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-gray-900">
                <img 
                  src="/founder_4k_natural.png" 
                  alt="A. Roshan — Founder, Predinex"
                  className="w-full h-full object-cover object-top transition-all duration-700 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/founder_pro.png";
                  }}
                />
                
                {/* Overlay Gradient for Text Readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-80" />
                
                {/* Floating Badge on Image */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 border-2 border-[#020817] flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">10+ Years</p>
                      <p className="text-gray-300 text-xs">Medical Innovation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Dots Pattern */}
            <div className="absolute -top-12 -left-12 w-32 h-32 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)", backgroundSize: "16px 16px" }} />
          </motion.div>

          {/* Right Column: Content & Vision */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest w-fit mb-6">
              <Award className="w-4 h-4" />
              Founder & Visionary
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
              A New Era of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Precision Health.
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 font-light leading-relaxed">
              "Our mission isn't just to treat symptoms, but to decode the body's hidden signals. By combining advanced predictive algorithms with metabolic science, we are empowering individuals to rewrite their health destiny before disease even begins."
            </p>
            
            <div className="mb-10 space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Pioneering Research</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Led groundbreaking studies in predictive metabolic modeling, recognized globally by top medical boards.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Global Impact</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Successfully implemented early-warning healthcare frameworks impacting thousands of lives.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-white mb-1">A. Roshan</h4>
                <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase">Chief Executive & Founder</p>
              </div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" 
                alt="Signature" 
                className="h-12 opacity-40 invert brightness-0"
              />
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
