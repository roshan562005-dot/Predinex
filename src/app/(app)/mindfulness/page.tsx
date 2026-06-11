/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Brain, Wind, Moon, PlayCircle, X, Volume2, Pause, Play, HeartPulse, Sparkles, CheckCircle2, RefreshCw, Quote, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { upsertHabits, getDailyHabits } from "@/app/(app)/actions";

import { useInclusivity } from "@/context/InclusivityContext";

type BreathingTechnique = {
  name: string;
  description: string;
  phases: { text: string; duration: number; scale: number; gradient: string }[];
  benefit: string;
};

const techniques: Record<string, BreathingTechnique> = {
  box: {
    name: "Box Breathing",
    description: "A clinically proven technique used to calm the autonomic nervous system, reduce cortisol, and improve focus.",
    phases: [
      { text: "Inhale...", duration: 4000, scale: 1.5, gradient: "from-teal-400 to-emerald-400" },
      { text: "Hold...", duration: 4000, scale: 1.5, gradient: "from-emerald-400 to-emerald-400" },
      { text: "Exhale...", duration: 4000, scale: 1, gradient: "from-emerald-400 to-teal-400" },
      { text: "Hold empty...", duration: 4000, scale: 1, gradient: "from-teal-400 to-teal-400" },
    ],
    benefit: "Lowers HR"
  },
  "4-7-8": {
    name: "4-7-8 Relaxation Breath",
    description: "A natural relaxation technique for the nervous system. Highly effective for reducing anxiety and promoting restful sleep.",
    phases: [
      { text: "Inhale (4s)", duration: 4000, scale: 1.4, gradient: "from-indigo-400 to-purple-400" },
      { text: "Hold (7s)", duration: 7000, scale: 1.4, gradient: "from-purple-400 to-purple-400" },
      { text: "Exhale (8s)", duration: 8000, scale: 1,  gradient: "from-purple-400 to-indigo-400" },
    ],
    benefit: "Deep Anxiety Relief"
  },
  calm: {
    name: "Calm Focus",
    description: "Balanced, rhythmic breathing to maintain present-moment awareness and support cognitive clarity during daily activities.",
    phases: [
      { text: "Inhale...", duration: 5000, scale: 1.3, gradient: "from-cyan-400 to-blue-400" },
      { text: "Exhale...", duration: 5000, scale: 1, gradient: "from-blue-400 to-cyan-400" },
    ],
    benefit: "Mental Clarity"
  }
};

const affirmations = [
  "I am in control of my blood sugar and my health.",
  "Every breath I take brings peace to my body.",
  "I nourish my body with healthy choices and calm thoughts.",
  "My stress levels are decreasing, and my energy is balancing.",
  "I am resilient, balanced, and focused on my well-being.",
  "I choose calm over worry, and health over habit.",
];

