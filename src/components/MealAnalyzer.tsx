"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Search, Droplets, Flame, Activity, Moon, Clock, 
  CheckCircle, AlertTriangle, ChevronRight, X, Loader2,
  TrendingUp, History, Mic, MicOff, Volume2, Hexagon, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInclusivity } from "@/context/InclusivityContext";

interface AnalysisResult {
  foods: string[];
  totalCarbs: number;
  totalCalories: number;
  avgGI: number;
  spikeRisk: 'low' | 'moderate' | 'high';
  tips: string[];
}

const FOOD_DB: Record<string, { carbs: number, calories: number, gi: number }> = {
  "apple": { carbs: 14, calories: 52, gi: 38 },
  "banana": { carbs: 23, calories: 89, gi: 51 },
  "white bread": { carbs: 49, calories: 265, gi: 75 },
  "brown rice": { carbs: 23, calories: 111, gi: 50 },
  "white rice": { carbs: 28, calories: 130, gi: 72 },
  "oats": { carbs: 12, calories: 68, gi: 55 },
  "chicken breast": { carbs: 0, calories: 165, gi: 0 },
  "egg": { carbs: 1, calories: 155, gi: 0 },
  "dal": { carbs: 20, calories: 116, gi: 25 },
  "chapati": { carbs: 15, calories: 71, gi: 52 },
  "biryani": { carbs: 40, calories: 250, gi: 65 },
  "dosa": { carbs: 25, calories: 160, gi: 60 },
  "idli": { carbs: 15, calories: 60, gi: 70 },
  "poha": { carbs: 30, calories: 180, gi: 65 },
  "upma": { carbs: 25, calories: 150, gi: 65 },
  "salad": { carbs: 5, calories: 20, gi: 15 },
  "pizza": { carbs: 33, calories: 266, gi: 80 },
  "burger": { carbs: 30, calories: 295, gi: 85 },
  "coke": { carbs: 11, calories: 38, gi: 90 },
  "orange juice": { carbs: 10, calories: 45, gi: 65 }
};

function analyzeMeal(input: string): AnalysisResult {
  const words = input.toLowerCase().split(/[ ,]+/);
  let totalCarbs = 0;
  let totalCalories = 0;
  let totalGI = 0;
  let detectedFoods: string[] = [];

  words.forEach(word => {
    Object.keys(FOOD_DB).forEach(food => {
      if (word.includes(food) || food.includes(word)) {
        if (!detectedFoods.includes(food)) {
          detectedFoods.push(food);
          totalCarbs += FOOD_DB[food].carbs;
          totalCalories += FOOD_DB[food].calories;
          totalGI += FOOD_DB[food].gi;
        }
      }
    });
  });

  // Fallback for unknown foods
  if (detectedFoods.length === 0) {
     return {
        foods: ["Unknown ingredients"],
        totalCarbs: 25,
        totalCalories: 350,
        avgGI: 60,
        spikeRisk: 'moderate',
        tips: ["Consider adding fiber like sprouts to reduce the glycemic load."]
     };
  }

  const avgGI = totalGI / detectedFoods.length;
  let spikeRisk: 'low' | 'moderate' | 'high' = 'low';
  if (avgGI > 70 || totalCarbs > 40) spikeRisk = 'high';
  else if (avgGI > 55 || totalCarbs > 20) spikeRisk = 'moderate';

  const tips = [];
  if (spikeRisk === 'high') {
    tips.push("Try walking for 10 minutes right after this meal to blunt the glucose spike.");
    tips.push("Next time, pair this with protein or healthy fats like nuts.");
  } else if (spikeRisk === 'moderate') {
    tips.push("A good meal, but adding more greens could make it even safer.");
  } else {
    tips.push("Excellent choice. This has a stable glycemic profile.");
  }

  return { foods: detectedFoods, totalCarbs, totalCalories, avgGI, spikeRisk, tips };
}

