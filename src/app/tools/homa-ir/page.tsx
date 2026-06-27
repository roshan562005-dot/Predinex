"use client";

import { useState } from "react";
import Link from "next/link";
import { PredinexLogo } from "@/components/PredinexLogo";
import { ArrowLeft, Calculator, AlertTriangle, CheckCircle, Info, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomaIrCalculatorPage() {
  const [glucose, setGlucose] = useState("");
  const [insulin, setInsulin] = useState("");
  const [unit, setUnit] = useState("mg/dL");
  const [result, setResult] = useState<{ score: number; risk: string; color: string } | null>(null);

  const calculateHoma = () => {
    const g = parseFloat(glucose);
    const i = parseFloat(insulin);

    if (isNaN(g) || isNaN(i) || g <= 0 || i <= 0) return;

    let score = 0;
    if (unit === "mg/dL") {
      score = (g * i) / 405;
    } else {
      score = (g * i) / 22.5;
    }

    let risk = "";
    let color = "";

    if (score < 1.0) {
      risk = "Optimal Insulin Sensitivity";
      color = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    } else if (score >= 1.0 && score < 1.9) {
      risk = "Early Insulin Resistance";
      color = "text-amber-400 border-amber-500/30 bg-amber-500/10";
    } else if (score >= 1.9 && score < 2.9) {
      risk = "Significant Insulin Resistance";
      color = "text-orange-400 border-orange-500/30 bg-orange-500/10";
    } else {
      risk = "Severe Insulin Resistance";
      color = "text-red-400 border-red-500/30 bg-red-500/10";
    }

    setResult({ score: Number(score.toFixed(2)), risk, color });
  };

  const unitBtnClass = (active: boolean) =>
    "px-3 py-1 text-xs font-bold rounded-md transition-colors " +
    (active ? "bg-rose-500/20 text-rose-400" : "text-gray-500 hover:text-white");

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-rose-500/30 font-sans pb-32">
      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PredinexLogo />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              All Tools
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/tools" className="inline-flex items-center gap-2 text-rose-500 font-bold hover:text-rose-400 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Tools Hub
          </Link>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-rose-400" />
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400">
                Clinical Grade
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              HOMA-IR Calculator
            </h1>
            <p className="text-lg text-gray-400">
              The Homeostatic Model Assessment of Insulin Resistance (HOMA-IR) is the clinical gold standard for quantifying insulin resistance and beta-cell function.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
              <h3 className="text-xl font-bold mb-6">Enter Your Lab Results</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-300">Fasting Glucose</label>
                    <div className="flex bg-black rounded-lg border border-white/10 p-1">
                      <button 
                        onClick={() => setUnit("mg/dL")}
                        className={unitBtnClass(unit === "mg/dL")}
                      >
                        mg/dL
                      </button>
                      <button 
                        onClick={() => setUnit("mmol/L")}
                        className={unitBtnClass(unit === "mmol/L")}
                      >
                        mmol/L
                      </button>
                    </div>
                  </div>
                  <input 
                    type="number" 
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    placeholder={unit === "mg/dL" ? "e.g., 95" : "e.g., 5.3"}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all font-mono text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Fasting Insulin <span className="text-gray-500 font-normal">(µU/mL or mU/L)</span>
                  </label>
                  <input 
                    type="number" 
                    value={insulin}
                    onChange={(e) => setInsulin(e.target.value)}
                    placeholder="e.g., 8.5"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all font-mono text-lg"
                  />
                </div>

                <button 
                  onClick={calculateHoma}
                  disabled={!glucose || !insulin}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl font-black text-lg text-white shadow-[0_0_30px_rgba(244,63,94,0.3)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] transition-all"
                >
                  Calculate My Score
                </button>
              </div>
            </div>

            {/* Results Display */}
            <div>
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={"border rounded-[2rem] p-8 h-full flex flex-col justify-center " + result.color}
                  >
                    <div className="text-center mb-6">
                      <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Your HOMA-IR Score</div>
                      <div className="text-7xl font-black tracking-tighter mb-4">{result.score}</div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm font-bold text-sm">
                        {result.score < 1.0 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                        {result.risk}
                      </div>
                    </div>

                    {result.score >= 1.0 && (
                      <div className="mt-8 pt-8 border-t border-current/20">
                        <p className="text-sm font-bold opacity-90 mb-4">
                          You are exhibiting signs of insulin resistance. Take proactive steps before it progresses to pre-diabetes.
                        </p>
                        <Link href="/register" className="flex items-center justify-between w-full px-5 py-3 bg-white text-black font-black rounded-xl hover:opacity-90 transition-opacity">
                          Start Preventing It Now
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/[0.02] border border-white/5 border-dashed rounded-[2rem] p-8 h-full flex flex-col items-center justify-center text-center text-gray-500"
                  >
                    <Info className="w-12 h-12 mb-4 opacity-50" />
                    <p className="max-w-xs font-medium">
                      Enter your latest fasting lab results on the left to instantly calculate your insulin resistance level.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* SEO Text Content */}
          <div className="mt-20 prose prose-invert max-w-none">
            <h2>Why is HOMA-IR Important?</h2>
            <p>
              Most doctors only test Fasting Glucose or HbA1c. However, these are lagging indicators. Your body can overproduce insulin for years to keep your glucose levels normal. Testing your Fasting Insulin and calculating your HOMA-IR score reveals this hidden compensation, allowing you to detect and prevent metabolic dysfunction up to a decade before it becomes pre-diabetes.
            </p>
            <h3>Reference Ranges</h3>
            <ul>
              <li><strong>Optimal:</strong> Less than 1.0 (High insulin sensitivity)</li>
              <li><strong>Early Resistance:</strong> 1.0 - 1.9</li>
              <li><strong>Significant Resistance:</strong> Greater than 1.9</li>
              <li><strong>Severe Resistance:</strong> Greater than 2.9 (Likely pre-diabetes or type 2 diabetes)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