export default function MindfulnessPage() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [activeBreathingType, setActiveBreathingType] = useState<string>("box");
  const [breathingPhase, setBreathingPhase] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMins, setCurrentMins] = useState(0);
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [isPending, startTransition] = useTransition();
  const audioRef = useRef<HTMLAudioElement>(null);

  const { t } = useInclusivity();

  useEffect(() => {
    async function loadHabits() {
      const habits = await getDailyHabits();
      if (habits) setCurrentMins(habits.mindfulness_mins || 0);
    }
    loadHabits();
    setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    console.log("FORCE_HMR_Buster_3D_Cards_Live");
  }, []);

  const logSession = (mins: number) => {
    const next = currentMins + mins;
    setCurrentMins(next);
    startTransition(() => {
      upsertHabits({ mindfulness_mins: next });
    });
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Advanced Breathing Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (activeExercise === "breathing" && isPlaying) {
      const currentTechnique = techniques[activeBreathingType];
      const phaseData = currentTechnique.phases[breathingPhase];
      
      timeout = setTimeout(() => {
        setBreathingPhase((prev) => (prev + 1) % currentTechnique.phases.length);
      }, phaseData.duration);
    }
    return () => clearTimeout(timeout);
  }, [activeExercise, isPlaying, breathingPhase, activeBreathingType]);

  const currentPhaseData = techniques[activeBreathingType].phases[breathingPhase];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 md:pb-12 relative min-h-screen">
      
      {/* Dynamic Ambient Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-20 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-10"
        >
          <span className="text-teal-600 dark:text-teal-400 font-extrabold text-sm uppercase tracking-[0.25em] mb-3 block">{t("mindfulness_core")}</span>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 tracking-tighter mb-4">
            {t("inner_peace")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
            {t("control_stress_desc")}
          </p>
        </motion.div>

        {/* Hero Section - Visual */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="group relative rounded-[3rem] overflow-hidden shadow-2xl dark:shadow-none border border-black/5 dark:border-white/10 cursor-default mb-12 min-h-[450px] h-auto flex flex-col justify-end"
        >
          <img 
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2000&auto=format&fit=crop" 
            alt="Zen Landscape" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30 dark:from-black dark:via-gray-900/80"></div>
          
          <div className="relative z-10 p-6 pt-32 md:p-14 flex flex-col justify-end text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tighter drop-shadow-lg text-balance">
              {t("build_muscle")}<br />{t("control_health")}
            </h2>
            <p className="text-gray-300 text-base md:text-xl mb-8 font-medium leading-relaxed opacity-90 max-w-2xl drop-shadow-sm">
              Research consistently demonstrates that just 5 minutes of focused parasympathetic breathing can lower your acute blood sugar response by up to 15%.
            </p>
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
              <button 
                onClick={() => { setActiveExercise("breathing"); setActiveBreathingType("box"); }}
                className="bg-white text-gray-900 px-6 py-4 md:px-8 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] hover:-translate-y-1 active:scale-95"
              >
                <Wind size={22} className="text-teal-500 group-hover:text-white transition-colors" /> {t("quick_reset")}
              </button>
              <div className="flex items-center justify-center gap-3 px-6 py-4 md:px-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold shadow-xl">
                <Sparkles size={20} className="text-teal-300" /> {currentMins} {t("mins_logged")}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Quote Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center gap-6 shadow-xl shadow-gray-200/50 dark:shadow-none mb-12 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 dark:from-teal-500/10 to-transparent"></div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner border border-white/50 dark:border-white/5 shrink-0 relative z-10 group-hover:scale-105 transition-transform duration-500">
            <Quote size={28} fill="currentColor" opacity={0.3} />
          </div>
          <div className="flex-1 relative z-10">
            <h4 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-2">Daily Affirmation</h4>
            <p className="text-xl md:text-2xl font-bold italic tracking-tight text-gray-800 dark:text-gray-200 leading-snug">
              &quot;{currentAffirmation}&quot;
            </p>
          </div>
          <button 
            onClick={() => setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-200 dark:hover:border-teal-500/30 transition-all shadow-sm active:scale-90 relative z-10 shrink-0"
          >
            <RefreshCw size={22} />
          </button>
        </motion.div>

        {/* Feature Grid - Ultra Premium 3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 w-full max-w-7xl mx-auto">
          
          {/* Breathing Card - 3D Orb */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            onClick={() => { setActiveExercise("breathing"); setActiveBreathingType("box"); }}
            className="group relative cursor-pointer h-[500px] rounded-[2.5rem] bg-gray-950 border border-white/5 hover:border-teal-500/30 overflow-hidden shadow-2xl shadow-black/40 hover:shadow-teal-500/10 transition-all duration-700 flex flex-col hover:-translate-y-2"
          >
            {/* 3D Graphic Header */}
            <div className="relative h-[240px] w-full overflow-hidden">
               <img src="/orb.png" alt="3D Breathwork Orb" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10"></div>
               <div className="absolute top-6 left-6 z-20 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-teal-300 border border-white/10 shadow-lg group-hover:bg-teal-500 group-hover:text-white transition-all">
                 <Wind size={24} />
               </div>
            </div>
            
            {/* Card Content body */}
            <div className="relative z-20 flex flex-col flex-1 p-8 pt-2">
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Therapeutic Breathwork</h3>
              <p className="text-gray-400 mb-6 font-medium leading-relaxed">
                Evidence-based breathing patterns to balance your autonomic nervous system and reduce stress hormones.
              </p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-teal-400">
                  <HeartPulse size={18} /> {t("hr_optimization")}
                </div>
                <div className="bg-white/5 p-4 rounded-xl font-black text-xs text-gray-500 uppercase tracking-[0.2em] border border-white/5 group-hover:bg-white/10 group-hover:text-white transition-colors duration-500 text-center shadow-inner">
                  Try: Box, 4-7-8, Calm
                </div>
              </div>
            </div>
          </motion.div>

          {/* Meditation Card - 3D Neural */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            onClick={() => setActiveExercise("meditation")}
            className="group relative cursor-pointer h-[500px] rounded-[2.5rem] bg-gray-950 border border-white/5 hover:border-indigo-500/30 overflow-hidden shadow-2xl shadow-black/40 hover:shadow-indigo-500/10 transition-all duration-700 flex flex-col hover:-translate-y-2"
          >
            {/* 3D Graphic Header */}
            <div className="relative h-[240px] w-full overflow-hidden">
               <img src="/neural.png" alt="3D Neural Network" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10"></div>
               <div className="absolute top-6 left-6 z-20 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-indigo-300 border border-white/10 shadow-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
                 <Brain size={24} />
               </div>
            </div>
            
            <div className="relative z-20 flex flex-col flex-1 p-8 pt-2">
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Guided Meditation</h3>
              <p className="text-gray-400 mb-6 font-medium leading-relaxed">
                A clinician-recommended 5-minute mindfulness practice to reduce mental stress and support glycaemic control.
              </p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-indigo-400">
                   <Sparkles size={18} /> {t("cognitive_enhancement")}
                </div>
                <div className="bg-white/5 p-4 rounded-xl font-black text-xs text-gray-500 uppercase tracking-[0.2em] border border-white/5 group-hover:bg-white/10 group-hover:text-white transition-colors duration-500 text-center shadow-inner">
                  5 min · Calming Audio
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sleep Card - 3D Moon */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            onClick={() => setActiveExercise("sleep")}
            className="group relative cursor-pointer h-[500px] rounded-[2.5rem] bg-gray-950 border border-white/5 hover:border-purple-500/30 overflow-hidden shadow-2xl shadow-black/40 hover:shadow-purple-500/10 transition-all duration-700 flex flex-col hover:-translate-y-2"
          >
            {/* 3D Graphic Header */}
            <div className="relative h-[240px] w-full overflow-hidden">
               <img src="/moon.png" alt="3D Glass Moon" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10"></div>
               <div className="absolute top-6 left-6 z-20 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-purple-300 border border-white/10 shadow-lg group-hover:bg-purple-500 group-hover:text-white transition-all">
                 <Moon size={24} />
               </div>
            </div>

            <div className="relative z-20 flex flex-col flex-1 p-8 pt-2">
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">{t("sleep_scscape")}</h3>
              <p className="text-gray-400 mb-6 font-medium leading-relaxed">
                Soothing soundscapes designed to promote restorative sleep and support healthy overnight glucose regulation.
              </p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-purple-400">
                   <Activity size={18} /> {t("rem_enhancement")}
                </div>
                <div className="bg-white/5 p-4 rounded-xl font-black text-xs text-gray-500 uppercase tracking-[0.2em] border border-white/5 group-hover:bg-white/10 group-hover:text-white transition-colors duration-500 text-center shadow-inner">
                  15 min · Relaxation Audio
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full Screen Premium Modal */}
      <AnimatePresence>
        {activeExercise && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => { setActiveExercise(null); setIsPlaying(false); setBreathingPhase(0); }}
              className="absolute inset-0 bg-gray-950/80 backdrop-blur-3xl cursor-pointer"
            />
            
            <motion.div
              layoutId="modal"
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className={`w-full h-full md:h-auto md:max-w-4xl md:rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10 border border-white/10 flex flex-col items-center justify-center p-8 md:p-16 text-center ${
                activeExercise === "breathing" 
                  ? "bg-gradient-to-br from-gray-950 via-teal-950/40 to-gray-950" 
                  : activeExercise === "meditation"
                  ? "bg-gradient-to-br from-gray-950 via-indigo-950/40 to-gray-950"
                  : "bg-gradient-to-br from-gray-950 via-purple-950/40 to-gray-950"
              }`}
            >
              {/* Dynamic Abstract Modal Backgrounds */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isPlaying ? 'opacity-30' : 'opacity-10'} transition-opacity duration-1000`}
                 />
              </div>

              <button
                onClick={() => { setActiveExercise(null); setIsPlaying(false); setBreathingPhase(0); }}
                className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-14 h-14 bg-white/5 hover:bg-white/10 backdrop-blur-3xl rounded-full text-white/50 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/20 hover:scale-110 active:scale-95"
              >
                <X size={28} />
              </button>

              {activeExercise === "breathing" && (
                <div className="flex flex-col items-center justify-center w-full relative z-10">
                  <div className="mb-12">
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase drop-shadow-md">
                      {techniques[activeBreathingType].name}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.keys(techniques).map(type => (
                        <button
                          key={type}
                          onClick={() => { setActiveBreathingType(type); setBreathingPhase(0); setIsPlaying(false); }}
                          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                            activeBreathingType === type 
                              ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-gray-900 shadow-[0_0_20px_rgba(45,212,191,0.4)]" 
                              : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative w-80 h-80 md:w-96 md:h-96 mb-16 flex items-center justify-center">
                    {/* Pulsing Aura */}
                    <motion.div 
                      animate={{ scale: isPlaying ? [1, 1.4, 1] : 1, opacity: isPlaying ? [0.2, 0.5, 0.2] : 0.1 }}
                      transition={{ duration: isPlaying ? currentPhaseData.duration / 1000 * 2 : 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full blur-[80px] bg-gradient-to-tr ${currentPhaseData.gradient}`}
                    />
                    
                    {/* Outer SVG Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
                      <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                      <motion.circle 
                        cx="50%" cy="50%" r="45%" fill="transparent" stroke="url(#gradientRing)" strokeWidth="8" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isPlaying ? 1 : 0 }}
                        transition={{ duration: currentPhaseData.duration / 1000, ease: "linear", repeat: isPlaying ? Infinity : 0 }}
                      />
                      <defs>
                        <linearGradient id="gradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2dd4bf" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* The Breathing Orb */}
                    <motion.div
                      animate={{ 
                        scale: isPlaying ? currentPhaseData.scale : 1,
                      }}
                      transition={{ duration: currentPhaseData.duration / 1000, ease: "easeInOut" }}
                      className={`w-48 h-48 md:w-56 md:h-56 rounded-full border border-white/20 flex items-center justify-center absolute z-20 backdrop-blur-xl shadow-[inset_0_0_50px_rgba(255,255,255,0.1)] transition-colors duration-1000 ${
                        isPlaying ? `bg-gradient-to-tr ${currentPhaseData.gradient} opacity-90` : "bg-white/5 opacity-80"
                      }`}
                    >
                      <div className={`text-4xl font-black tracking-tighter uppercase drop-shadow-2xl transition-colors duration-500 ${isPlaying ? 'text-gray-900' : 'text-white'}`}>
                        {isPlaying ? currentPhaseData.text : "START"}
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-center gap-8">
                     <button 
                       onClick={() => setIsPlaying(!isPlaying)}
                       className="group bg-white hover:bg-gray-100 text-gray-900 w-24 h-24 rounded-full font-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-110 active:scale-95"
                     >
                       {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
                     </button>

                     <p className="text-gray-400 max-w-md text-lg font-medium leading-relaxed">
                       {techniques[activeBreathingType].description}
                     </p>

                     {!isPlaying && (
                       <button 
                         onClick={() => { logSession(2); setActiveExercise(null); }}
                         className="mt-4 bg-white/5 hover:bg-white/10 text-teal-400 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border border-white/10 hover:border-teal-400/50 transition-all flex items-center gap-3 drop-shadow-md"
                       >
                         <CheckCircle2 size={18} /> {t("mark_completed")}
                       </button>
                     )}
                  </div>
                </div>
              )}

              {(activeExercise === "meditation" || activeExercise === "sleep") && (
                <div className="flex flex-col items-center justify-center w-full relative z-10">
                  {/* Majestic Audio Icon */}
                  <div className="relative mb-12 group">
                     <motion.div 
                       animate={{ scale: isPlaying ? [1, 1.2, 1] : 1, opacity: isPlaying ? [0.5, 0.8, 0.5] : 0 }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className={`absolute inset-0 rounded-full blur-[60px] ${activeExercise === "meditation" ? "bg-indigo-500" : "bg-purple-500"}`}
                     />
                     <div className={`w-36 h-36 bg-white/5 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl relative z-10 ${isPlaying ? "border-white/40" : ""}`}>
                       <Volume2 size={56} className={`${activeExercise === "meditation" ? "text-indigo-300" : "text-purple-300"} drop-shadow-lg`} />
                     </div>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase drop-shadow-md">
                    {activeExercise === "meditation" ? "Guided Meditation Session" : "Sleep & Relaxation Protocol"}
                  </h3>
                  
                  <p className="text-gray-400 mb-16 max-w-lg mx-auto font-medium text-lg leading-relaxed">
                    A clinically recommended mindfulness session. Best experienced in a quiet environment with headphones for maximum benefit.
                  </p>
                  
                  <audio 
                    ref={audioRef}
                    src={activeExercise === "meditation" 
                      ? "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
                      : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                    } 
                    loop 
                  />
                  
                  <div className="w-full max-w-xl mb-16 px-4">
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-6 border border-white/5">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: isPlaying ? "100%" : "0%" }}
                        transition={{ duration: activeExercise === "meditation" ? 300 : 900, ease: "linear" }}
                        className={`h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] ${
                          activeExercise === "meditation" ? "bg-indigo-400" : "bg-purple-400"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                      <span>Audio Session</span>
                      <span className="text-white">{activeExercise === "meditation" ? "05:00" : "15:00"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-8">
                     <button 
                       onClick={toggleAudio}
                       className={`w-24 h-24 rounded-full font-black flex items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-110 active:scale-95 text-white ${
                         activeExercise === "meditation" 
                           ? "bg-gradient-to-br from-indigo-500 to-indigo-700 hover:shadow-indigo-500/50" 
                           : "bg-gradient-to-br from-purple-500 to-purple-700 hover:shadow-purple-500/50"
                       }`}
                     >
                       {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
                     </button>

                     {!isPlaying && (
                       <button 
                         onClick={() => { logSession(activeExercise === "meditation" ? 5 : 15); setActiveExercise(null); }}
                         className="mt-6 bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border border-white/10 hover:border-white/30 transition-all flex items-center gap-3 drop-shadow-md"
                       >
                         <CheckCircle2 size={18} className="text-teal-400" /> {t("mark_completed")}
                       </button>
                     )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
