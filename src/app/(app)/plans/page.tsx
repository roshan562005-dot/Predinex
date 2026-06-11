"use client";

import React, { useState, useTransition, useEffect } from "react";
import { UtensilsCrossed, Clock, Flame, Calendar, CheckCircle2, ChevronRight, Sparkles, Activity, Droplets, Moon, Sun, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { upsertHabits, getDailyHabits, getLatestAssessment } from "@/app/(app)/actions";
import { dietData, Recipe } from "./dietData";
import MealAnalyzer from "@/components/MealAnalyzer";

import { useInclusivity } from "@/context/InclusivityContext";

export default function PlansPage() {
  const { t } = useInclusivity();
  const [waterMl, setWaterMl] = useState(0);
  const [sleepDone, setSleepDone] = useState(false);
  const [sunDone, setSunDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [selectedDay, setSelectedDay] = useState(1); // Start on day 1
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dietPreference, setDietPreference] = useState<'omnivore' | 'vegetarian'>('omnivore');
  const currentPlan = dietData[selectedDay - 1] || dietData[0];

  useEffect(() => {
    async function loadData() {
      try {
        const [habits] = await Promise.all([
          getDailyHabits(),
          getLatestAssessment()
        ]);
        if (habits) {
          setWaterMl(habits.water_ml || 0);
          setSleepDone(!!(habits.sleep_hours && habits.sleep_hours > 0));
          setSunDone(!!(habits.sunlight_mins && habits.sunlight_mins > 0));
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleWater = (delta: number) => {
    const next = Math.min(Math.max(0, waterMl + delta), 3000);
    setWaterMl(next);
    startTransition(() => { upsertHabits({ water_ml: next }); });
  };

  const handleSleep = () => {
    const next = !sleepDone;
    setSleepDone(next);
    startTransition(() => { upsertHabits({ sleep_hours: next ? 7.5 : 0 }); });
  };

  const handleSun = () => {
    const next = !sunDone;
    setSunDone(next);
    startTransition(() => { upsertHabits({ sunlight_mins: next ? 20 : 0 }); });
  };

  const FADE_UP = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
  const FALLBACK_IMG = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&fit=crop";

  const quotes = [
    "\"Let food be thy medicine, and medicine be thy food.\" — Hippocrates",
    "\"Take care of your body. It's the only place you have to live.\" — Jim Rohn",
    "\"Every time you eat is an opportunity to nourish your body.\" — Unknown"
  ];
  const selectedQuote = quotes[selectedDay % quotes.length];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 md:pb-8 relative">
      {/* Background Orbs for Premium Dark Mode glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Premium 3D Hero Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="group relative w-full min-h-[400px] h-auto rounded-[3rem] overflow-hidden shadow-2xl dark:shadow-none border border-black/5 dark:border-white/10 cursor-default mb-12 flex flex-col justify-end p-8 md:p-14"
      >
        <img 
          src="/diet_3d_v3.png" 
          alt="3D Botanical Nutrition" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/30 dark:from-black dark:via-gray-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/50 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end text-white">
          <div className="flex items-center gap-2 mb-6 mt-16 md:mt-0">
             <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
               <Sparkles size={14} /> CLINICAL NUTRITION
             </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tighter drop-shadow-lg">
            Metabolic Fuel.<br />Precision Healing.
          </h2>
          <p className="text-gray-300 text-base md:text-xl mb-8 font-medium leading-relaxed opacity-90 max-w-2xl drop-shadow-sm">
            Personalised meal plans clinically designed to stabilise blood glucose, reduce insulin resistance, and support healthy weight management through evidence-based nutrition.
          </p>
          
          {/* Quote Block Overlay */}
          <div className="border-l-4 border-emerald-500 pl-6 py-3 bg-white/5 backdrop-blur-xl border-y border-r border-white/10 rounded-r-2xl max-w-2xl shadow-2xl">
            <p className="italic text-gray-200 font-medium text-sm md:text-lg drop-shadow-md">
              {selectedQuote}
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Nutrition Meal Analyzer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-violet-500" size={20} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nutrition Meal Analyser</h2>
        </div>
        <MealAnalyzer />
      </motion.div>

      {/* 30-Day Schedule Selector */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel p-6 rounded-3xl relative z-10 border border-gray-200/50 dark:border-white/5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <UtensilsCrossed className="text-emerald-500" size={32} strokeWidth={2.5} /> {t("diet_protocol") || "Daily Nutrition Protocol"}
          </h1>
          <p className="text-gray-500 font-medium mt-2">{t("personalized_for_you") || "Personalized for your metabolic goals."}</p>
          </div>
          <div className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 px-4 py-2 rounded-xl backdrop-blur-md shadow-sm">
             Week {Math.ceil(selectedDay / 7)} • Day {selectedDay}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2" role="tablist">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isSelected = day === selectedDay;
            const isPast = day < 1; // Resets the fake completion checkmarks
            const isRest = day % 7 === 0;
            
            return (
              <motion.div 
                whileHover={{ scale: 1.05, rotateY: 10, perspective: 1000 }}
                whileTap={{ scale: 0.95 }}
                key={day}
                onClick={() => setSelectedDay(day)}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                className={`min-w-[70px] flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-colors cursor-pointer focus:outline-none shadow-sm
                  ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/20' : 
                    isPast ? 'border-primary-100 dark:border-primary-900 bg-gray-50 dark:bg-gray-800/50' : 
                    'border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 hover:border-primary-200 dark:hover:border-primary-800'}`}
              >
                <span className={`text-[10px] font-bold mb-1 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>DAY {day}</span>
                {isPast && !isSelected ? (
                  <CheckCircle2 size={20} className="text-primary-500 dark:text-primary-400" />
                ) : isRest ? (
                  <div className={`w-7 h-7 rounded-full ${isSelected ? 'bg-primary-100 dark:bg-primary-500/30' : 'bg-blue-50 dark:bg-blue-500/10'} flex items-center justify-center`}>
                    <span className={`${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-blue-500 dark:text-blue-400'} text-[8px] font-bold`}>REST</span>
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 
                    ${isSelected ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-900' : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'}`}>
                    <span className="font-bold text-xs">{day}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Today's Diet Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <UtensilsCrossed className="text-primary-500" /> {selectedDay === 3 ? "Today's Clinical Menu" : `Day ${selectedDay} Menu`}
          </h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Diet Toggle - Glassmorphism */}
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200/50 dark:border-white/10 backdrop-blur-md">
              <button 
                onClick={() => setDietPreference('omnivore')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${dietPreference === 'omnivore' ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {t("omnivore") || "Omnivore"}
              </button>
              <button 
                onClick={() => setDietPreference('vegetarian')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${dietPreference === 'vegetarian' ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {t("vegetarian") || "Vegetarian"}
              </button>
            </div>
            
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1.5 rounded-full whitespace-nowrap hidden sm:block shadow-sm">
              {currentPlan.meals[dietPreference].reduce((sum, m) => sum + m.calories, 0)} kcal Total
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {currentPlan.meals[dietPreference].map((meal, idx) => (
              <motion.div
                key={meal.name + idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#11141d] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
              >
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; e.currentTarget.onerror = null; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-60 dark:opacity-80" />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase text-gray-900 dark:text-white shadow-sm border border-white/20">
                    {meal.type}
                  </div>
                </div>
                <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                    {meal.name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Flame size={14} className="text-orange-500" /> {meal.calories} kcal
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-blue-500" /> {meal.time}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 flex-1">
                    {meal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold tracking-wide uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRecipe(meal)}
                    className="w-full py-3 border border-primary-200 dark:border-primary-500/30 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-500/20 rounded-xl font-bold transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    View Clinical Recipe <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Today's Lifestyle Habits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-12 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="text-emerald-500" size={24} /> Daily Habits
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Hydration */}
          <div className="glass-panel p-5 rounded-2xl border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm transition-all relative overflow-hidden group hover:scale-[1.05] hover:rotate-1">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Droplets size={20} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Hydration</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Goal: 2,500ml. Tap +/- to log.</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((waterMl / 2500) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">{(waterMl / 1000).toFixed(1)} / 2.5L</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleWater(-250)} className="flex-1 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 text-sm bg-white dark:bg-[#11141d]">
                  <Minus size={14} /> 250ml
                </button>
                <button onClick={() => handleWater(250)} className="flex-1 py-1.5 border border-blue-200 dark:border-blue-800/50 rounded-xl font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-1 text-sm bg-white dark:bg-[#11141d]">
                  <Plus size={14} /> 250ml
                </button>
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div
            onClick={handleSleep}
            role="switch"
            aria-checked={sleepDone}
            tabIndex={0}
            className={`glass-panel p-5 rounded-2xl border shadow-sm transition-all cursor-pointer relative overflow-hidden group focus:outline-none ${sleepDone ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${sleepDone ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'}`}>
                    <Moon size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{t("sleep_schedule") || "Sleep Schedule"}</h3>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${sleepDone ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {sleepDone && <CheckCircle2 size={14} />}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 mt-4">{t("sleep_desc") || "Tap to log optimal 7.5 hours of sleep for metabolic recovery."}</p>
              <div className="flex items-center justify-between text-sm mt-5">
                <span className="font-medium text-gray-600 dark:text-gray-400">{t("status") || "Status"}</span>
                <span className={`font-bold ${sleepDone ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>{sleepDone ? (t("logged") || 'Logged ✓') : (t("pending") || 'Pending')}</span>
              </div>
            </div>
          </div>

          {/* Sunlight */}
          <div
            onClick={handleSun}
            role="switch"
            aria-checked={sunDone}
            tabIndex={0}
            className={`glass-panel p-5 rounded-2xl border shadow-sm transition-all cursor-pointer relative overflow-hidden group focus:outline-none ${sunDone ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/20' : 'border-amber-100 dark:border-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700'}`}
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${sunDone ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                    <Sun size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{t("morning_light") || "Morning Light"}</h3>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${sunDone ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {sunDone && <CheckCircle2 size={14} />}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 mt-4">{t("light_desc") || "Tap to log 20 mins of morning sunlight to set circadian rhythm."}</p>
              <div className="flex items-center justify-between text-sm mt-5">
                <span className="font-medium text-gray-600 dark:text-gray-400">{t("status") || "Status"}</span>
                <span className={`font-bold ${sunDone ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'}`}>{sunDone ? (t("complete") || 'Complete ✓') : (t("pending") || 'Pending')}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>


      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" 
            onClick={() => setSelectedRecipe(null)}
          >
            <div className="absolute inset-0 bg-gray-900/80 dark:bg-black/80 backdrop-blur-md"></div>
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#0c0f16] border border-gray-200/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 hide-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 right-0 p-4 flex justify-end z-20 pointer-events-none">
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="pointer-events-auto bg-white/20 dark:bg-black/20 backdrop-blur-xl p-2.5 rounded-full text-white hover:bg-white/40 dark:hover:bg-white/20 transition-all border border-white/20 shadow-xl"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
              </div>
              
              <div className="h-72 sm:h-96 w-full relative -mt-20">
                <img 
                  src={selectedRecipe?.image} 
                  className="w-full h-full object-cover" 
                  alt={selectedRecipe?.name} 
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMG; e.currentTarget.onerror = null; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-[#0c0f16] dark:via-[#0c0f16]/40 dark:to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 text-gray-900 dark:text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                      {selectedRecipe?.type}
                    </span>
                    {selectedRecipe?.tags.map(tag => (
                      <span key={tag} className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 text-gray-800 dark:text-gray-200 text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 leading-tight text-balance shadow-black/5">{selectedRecipe?.name}</h2>
                  <div className="flex items-center gap-5 text-gray-700 dark:text-gray-300 text-sm font-bold bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 px-4 py-2 rounded-xl inline-flex">
                    <span className="flex items-center gap-2"><Flame size={16} className="text-orange-500" /> {selectedRecipe?.calories} kcal</span>
                    <span className="w-px h-4 bg-gray-300 dark:bg-white/20"></span>
                    <span className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /> {selectedRecipe?.time}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                {selectedRecipe?.benefit && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 p-6 rounded-3xl relative overflow-hidden mb-10 shadow-sm"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/40 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-400 tracking-tight mb-3 flex items-center gap-2 relative z-10">
                      <Sparkles size={20} className="text-emerald-500" /> Clinical Insight
                    </h3>
                    <p className="text-emerald-800 dark:text-emerald-200 text-sm md:text-base font-medium leading-relaxed relative z-10 text-pretty">
                      {selectedRecipe.benefit}
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-gray-100 dark:border-white/10 pb-4">
                      <UtensilsCrossed size={20} className="text-primary-500" /> Ingredients
                    </h3>
                    <ul className="space-y-3.5">
                      {selectedRecipe?.ingredients?.map((ing, i) => (
                        <li key={i} className="flex gap-3 text-gray-600 dark:text-gray-300 font-medium text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary-100 dark:bg-primary-500/30 border border-primary-500 mt-1.5 shrink-0"></div>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-3 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-gray-100 dark:border-white/10 pb-4">
                      <Activity size={20} className="text-primary-500" /> Instructions
                    </h3>
                    <div className="space-y-6 pt-2">
                      {selectedRecipe?.instructions?.map((inst, i) => (
                        <div key={i} className="flex gap-5 group">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold text-sm flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all shadow-sm">
                              {i + 1}
                            </div>
                            {i < (selectedRecipe?.instructions?.length || 0) - 1 && (
                              <div className="w-px h-full bg-gray-100 dark:bg-white/5 group-hover:bg-primary-200 dark:group-hover:bg-primary-500/50 transition-colors mt-3"></div>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium pb-4 leading-relaxed text-sm pt-1.5">{inst}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
