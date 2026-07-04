"use client";

import { motion } from "framer-motion";

export function CarePathway() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#0A0A0A] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Your Care Pathway
          </h2>
          <p className="text-gray-400 font-medium max-w-xl mx-auto text-lg">
            A structured 4-step clinical programme to assess, monitor, and improve your metabolic health.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 hidden md:block -translate-y-1/2"></div>
          {[
            { step: "01", title: "Health Assessment", desc: "Complete an evidence-based risk questionnaire to establish your baseline metabolic health profile." },
            { step: "02", title: "Daily Health Logging", desc: "Record daily vitals including fasting glucose, steps, weight, and sleep duration in your secure health diary." },
            { step: "03", title: "Clinical Insights", desc: "Receive personalised health insights based on your recorded data and established clinical guidelines." },
            { step: "04", title: "Lifestyle Interventions", desc: "Follow tailored daily recommendations — diet, exercise, sleep, and stress management — to prevent disease progression." },
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              key={i} 
              className="bg-black/80 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden hover:border-emerald-500/30 transition-colors group"
            >
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
               <div className="text-emerald-500 font-black text-5xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity tracking-tighter drop-shadow-lg">{item.step}</div>
               <h3 className="text-xl font-bold text-white mb-3 tracking-tight relative z-10">{item.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
