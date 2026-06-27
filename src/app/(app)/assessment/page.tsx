"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Activity, CheckCircle2, ShieldAlert, Sparkles, Loader2, BrainCircuit, HeartPulse, AlertTriangle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveAssessment } from "@/app/(app)/actions";
import { useInclusivity } from "@/context/InclusivityContext";

// Quiz Questions
const questions = [
  {
    id: 1,
    text: "How old are you?",
    description: "Age is a primary factor in metabolic changes.",
    icon: <Activity className="w-6 h-6 text-blue-500" />,
    options: [
      { text: "Under 40", score: 0 },
      { text: "40-49", score: 1 },
      { text: "50-59", score: 2 },
      { text: "60 or older", score: 3 },
    ],
  },
  {
    id: 2,
    text: "Do you have a family history of diabetes?",
    description: "Genetics play a crucial role in insulin resistance.",
    icon: <BrainCircuit className="w-6 h-6 text-purple-500" />,
    options: [
      { text: "No", score: 0 },
      { text: "Yes, grandparent or extended family", score: 1 },
      { text: "Yes, parent or sibling", score: 2 },
    ],
  },
  {
    id: 3,
    text: "How often do you engage in physical activity?",
    description: "At least 30 minutes of moderate exercise.",
    icon: <HeartPulse className="w-6 h-6 text-red-500" />,
    options: [
      { text: "Rarely/Never", score: 3 },
      { text: "1-2 days a week", score: 2 },
      { text: "3-4 days a week", score: 1 },
      { text: "5+ days a week", score: 0 },
    ],
  },
  {
    id: 4,
    text: "How would you describe your current weight?",
    description: "Body mass index strongly correlates with risk.",
    icon: <Activity className="w-6 h-6 text-teal-500" />,
    options: [
      { text: "Underweight", score: 0 },
      { text: "Normal weight", score: 0 },
      { text: "Slightly overweight", score: 1 },
      { text: "Significantly overweight", score: 3 },
    ],
  },
  {
    id: 5,
    text: "Ever diagnosed with high blood pressure?",
    description: "Hypertension often co-occurs with metabolic syndrome.",
    icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
    options: [
      { text: "No", score: 0 },
      { text: "Yes", score: 1 },
    ],
  },
];

