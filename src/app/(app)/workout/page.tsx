"use client";

import React, { useState, useEffect } from "react";
import { Dumbbell, Clock, Flame, Activity, ChevronRight, PlayCircle, Pause, Play, Volume2, VolumeX, CheckCircle2, Sparkles, Target, Zap, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { workoutLevels, WorkoutLevel, WorkoutDay, Exercise, workoutCategories, WorkoutCategory } from "./workoutData";

const FITNESS_QUOTES = [
  "\"Push yourself — no one else will do it for you.\" — Unknown",
  "\"The body achieves what the mind believes.\" — Napoleon Hill",
  "\"Fitness is not about being better than someone else. It's about being better than you used to be.\" — Khloe Kardashian",
  "\"Every workout is a step away from pre-diabetes and a step toward a longer, healthier life.\" — Clinical Goal",
  "\"Take care of your body. It's the only place you have to live.\" — Jim Rohn"
];

import { useInclusivity } from "@/context/InclusivityContext";

export default function WorkoutPage() {
  const { t } = useInclusivity();
  const [activeLevel, setActiveLevel] = useState<WorkoutLevel | null>(null);
  const [activeDay, setActiveDay] = useState<WorkoutDay | null>(null);
  const [activeCategory, setActiveCategory] = useState<WorkoutCategory | null>(null);
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});
  
  // Player state
  const [workoutState, setWorkoutState] = useState<'ready' | 'active' | 'rest'>('ready');
  const [activeExerciseIdx, setActiveExerciseIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('predinex_workout_progress');
    if (saved) setCompletedDays(JSON.parse(saved));
  }, []);

  const markDayComplete = (levelId: string, dayNum: number) => {
    const newProgress = { ...completedDays };
    if (!newProgress[levelId]) newProgress[levelId] = [];
    if (!newProgress[levelId].includes(dayNum)) {
      newProgress[levelId].push(dayNum);
      setCompletedDays(newProgress);
      localStorage.setItem('predinex_workout_progress', JSON.stringify(newProgress));
    }
  };

  // Audio Context Ref
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const playTone = (frequency: number, type: OscillatorType, duration: number, volumeLevel: number = 0.1) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volumeLevel, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const speakInstruction = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startExercise = (durationStr?: string) => {
    let t = 30; // default 30s
    if (durationStr) {
      if (durationStr.includes('sec')) t = parseInt(durationStr);
      else if (durationStr.includes('min')) t = Math.round(parseFloat(durationStr) * 60);
      else t = parseInt(durationStr); 
    }
    setWorkoutState('active');
    setTimeLeft(t || 30);
  };

  const activeQuote = FITNESS_QUOTES[Math.floor(Date.now() / 86400000 % FITNESS_QUOTES.length)];

  // Timer logic for workout player
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const currentSession = activeDay || activeCategory;

    if (activeExerciseIdx !== null && !isPaused && timeLeft > 0 && currentSession) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next > 0 && next <= 3 && !isMuted) {
             playTone(600, 'sine', 0.2, 0.15);
             if (next === 3 && workoutState === 'active') speakInstruction("Three");
             if (next === 2 && workoutState === 'active') speakInstruction("Two");
             if (next === 1 && workoutState === 'active') speakInstruction("One");
          }
          if (next === 0 && !isMuted) playTone(800, 'square', 0.5, 0.2);
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0 && workoutState === 'active' && currentSession) {
      setWorkoutState('rest');
      setTimeLeft(15);
      const nextEx = activeExerciseIdx !== null && activeExerciseIdx < currentSession.exercises.length - 1 
        ? currentSession.exercises[activeExerciseIdx + 1] : null;
      if (nextEx) speakInstruction(`Rest for 15 seconds. Next up: ${nextEx.name}.`);
      else speakInstruction(`Workout complete! Great job!`);
    } else if (timeLeft === 0 && workoutState === 'rest' && currentSession) {
      if (activeExerciseIdx !== null && activeExerciseIdx < currentSession.exercises.length - 1) {
        const nextIdx = activeExerciseIdx + 1;
        setActiveExerciseIdx(nextIdx);
        setWorkoutState('ready');
        const nextEx = currentSession.exercises[nextIdx];
        speakInstruction(`Get ready for ${nextEx.name}. ${nextEx.instruction || 'Follow the animation.'}`);
      } else {
        if (activeLevel && activeDay) markDayComplete(activeLevel.id, activeDay.day);
        setActiveExerciseIdx(null);
        setWorkoutState('ready');
        if (!isMuted) playTone(400, 'sine', 1, 0.2);
      }
    }
    return () => clearInterval(interval);
  }, [activeExerciseIdx, isPaused, timeLeft, workoutState, activeDay, activeCategory, activeLevel, isMuted]);

  // Framer Motion Variants
  const FADE_UP = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
  const STAGGER = { animate: { transition: { staggerChildren: 0.1 } } };
  const ITEM = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  // Main Home View (Workout Hub)
  if (!activeLevel && !activeCategory) {
    return (
       <div className="max-w-5xl mx-auto space-y-12 pb-20 md:pb-8 relative">
        {/* Deep ambient background glows for Premium Glassmorphism */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-96 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Premium 3D Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group relative w-full min-h-[400px] h-auto rounded-[3rem] overflow-hidden shadow-2xl dark:shadow-none border border-black/5 dark:border-white/10 cursor-default mb-8 flex flex-col justify-end p-8 md:p-14"
      >
        {/* 3D Background */}
        <img 
          src="/workout_3d.png" 
          alt="3D Plasma Core" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/30 dark:from-black dark:via-gray-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/50 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full">
          <div className="max-w-2xl">
             <div className="bg-orange-500/20 backdrop-blur-md border border-orange-400/30 text-orange-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg inline-flex items-center gap-2 mb-6 mt-16 md:mt-0">
                <Zap size={14} /> {t("kinetic_track")}
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-md leading-tight">
               {t("build_muscle")}
             </h1>
             <p className="text-gray-300 md:text-xl font-medium leading-relaxed opacity-90 drop-shadow-sm line-clamp-2 md:line-clamp-none">
               Hyper-targeted resistance and mobility protocols clinically designed to drastically improve insulin sensitivity and boost metabolic energy.
             </p>
             
             <div className="border-l-4 border-orange-500 pl-6 py-3 bg-white/5 backdrop-blur-xl border-y border-r border-white/10 rounded-r-2xl max-w-sm mt-8 shadow-2xl hidden md:block">
               <p className="italic text-gray-200 font-medium text-sm drop-shadow-md">
                 {activeQuote}
               </p>
             </div>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0 flex items-center mb-2">
            <div className="relative inline-flex items-center justify-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.15)]">
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("total_progress")}</p>
                <p className="font-black text-2xl leading-none mt-1">
                  {Object.values(completedDays).reduce((acc, curr) => acc + curr.length, 0)} {t("days")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

        {/* Targeted Sessions Section */}
        <motion.section variants={STAGGER} initial="initial" animate="animate" className="relative z-10">
          <div className="flex items-center gap-2 mb-6 ml-2">
            <Zap className="text-orange-500" size={24} />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Targeted Sessions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workoutCategories.map((cat, idx) => {
              const IconComp = { Activity, Dumbbell, Target, Zap }[cat.icon] || Activity;
              return (
                <motion.div 
                  variants={ITEM}
                  whileHover={{ rotateY: 10, rotateX: -10, scale: 1.05, perspective: 1000 }}
                  whileTap={{ scale: 0.98 }}
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  className={`bg-gradient-to-br ${cat.color} p-6 rounded-[2rem] text-white cursor-pointer transition-all shadow-xl dark:shadow-black/40 group relative overflow-hidden flex flex-col justify-between min-h-[160px]`}
                >
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                  <div className="bg-white/20 dark:bg-black/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                     <IconComp size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl leading-tight mb-1 drop-shadow-sm">{cat.name}</h3>
                    <p className="text-white/80 dark:text-white/70 text-xs font-bold leading-relaxed">{cat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* 30-Day Challenges Section */}
        <motion.section variants={STAGGER} initial="initial" animate="animate" className="relative z-10">
          <div className="flex items-center gap-2 mb-6 ml-2">
            <Sparkles className="text-teal-500" size={24} />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">30-Day Protocols</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workoutLevels.map((lvl) => (
              <motion.div 
                variants={ITEM}
                whileHover={{ rotateY: 5, rotateX: 2, scale: 1.02, perspective: 1000 }}
                whileTap={{ scale: 0.98 }}
                key={lvl.id}
                onClick={() => setActiveLevel(lvl)}
                className="relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl dark:shadow-black/50 transition-all duration-300 border border-gray-100 dark:border-white/10 bg-white dark:bg-black"
                style={{ aspectRatio: '3/4' }}
              >
                 <img src={lvl.coverImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={lvl.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 dark:opacity-90"></div>
                 <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                   <div className="flex justify-center mb-3 text-center w-full">
                     <span className="bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                       {lvl.subtitle}
                     </span>
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tight mb-2 drop-shadow-lg text-balance">{lvl.title}</h2>
                   <div className="flex items-center justify-center gap-3 text-teal-300 dark:text-teal-400 font-bold text-sm bg-black/20 backdrop-blur-sm mx-auto px-4 py-2 rounded-xl inline-flex w-auto border border-white/10">
                     <div className="flex items-center gap-1.5"><Clock size={16} /> 30 DAYS</div>
                     <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
                     <div className="flex items-center gap-1.5"><Activity size={16} /> {completedDays[lvl.id]?.length || 0}/30</div>
                   </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    );
  }

  // Category Detail View
  if (activeCategory && activeExerciseIdx === null) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/60 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-[#0c0f16] shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col relative w-full max-w-xl max-h-[90vh] border border-gray-200/50 dark:border-white/10"
        >
          <div className={`h-48 sm:h-56 bg-gradient-to-br ${activeCategory.color} relative p-6 sm:p-8 flex flex-col justify-end shrink-0`}>
            <button 
              onClick={() => setActiveCategory(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20"
            >
              <ChevronRight className="rotate-180" size={24} />
            </button>
            <div className="text-white relative z-10 w-4/5">
              <h2 className="text-3xl sm:text-4xl font-black uppercase leading-tight mb-1 drop-shadow-md">{activeCategory.name}</h2>
              <p className="text-white/90 text-sm font-bold tracking-widest uppercase bg-black/20 inline-block px-3 py-1 rounded-lg backdrop-blur-md">{activeCategory.exercises.length} Specialized Exercises</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 pt-4 hide-scrollbar">
            <div className="space-y-4">
              {activeCategory.exercises.map((ex, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer group"
                     onClick={() => { setActiveExerciseIdx(idx); setWorkoutState('ready'); speakInstruction(`Starting ${ex.name}`); }}>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 shrink-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-1 relative border border-gray-200 dark:border-gray-700">
                      <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-tight text-lg leading-tight mb-1">{ex.name}</h4>
                      <div className="inline-block bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                        {ex.reps}
                      </div>
                    </div>
                  </div>
                  {ex.benefit && (
                    <div className="mt-1 flex gap-2 items-start bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                      <HeartPulse size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">{ex.benefit}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white dark:bg-[#0c0f16] border-t border-gray-100 dark:border-white/10 shrink-0">
            <button 
              onClick={() => { setActiveExerciseIdx(0); setWorkoutState('ready'); }}
              className={`w-full py-4 bg-gradient-to-r ${activeCategory.color} text-white rounded-2xl font-black tracking-widest text-lg uppercase transition-all shadow-xl hover:scale-[1.02] focus:outline-none`}
            >
              {t("start_session")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Level Details (30-Day Grid)
  if (activeLevel && !activeDay && activeExerciseIdx === null) {
    const levelDone = completedDays[activeLevel.id] || [];
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10 relative">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200/50 dark:border-white/10 z-10 bg-black">
           <img src={activeLevel.coverImage} className="w-full h-full object-cover opacity-80 dark:opacity-70" />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent"></div>
           <div className="absolute top-6 right-6 z-20">
             <button onClick={() => setActiveLevel(null)} className="w-12 h-12 rounded-full bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg border border-white/20">
               <ChevronRight className="rotate-180" size={28} />
             </button>
           </div>
           <div className="absolute bottom-8 left-8 text-white text-left max-w-2xl pr-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teal-500 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-teal-500/30">
                  {activeLevel.subtitle}
                </span>
              </div>
             <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight drop-shadow-lg leading-tight mb-4">{activeLevel.title}</h1>
             <div className="flex items-center gap-4 text-teal-300 dark:text-teal-400 font-bold text-sm bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 inline-flex">
                <span className="flex items-center gap-1.5"><Clock size={16} /> 30 DAYS</span>
                <span className="w-px h-4 bg-white/20"></span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> {levelDone.length}/30 COMPLETED</span>
             </div>
           </div>
        </div>

        <div className="bg-white/60 dark:bg-[#11141d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-6 sm:p-8 relative z-10 shadow-xl">
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2">
            <CalendarIcon /> Your Clinical Schedule
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
            {activeLevel.days.map((d) => {
              const isDone = levelDone.includes(d.day);
              return (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={d.day}
                  onClick={() => setActiveDay(d)}
                  className={`aspect-square sm:aspect-auto sm:h-28 rounded-2xl sm:rounded-[1.5rem] border-2 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                    ${d.isRestDay ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500' : 
                      isDone ? 'bg-teal-50/80 dark:bg-teal-900/20 border-teal-400 dark:border-teal-500 text-teal-600 dark:text-teal-400' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 hover:border-teal-300 dark:hover:border-teal-700 shadow-sm text-gray-900 dark:text-white'}
                  `}
                >
                  <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-tighter mb-0.5 ${isDone ? 'text-teal-600/80 dark:text-teal-400/80' : 'text-gray-400 dark:text-gray-500'}`}>Day</span>
                  <span className="text-2xl sm:text-3xl font-black">{d.day}</span>
                  {isDone && (
                    <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-teal-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-black shadow-md z-10">
                        <CheckCircle2 size={12} />
                    </div>
                  )}
                  {d.isRestDay && (
                    <span className="text-[8px] sm:text-[9px] bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md mt-1 font-black uppercase tracking-wider">REST</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Exercise List View
  if ((activeDay || activeCategory) && activeExerciseIdx === null) {
    const list = activeDay ? activeDay.exercises : activeCategory!.exercises;
    const title = activeDay ? `Day ${activeDay.day}` : activeCategory!.name;
    const isRest = activeDay?.isRestDay;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/60 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-[#0c0f16] shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col relative w-full max-w-xl max-h-[90vh] border border-gray-200/50 dark:border-white/10"
        >
          <div className="sticky top-0 right-0 p-5 flex justify-between items-center z-20 bg-white/80 dark:bg-[#0c0f16]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setActiveDay(null);
                  setActiveCategory(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 p-2.5 rounded-full text-gray-800 dark:text-white transition-all focus:outline-none"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white px-2">{title}</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4 hide-scrollbar">
            {isRest ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 mb-6 border border-blue-100 dark:border-blue-800">
                  <Dumbbell size={48} className="opacity-50" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Rest Day</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium px-4 max-w-xs leading-relaxed">Let your metabolic systems recover and build insulin-sensitive muscle tissue. You've earned it!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Motivational Quote for the Session */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-900/50 mb-4">
                  <p className="italic text-teal-800 dark:text-teal-200 font-medium text-sm text-center leading-relaxed">
                    "{FITNESS_QUOTES[ activeDay ? activeDay.day % FITNESS_QUOTES.length : 0].split('\"')[1]}"
                  </p>
                </div>

                {list.map((ex, idx) => (
                  <div key={idx} className="flex flex-col gap-3 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer group"
                       onClick={() => {
                         setActiveExerciseIdx(idx);
                         setWorkoutState('ready');
                         speakInstruction(`Starting ${ex.name}. ${ex.instruction || ''}`);
                       }}>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 shrink-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm flex items-center justify-center border border-gray-200 dark:border-gray-700 relative">
                         <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                         <div className="absolute top-0 left-0 bg-white dark:bg-gray-800 w-full pt-1.5 pb-1 flex justify-center border-b border-gray-100 dark:border-gray-700/50">
                           <span className="font-black text-[8px] tracking-[0.2em] text-teal-600 dark:text-teal-400">PREDINEX</span>
                         </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-lg text-gray-900 dark:text-white uppercase tracking-tight mb-1">{ex.name}</h4>
                        <div className="text-teal-700 dark:text-teal-400 text-sm font-black bg-teal-100 dark:bg-teal-500/20 inline-block px-2.5 py-0.5 rounded-lg uppercase tracking-widest">
                           {ex.reps}
                        </div>
                      </div>
                    </div>
                    {/* Pre-Diabetes Clinical Insight */}
                    {ex.benefit && (
                      <div className="flex gap-2 items-start bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20 mt-1">
                        <HeartPulse size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">{t("clinical_insight")}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isRest && (
            <div className="p-4 sm:p-6 bg-white dark:bg-[#0c0f16] border-t border-gray-100 dark:border-white/10 shrink-0">
              <button 
                onClick={() => {
                    setActiveExerciseIdx(0);
                    setWorkoutState('ready');
                    const firstEx = list[0];
                    if (firstEx) {
                      speakInstruction(`Starting workout. First up: ${firstEx.name}. ${firstEx.instruction || ''}`);
                    }
                }}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl font-black tracking-widest text-lg uppercase transition-all shadow-[0_10px_30px_rgba(20,184,166,0.3)] hover:scale-[1.02] focus:outline-none"
              >
                {t("start_session")}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Active Workout Player (Full Screen Experience)
  if ((activeDay || activeCategory) && activeExerciseIdx !== null) {
      const activeEx = activeDay ? activeDay.exercises[activeExerciseIdx] : activeCategory!.exercises[activeExerciseIdx];
      const listLength = activeDay ? activeDay.exercises.length : activeCategory!.exercises.length;
      const nextExName = activeDay 
          ? (activeExerciseIdx < activeDay.exercises.length - 1 ? activeDay.exercises[activeExerciseIdx + 1].name : "Great Job!")
          : (activeExerciseIdx < activeCategory!.exercises.length - 1 ? activeCategory!.exercises[activeExerciseIdx + 1].name : "Great Job!");

      return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden animate-fade-in text-white">
          <div className="absolute top-0 left-0 right-0 p-6 sm:p-8 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <div className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
                Exercise {activeExerciseIdx + 1} / {listLength}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{workoutState === 'rest' ? 'Rest Time' : activeEx?.name}</h2>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white backdrop-blur-md transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button 
                onClick={() => {
                  setActiveExerciseIdx(null);
                  setWorkoutState('ready');
                }}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white backdrop-blur-md transition-colors"
                aria-label="Close workout"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>
            </div>
          </div>

          <div className="absolute inset-0 bg-[#0a0a14] z-0" />

          <div className="relative z-10 flex flex-col h-full pt-28">

            {/* === TOP HALF: Exercise GIF & Clinical Benefit === */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-2 min-h-0 relative">
              {workoutState === 'rest' ? (
                <div className="flex flex-col items-center justify-center text-center gap-3">
                  <h2 className="text-5xl font-black text-white uppercase tracking-widest drop-shadow-2xl">Rest</h2>
                  <p className="text-teal-300 text-lg font-bold max-w-xs bg-teal-900/30 px-4 py-2 rounded-xl backdrop-blur-md">
                     Next: {nextExName}
                  </p>
                  <div className="text-8xl tabular-nums font-black text-teal-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.5)] animate-pulse mt-4">
                    00:{timeLeft.toString().padStart(2, '0')}
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-md h-[40vh] sm:h-[50vh] flex flex-col items-center">
                  <div className="relative flex-1 w-full bg-white dark:bg-[#e4e4e9] rounded-[2rem] p-0 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden border border-white/10">
                    <div className="relative h-full inline-block">
                      <img 
                        src={activeEx?.image} 
                        alt={activeEx?.name}
                        className={`h-full w-auto object-contain transition-all duration-500 rounded-3xl ${workoutState === 'ready' || isPaused ? 'opacity-40 blur-[4px]' : 'opacity-100'}`}
                      />
                      {/* Premium Watermark Overlay precisely at top-0 left-0 to mask external watermarks */}
                      <div className="absolute top-0 left-0 w-48 h-12 bg-white dark:bg-[#e4e4e9] rounded-br-[1.5rem] shadow-sm z-10 flex items-center justify-center border-b border-r border-gray-200">
                        <span className="font-black text-gray-900 text-sm tracking-[0.2em]">PREDINEX <span className="text-teal-600">PRO</span></span>
                      </div>
                    </div>
                    
                    {/* The specific motivational quote for this session overlay */}
                    {(workoutState === 'ready' || isPaused) && (
                       <div className="absolute inset-x-8 text-center top-1/2 -translate-y-1/2 flex flex-col gap-4">
                         <h3 className="text-3xl font-black text-white drop-shadow-lg uppercase">{workoutState === 'ready' ? 'Get Set' : 'Paused'}</h3>
                         <p className="text-teal-300 font-bold bg-black/60 backdrop-blur-md p-4 rounded-xl text-sm leading-relaxed border border-teal-500/20 italic shadow-xl">
                           {FITNESS_QUOTES[activeExerciseIdx % FITNESS_QUOTES.length]}
                         </p>
                       </div>
                    )}
                  </div>

                  {/* Pre-Diabetes Clinical Insight Banner beneath Video */}
                  {activeEx?.benefit && workoutState === 'active' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-4 bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 p-4 rounded-2xl flex gap-3 items-start relative z-20">
                      <HeartPulse className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                      <p className="text-sm font-medium text-emerald-100 leading-relaxed text-left w-full">
                        <span className="font-bold text-emerald-400 block mb-0.5 text-xs uppercase tracking-widest">{t("clinical_insight")}</span>
                        {activeEx.benefit}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* === BOTTOM HALF: Timer + Controls === */}
            <div className="flex flex-col items-center pb-10 pt-2 px-4 shrink-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent">
              {workoutState === 'ready' && (
                <div className="flex flex-col items-center gap-6 py-6 border-t border-white/10 w-full pt-8 mt-2">
                  <button 
                    onClick={() => startExercise(activeEx.duration || activeEx.reps)}
                    className="bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-[2rem] w-full max-w-sm py-5 flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.3)] hover:scale-105 transition-transform"
                  >
                    <span className="font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                       <PlayCircle size={32} /> Start Session
                    </span>
                  </button>
                </div>
              )}

              {workoutState === 'active' && (
                <div className="w-full flex justify-between items-center max-w-sm border-t border-white/10 pt-6">
                  {/* Premium Luminous Circular Timer */}
                  <div className="relative w-32 h-32 flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" viewBox="0 0 128 128">
                       <circle cx="64" cy="64" r="54" strokeWidth="8" stroke="rgba(255,255,255,0.05)" fill="none" />
                       <circle cx="64" cy="64" r="54" strokeWidth="8" stroke="url(#grad2)" fill="none"
                         strokeDasharray={2 * Math.PI * 54}
                         strokeDashoffset={2 * Math.PI * 54 * (1 - timeLeft / (parseInt(activeEx.duration || '30') || 30))}
                         className="transition-all duration-1000 linear" strokeLinecap="round" />
                       <defs>
                         <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                           <stop offset="0%" stopColor="#2dd4bf" />
                           <stop offset="100%" stopColor="#3b82f6" />
                         </linearGradient>
                       </defs>
                    </svg>
                    <div className="z-10 text-center flex flex-col items-center mt-1">
                      <div className="text-4xl font-black tabular-nums text-white drop-shadow-md">{timeLeft}</div>
                      <div className="text-[10px] text-teal-400 font-black uppercase tracking-widest mt-1">SEC</div>
                    </div>
                  </div>
                  
                  <div className="text-center w-full px-4">
                    <div className="text-teal-400 font-bold text-xs tracking-widest uppercase mb-1">TARGET</div>
                    <div className="text-white font-black tracking-widest uppercase text-3xl">{activeEx.reps}</div>
                  </div>
                </div>
              )}

              {/* Nav Controls */}
              <div className="flex items-center gap-6 w-full max-w-xs justify-center mt-6">
                <button 
                  onClick={() => { const prev = Math.max(0, activeExerciseIdx - 1); setActiveExerciseIdx(prev); setWorkoutState('ready'); }}
                  disabled={activeExerciseIdx === 0}
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                
                {workoutState === 'active' && (
                  <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-white flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all hover:scale-105 border-4 border-black"
                  >
                    {isPaused ? <Play size={32} className="ml-1" /> : <Pause size={32} />}
                  </button>
                )}
                {workoutState === 'rest' && (
                  <button 
                     onClick={() => setTimeLeft(0)}
                     className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-black tracking-widest uppercase transition-all shadow-xl"
                  >
                    Skip Rest
                  </button>
                )}

                <button 
                  onClick={() => {
                    const listLen = activeDay ? activeDay.exercises.length : activeCategory!.exercises.length;
                    if (activeExerciseIdx < listLen - 1) {
                      setActiveExerciseIdx(activeExerciseIdx + 1);
                      setWorkoutState('ready');
                    } else {
                      if (activeLevel && activeDay) markDayComplete(activeLevel.id, activeDay.day);
                      setActiveExerciseIdx(null);
                      setWorkoutState('ready');
                    }
                  }}
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors text-white"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
  }

  return null;
}

// Custom Calendar Icon
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
      <path d="M8 14h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 18h.01"/>
      <path d="M12 18h.01"/>
      <path d="M16 18h.01"/>
    </svg>
);
