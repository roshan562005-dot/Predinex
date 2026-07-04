"use client";

import { motion } from "framer-motion";
import { Activity, Brain, HeartPulse, Dumbbell, BookOpen, Users } from "lucide-react";

const features = [
  {
    icon: Activity,
    color: "from-rose-400 to-red-500",
    glow: "shadow-red-500/40",
    bg: "bg-red-500/10 border-red-500/20",
    textColor: "text-red-400",
    title: "Health Risk Assessment",
    description: "A comprehensive, evidence-based health questionnaire to establish your personalised metabolic risk profile.",
  },
  {
    icon: Dumbbell,
    color: "from-orange-400 to-amber-500",
    glow: "shadow-amber-500/40",
    bg: "bg-amber-500/10 border-amber-500/20",
    textColor: "text-amber-400",
    title: "Personalised Exercise Plans",
    description: "Clinically validated workout protocols tailored to your fitness level and therapeutic goals.",
  },
  {
    icon: HeartPulse,
    color: "from-emerald-400 to-green-500",
    glow: "shadow-emerald-500/40",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    textColor: "text-emerald-400",
    title: "Vital Signs Monitoring",
    description: "Track your fasting glucose, blood pressure, and weight trends with medical-grade data visualisation.",
  },
  {
    icon: Brain,
    color: "from-violet-400 to-purple-500",
    glow: "shadow-purple-500/40",
    bg: "bg-purple-500/10 border-purple-500/20",
    textColor: "text-purple-400",
    title: "Stress & Mindfulness Therapy",
    description: "Evidence-based breathing techniques and mindfulness exercises to reduce cortisol and improve insulin sensitivity.",
  },
  {
    icon: BookOpen,
    color: "from-sky-400 to-blue-500",
    glow: "shadow-blue-500/40",
    bg: "bg-blue-500/10 border-blue-500/20",
    textColor: "text-blue-400",
    title: "Metabolic Health Education",
    description: "Clinician-reviewed educational content on carbohydrate metabolism, glycaemic index, and lifestyle medicine.",
  },
  {
    icon: Users,
    color: "from-pink-400 to-rose-500",
    glow: "shadow-pink-500/40",
    bg: "bg-pink-500/10 border-pink-500/20",
    textColor: "text-pink-400",
    title: "Patient Support Community",
    description: "A moderated, safe space to share recovery milestones and receive peer support from fellow patients.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Advanced Metabolic Health Tracking Tools.
          </h2>
          <p className="text-gray-400 text-lg font-medium mt-4 max-w-2xl mx-auto">
            Every feature is grounded in clinical research to systematically reduce your risk of developing Type 2 Diabetes and improve insulin sensitivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="bg-white/[0.02] rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 group hover:-translate-y-2 backdrop-blur-sm relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full blur-2xl pointer-events-none ${feature.color}`}></div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg ${feature.glow} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