export default function AssessmentPage() {
  const { t } = useInclusivity();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { score: number, index: number }>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Handle choice selection
  const handleSelect = (questionId: number, score: number, index: number) => {
    setAnswers({ ...answers, [questionId]: { score, index } });

    // Auto-advance
    setTimeout(async () => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Quiz finished - save to DB
        const finalAnswers = { ...answers, [questionId]: { score, index } };
        const totalScore = Object.values(finalAnswers).reduce((sum, ans) => sum + ans.score, 0);
        const riskLevel = getRiskLevel(totalScore).level;
        
        // Map back to just scores for the DB schema
        const mappedAnswersForDb: Record<number, number> = {};
        for (const [key, val] of Object.entries(finalAnswers)) {
           mappedAnswersForDb[Number(key)] = val.score;
        }

        setIsSaving(true);
        try {
          await saveAssessment(totalScore, riskLevel, mappedAnswersForDb);
        } catch (err: any) {
          setSaveError(err.message);
        } finally {
          setIsSaving(false);
          setIsCompleted(true);
        }
      }
    }, 500);
  };

  // Calculate total score
  const calculateScore = () => {
    return Object.values(answers).reduce((sum, ans) => sum + ans.score, 0);
  };

  // Determine risk level based on score
  const getRiskLevel = (score: number) => {
    if (score <= 3)
      return {
        level: t("low_risk") || "Low Risk",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        class: "from-emerald-400 to-teal-600",
        description: t("low_risk_desc") || "Excellent news. Your metabolic profile shows minimal risk for pre-diabetes. Maintain your active lifestyle.",
        icon: <ShieldAlert className="w-16 h-16 text-emerald-400 mb-4" />
      };
    if (score <= 7)
      return {
        level: t("mod_risk") || "Moderate Risk",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        class: "from-amber-400 to-orange-600",
        description: t("mod_risk_desc") || "Your metabolic profile indicates some indicators of risk. Small dietary adjustments can have a massive impact.",
        icon: <ShieldAlert className="w-16 h-16 text-amber-500 mb-4" />
      };
    return {
        level: t("high_risk"),
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      class: "from-rose-500 to-red-600",
      description: t("high_risk_desc") || "Your metabolic markers suggest a significant risk profile. We recommend scheduling a formal diagnostic test soon.",
      icon: <HeartPulse className="w-16 h-16 text-rose-400 mb-4" />
    };
  };

  // Transition Variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 1.05, y: -20 }
  };

  // Results View
  if (isSaving) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-50/90 dark:bg-[#0c0f16]/90 backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            <BrainCircuit className="absolute inset-0 w-10 h-10 m-auto text-teal-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Processing Assessment</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Calculating your personalised risk profile...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const totalScore = calculateScore();
    const risk = getRiskLevel(totalScore);

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 relative min-h-screen flex items-center justify-center">
        {/* Background Ambience */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-50 dark:opacity-20 ${risk.bg.replace('/10', '')}`} />

        <motion.div 
          initial="initial" animate="in" variants={pageVariants} transition={{ type: "spring", stiffness: 200, damping: 20 }}
          whileHover={{ rotateY: 3, rotateX: -2, scale: 1.01, perspective: 1000 }}
          className="w-full relative z-10"
        >
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl p-8 sm:p-12 text-center border border-white/20 dark:border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40 dark:to-black/40 pointer-events-none"></div>
            
            <motion.div 
              initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.2 }}
              className="relative w-32 h-32 mx-auto mb-8"
            >
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 bg-gradient-to-tr ${risk.class}`}></div>
              <div className={`relative w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-2xl border-2 ${risk.border}`}>
                {risk.icon}
              </div>
            </motion.div>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="relative z-10">
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-3">{t("diagnostic_complete")}</h2>
               <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6 uppercase">
                 You are <span className={`text-transparent bg-clip-text bg-gradient-to-r ${risk.class} drop-shadow-sm`}>{risk.level}</span>
               </h1>
               
               <div className={`p-6 rounded-3xl ${risk.bg} ${risk.border} border mb-10 max-w-xl mx-auto backdrop-blur-md`}>
                 <p className={`text-lg sm:text-xl font-medium leading-relaxed ${risk.color.replace('500', '700')} dark:${risk.color.replace('500', '300')}`}>
                   {risk.description}
                 </p>
               </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button
                onClick={() => { setAnswers({}); setCurrentStep(0); setIsCompleted(false); }}
                className="px-8 py-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 font-bold text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-white/10 uppercase tracking-widest text-sm"
              >
                {t("retake_quiz")}
              </button>
              <Link
                href="/dashboard"
                className={`px-8 py-5 rounded-2xl bg-gradient-to-r ${risk.class} text-white font-black transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:scale-105 uppercase tracking-widest text-sm`}
              >
                <Sparkles size={20} /> View AI BioTwin <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 relative min-h-[85vh] flex flex-col justify-center">
      {/* Premium Ambient Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10 relative z-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition-colors group bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-md uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Dashboard
        </Link>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight uppercase relative inline-block">
          Risk Assessment
          <Sparkles className="absolute -top-6 -right-8 text-teal-400 w-8 h-8 animate-pulse" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium text-lg max-w-lg mx-auto">
          Complete this evidence-based 60-second screening to understand your pre-diabetes risk profile.
        </p>
      </motion.div>

      {/* Main Glass Quiz Card */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden relative z-10 flex flex-col min-h-[500px]">
        
        {/* Glowing Progress Bar */}
        <div className="bg-gray-100/50 dark:bg-black/20 h-2 w-full relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-blue-500 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep) / questions.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        <div className="p-8 sm:p-12 flex-1 flex flex-col relative">
          {/* Subtle watermark number in background */}
          <div className="absolute top-8 right-12 text-[12rem] font-black text-gray-50 dark:text-white/[0.02] leading-none pointer-events-none select-none">
            {currentStep + 1}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="flex-1 flex flex-col relative z-10"
            >
              {/* Question Header */}
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-inner">
                    {question.icon}
                  </div>
                  <div>
                    <span className="text-teal-600 dark:text-teal-400 text-xs font-black uppercase tracking-[0.2em]">
                      Question {currentStep + 1} of {questions.length}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
                  {question.text}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{question.description}</p>
              </div>

              {/* Options Grid */}
              <div className="space-y-4 flex-1">
                {question.options.map((option, idx) => {
                  const isSelected = answers[question.id]?.index === idx;

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, x: 10, rotateY: 5, perspective: 1000 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(question.id, option.score, idx)}
                      className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex items-center justify-between group relative overflow-hidden
                        ${isSelected 
                          ? "border-teal-500 bg-teal-50/50 dark:bg-teal-500/10 shadow-xl shadow-teal-500/10" 
                          : "border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-teal-300 dark:hover:border-teal-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20"}`}
                    >
                      {/* Hover Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-teal-500/0 to-teal-500/5 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                      
                      <span className={`font-bold text-lg relative z-10 ${isSelected ? 'text-teal-700 dark:text-teal-300' : ''}`}>{option.text}</span>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                        isSelected ? "bg-teal-500 text-white shadow-md scale-110" : "border-2 border-gray-200 dark:border-gray-600 group-hover:border-teal-400"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-5 h-5" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className="px-8 py-6 bg-gray-50/80 dark:bg-[#0c0f16]/80 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 flex items-center justify-between z-20">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 px-5 py-3 rounded-xl ${
              currentStep === 0 
                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" 
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-x-1"
            }`}
          >
            {currentStep > 0 && <ArrowLeft size={16} />} Previous
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-teal-600 dark:text-teal-400 font-black uppercase tracking-[0.2em] bg-teal-50 dark:bg-teal-500/10 px-4 py-2 rounded-xl border border-teal-100 dark:border-teal-500/20">
              {Math.round(((currentStep) / questions.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