export default function MealAnalyzer() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<{input: string, result: AnalysisResult}[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  const { t, language } = useInclusivity();

  // Speech Recognition Setup
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onsent = () => setIsListening(true);
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      analyze(transcript);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
    synth.speak(utterance);
  };

  useEffect(() => {
     const saved = localStorage.getItem('predinex_meal_history');
     if (saved) {
        try { setHistory(JSON.parse(saved).slice(0, 5)); } catch (e) {}
     }
  }, []);

  const analyze = async (textToAnalyze = input) => {
    if (!textToAnalyze.trim()) return;
    setInput(textToAnalyze);
    setLoading(true);
    // Small artificial delay for UX polish
    await new Promise(r => setTimeout(r, 900));
    
    const newResult = analyzeMeal(textToAnalyze);
    setResult(newResult);
    
    // Auto-speak result for accessibility
    if (newResult.spikeRisk === 'high') {
       speak(language === 'hi' ? 'सावधान, इस खाने से ब्लड शुगर बढ़ सकता है' : language === 'ta' ? 'எச்சரிக்கை, இந்த உணவால் சர்க்கரை அளவு அதிகம் ஆகலாம்' : 'Warning, this meal has high blood sugar risk');
    }

    const newHistory = [{input: textToAnalyze, result: newResult}, ...history.filter(h => h.input !== textToAnalyze)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('predinex_meal_history', JSON.stringify(newHistory));
    
    setLoading(false);
  };

  const riskColors = {
    low: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", icon: CheckCircle },
    moderate: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: AlertTriangle },
    high: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: AlertTriangle },
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full relative overflow-hidden flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-gray-900 to-[#0A0A0A] border border-white/10 hover:border-teal-400/50 rounded-3xl text-left group transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-black/50 border border-white/5">
          <motion.img 
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
             src="/diet_3d.png" alt="Nutrition" className="absolute inset-x-0 inset-y-0 w-[150%] h-[150%] left-[-25%] top-[-25%] object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        <div className="relative z-10">
          <p className="text-white font-black text-lg tracking-tight">{t("meal_analyzer")}</p>
          <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mt-1 flex items-center gap-1"><Sparkles size={12}/> {t("analyze_impact")}</p>
        </div>
      </motion.button>

      {/* Modal View */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setOpen(false); setResult(null); setInput(""); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative z-10 w-full max-w-lg bg-[#0f1219] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg">{t("meal_analyzer")}</h3>
                    <p className="text-gray-400 text-xs font-medium">Glucose impact prediction</p>
                  </div>
                </div>
                <button onClick={() => { setOpen(false); setResult(null); setInput(""); }} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{t("what_did_you_eat")}</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && analyze()}
                      placeholder="e.g. 2 chapatis, dal and rice"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-600 font-medium"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        onClick={handleVoiceInput}
                        className={cn(
                          "p-3 rounded-xl transition-all",
                          isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-gray-400 hover:text-white"
                        )}
                      >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                      <button
                        onClick={() => analyze()}
                        disabled={loading || !input.trim()}
                        className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-black p-3 rounded-xl transition-all shadow-lg shadow-teal-500/20"
                      >
                        {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Search size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* History area */}
                {!result && !loading && history.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Recent Insights</p>
                    <div className="grid gap-3">
                      {history.map((h, i) => (
                        <div key={i} onClick={() => { setInput(h.input); setResult(h.result); }} className="flex justify-between items-center bg-white/5 p-4 rounded-xl cursor-pointer hover:bg-white/10 border border-white/5 transition-all group">
                          <div className="flex items-center gap-3">
                             <div className={cn("w-2 h-2 rounded-full", h.result.spikeRisk === 'high' ? 'bg-red-500' : h.result.spikeRisk === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500')} />
                             <p className="text-sm text-gray-300 font-bold truncate max-w-[180px]">{h.input}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real-time Result Display */}
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto text-teal-500 animate-pulse" size={24} />
                      </div>
                      <p className="text-gray-400 font-bold text-sm tracking-widest animate-pulse uppercase">Analysing Glycemic Impact...</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className={cn("p-6 rounded-3xl border flex items-center justify-between", riskColors[result.spikeRisk].bg, riskColors[result.spikeRisk].border)}>
                        <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-2xl bg-white/10", riskColors[result.spikeRisk].text)}>
                             {(() => { const Icon = riskColors[result.spikeRisk].icon; return <Icon size={24} />; })()}
                          </div>
                          <div>
                            <p className={cn("text-xl font-black uppercase tracking-tighter", riskColors[result.spikeRisk].text)}>{result.spikeRisk} Impact</p>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">{result.foods.join(", ")}</p>
                          </div>
                        </div>
                        <button onClick={() => speak(result.spikeRisk)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all"><Volume2 size={18}/></button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Estimated Carbs</p>
                          <p className="text-2xl font-black text-white">{Math.round(result.totalCarbs)}g</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Energy Value</p>
                          <p className="text-2xl font-black text-white">{Math.round(result.totalCalories)} kcal</p>
                        </div>
                      </div>

                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Metabolic Recommendations</p>
                         <ul className="space-y-3">
                            {result.tips.map((tip, i) => (
                               <li key={i} className="flex gap-3 text-sm font-medium text-gray-300">
                                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                                  {tip}
                               </li>
                            ))}
                         </ul>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
