"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Droplets, Binary, Orbit, Sparkles } from "lucide-react";
import { useInclusivity } from "@/context/InclusivityContext";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

interface MetabolicBioTwinProps {
  score: number;
  habits: any;
}

export default function MetabolicBioTwin({ score, habits }: MetabolicBioTwinProps) {
  const { t } = useInclusivity();
  const [isHovered, setIsHovered] = useState(false);
  const [predictionMode, setPredictionMode] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const completionRate = habits
    ? ((habits.water_ml ? 1 : 0) + (habits.sleep_hours ? 1 : 0) + (habits.sunlight_mins ? 1 : 0)) / 3
    : 0.5;

  // ── Real metabolic metrics computed from actual logged data ──
  // Normalize score assuming it might be out of 100 instead of 10
  const normalizedScore = score > 10 ? score / 10 : score;

  // Insulin Sensitivity: based on blood sugar (ideal < 100 mg/dL fasting)
  const rawInsulin = habits?.blood_sugar
    ? Math.max(10, Math.round(100 - Math.max(0, habits.blood_sugar - 90) * 0.7))
    : Math.round(60 + normalizedScore * 3);
  const insulinScore = Math.min(100, rawInsulin);

  // Glucose Regulation: based on assessment score + blood sugar trend
  const rawGlucose = habits?.blood_sugar
    ? Math.max(10, Math.round(100 - Math.max(0, habits.blood_sugar - 85) * 0.8))
    : Math.round(55 + normalizedScore * 3.5);
  const glucoseScore = Math.min(100, rawGlucose);

  // Energy / Lifestyle Score: sleep + water + sunlight contribution
  const rawEnergy = Math.round(
    ((habits?.sleep_hours ?? 0) / 8) * 40 +
    ((habits?.water_ml ?? 0) / 2500) * 30 +
    ((habits?.sunlight_mins ?? 0) / 20) * 20 +
    normalizedScore * 1
  );
  const energyScore = Math.min(100, rawEnergy);

  // Forecast: what scores could look like if programme is fully adhered to
  const forecastInsulin = Math.min(99, insulinScore + 14);
  const forecastGlucose = Math.min(99, glucoseScore + 18);
  const forecastEnergy  = Math.min(99, energyScore  + 8);

  useEffect(() => {
    async function fetchInsight() {
      setIsGenerating(true);
      try {
        const res = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            insulinScore,
            glucoseScore,
            energyScore,
            sleep: habits?.sleep_hours || 0,
            water: habits?.water_ml || 0
          })
        });
        const data = await res.json();
        setAiInsight(data.insight);
      } catch (e) {
        setAiInsight("AI Engine offline.");
      }
      setIsGenerating(false);
    }
    fetchInsight();
  }, [insulinScore, glucoseScore, energyScore, habits]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-300, 300], [12, -12]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-12, 12]), { stiffness: 100, damping: 30 });

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - (rect.left + rect.width / 2));
    y.set(event.clientY - (rect.top + rect.height / 2));
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <div className="relative w-full h-full min-h-[550px] [perspective:1800px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotateX: 15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full min-h-[550px] holographic-card rounded-[3rem] p-8 flex flex-col items-center gap-5 group overflow-hidden"
      >
        {/* Base backdrop */}
        <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-3xl rounded-[3rem] -z-10" />
        <div className="holographic-glow" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#34d39918_1px,transparent_1px),linear-gradient(to_bottom,#34d39918_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        {/* ── TOP BADGE: Metabolic State ── */}
        <motion.div
          animate={{ x: isHovered ? 6 : 0 }}
          className="relative z-20 self-stretch bg-emerald-500/10 backdrop-blur-2xl border border-emerald-400/30 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-emerald-500/10 [transform:translateZ(60px)]"
        >
          <Binary size={14} className="text-emerald-400 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
            Metabolic State: {score > 8 ? "Stable" : "Calibrating"}
          </span>
        </motion.div>

        {/* ── CENTER: Realistic 3D rotating DNA ── */}
        <div className="relative z-10 flex items-center justify-center w-full flex-1 [transform:translateZ(40px)]">
          {/* Ambient glow behind DNA */}
          <div className="absolute w-52 h-52 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute w-32 h-32 rounded-full bg-teal-400/15 blur-2xl animate-pulse" />

          {/* Outer orbit ring */}
          <motion.div
            className="absolute w-48 h-48 rounded-full border border-emerald-400/15"
            animate={{ rotateZ: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-36 h-36 rounded-full border border-blue-400/10"
            animate={{ rotateZ: [360, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* DNA image with realistic 3D perspective rotation */}
          <div style={{ perspective: "600px" }} className="relative flex items-center justify-center">
            {/* Reflection / ground shadow */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(52,211,153,0.3) 0%, transparent 70%)",
                filter: "blur(6px)",
              }}
            />

            {/* Glow ring layer 1 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)",
                filter: "blur(16px)",
              }}
            />

            {/* Main DNA rotating with Y-axis spin + slight X tilt for depth */}
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{
                transformStyle: "preserve-3d",
                width: 110,
                height: 160,
                rotateX: 8,
              }}
            >
              {/* Primary image */}
              <img
                src="/bio-twin.png"
                alt="DNA Structure"
                style={{
                  width: 110,
                  height: 160,
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 18px rgba(52,211,153,0.7)) drop-shadow(0 0 40px rgba(52,211,153,0.35)) drop-shadow(0 8px 24px rgba(0,0,0,0.6)) brightness(1.15) saturate(1.3)",
                }}
                className="mix-blend-screen"
              />
            </motion.div>

            {/* Scan line effect */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] pointer-events-none"
              style={{
                background: "linear-gradient(to right, transparent, rgba(52,211,153,0.8), transparent)",
                boxShadow: "0 0 12px rgba(52,211,153,0.6)",
              }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* ── BOTTOM CARD: Metabolic Profile ── */}
        <div className="relative z-30 w-full max-w-lg bg-neutral-900/65 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-7 shadow-[0_40px_80px_rgba(0,0,0,0.45)] [transform:translateZ(120px)]">
          <div className="flex items-center justify-between mb-7">
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
                  {predictionMode ? "METABOLIC FORECAST" : "METABOLIC PROFILE"}
                </span>
              </h3>
              <p className="text-emerald-500/60 text-[9px] uppercase tracking-[0.38em] font-black">
                Clinical Diagnostic Stream Active
              </p>
            </div>
            <button
              onClick={() => setPredictionMode(!predictionMode)}
              className={`px-5 py-2.5 rounded-2xl text-[9px] font-black tracking-widest transition-all hover:scale-105 active:scale-95 ${
                predictionMode
                  ? "bg-emerald-500 text-neutral-900 shadow-[0_0_24px_rgba(16,185,129,0.5)]"
                  : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
              }`}
            >
              {predictionMode ? "RESET VIEW" : "FORECAST"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Insulin Sensitivity",  val: predictionMode ? forecastInsulin : insulinScore, icon: <Droplets size={15} />, color: "from-blue-500 to-indigo-600",   accent: "text-blue-400"   },
              { label: "Glucose Stability",  val: predictionMode ? forecastGlucose : glucoseScore, icon: <Activity size={15} />, color: "from-emerald-400 to-teal-600", accent: "text-emerald-400" },
              { label: "Lifestyle Score",   val: predictionMode ? forecastEnergy  : energyScore,  icon: <Binary size={15} />,   color: "from-violet-500 to-purple-600", accent: "text-violet-400"  },
            ].map((metric, i) => {
              const status = metric.val >= 80 ? "Optimal" : metric.val >= 60 ? "Good" : metric.val >= 40 ? "Fair" : "At Risk";
              const statusColor = metric.val >= 80 ? "text-emerald-400" : metric.val >= 60 ? "text-blue-400" : metric.val >= 40 ? "text-amber-400" : "text-rose-400";
              
              return (
              <div
                key={i}
                className="flex flex-col items-center p-3 rounded-[1.75rem] bg-white/5 border border-white/5 relative overflow-hidden group/item text-center justify-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover/item:opacity-8 transition-opacity duration-500`} />
                <div className={`${metric.accent} mb-1.5 group-hover/item:scale-110 transition-transform duration-500`}>
                  {metric.icon}
                </div>
                <span className="text-xl font-black text-white tracking-widest leading-none">{metric.val}%</span>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${statusColor}`}>{status}</span>
                <span className="text-[7.5px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-1 leading-tight">{metric.label}</span>
              </div>
              );
            })}
          </div>

          {/* Reference Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mt-6 pt-5 border-t border-white/5">
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em]">Optimal (80%+)</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em]">Good (60-79%)</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em]">Fair (40-59%)</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em]">At Risk (&lt;40%)</span>
             </div>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="relative z-30 w-full max-w-lg mt-4 bg-emerald-950/40 backdrop-blur-3xl border border-emerald-500/20 rounded-[1.5rem] p-5 shadow-lg [transform:translateZ(100px)]">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Predinex AI Engine</h4>
              {isGenerating ? (
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse mt-1" />
              ) : (
                <p className="text-[11px] font-medium text-emerald-50/90 leading-relaxed">
                  {aiInsight}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Corner diagnostic text */}
        <div className="absolute bottom-5 right-6 opacity-20 pointer-events-none z-10">
          <div className="text-[8px] font-mono text-emerald-400 text-right leading-relaxed">
            PREDNIX v2.0<br />
            ID: 88291-C4
          </div>
        </div>
      </motion.div>
    </div>
  );
}
