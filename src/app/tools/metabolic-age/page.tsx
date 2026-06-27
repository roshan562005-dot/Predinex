"use client";

import { useState } from "react";
import Link from "next/link";
import { PredinexLogo } from "@/components/PredinexLogo";
import { ArrowLeft, ArrowRight, Activity, RotateCcw, HeartPulse, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "p-4 rounded-xl border font-bold text-lg text-left transition-all " +
        (selected
          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
          : "bg-black/50 border-white/10 hover:border-white/30")
      }
    >
      {label}
    </button>
  );
}

export default function MetabolicAgeTestPage() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(30);
  const [waist, setWaist] = useState(34);
  const [height, setHeight] = useState(68);
  const [sleep, setSleep] = useState(2);
  const [activity, setActivity] = useState(2);
  const [stress, setStress] = useState(2);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const calculateAge = () => {
    let modifiers = 0;
    const whr = waist / height;
    if (whr > 0.6) modifiers += 8;
    else if (whr > 0.55) modifiers += 5;
    else if (whr > 0.5) modifiers += 2;
    else modifiers -= 2;

    if (sleep === 1) modifiers += 4;
    else if (sleep === 3) modifiers -= 1;

    if (activity === 1) modifiers += 5;
    else if (activity === 3) modifiers -= 4;

    if (stress === 3) modifiers += 5;
    else if (stress === 1) modifiers -= 2;

    setCalculatedAge(Math.max(18, age + modifiers));
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
    else calculateAge();
  };

  const reset = () => {
    setStep(1);
    setCalculatedAge(null);
  };

  const isOlder = calculatedAge !== null && calculatedAge > age;
  const ageDiff = calculatedAge !== null ? Math.abs(calculatedAge - age) : 0;
  const progressWidth = ((step / 6) * 100) + "%";
  const heightFeet = Math.floor(height / 12);
  const heightInches = height % 12;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans pb-32">
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
        <div className="max-w-2xl mx-auto">
          <Link href="/tools" className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:text-emerald-400 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Tools Hub
          </Link>

          {!calculatedAge ? (
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: progressWidth }}
                />
              </div>

              <div className="text-sm font-bold text-emerald-400 tracking-widest uppercase mb-6">
                Step {step} of 6
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div>
                      <h2 className="text-3xl font-black mb-8">What is your chronological age?</h2>
                      <input
                        type="range"
                        min="18" max="90"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                      <div className="text-6xl font-black text-center mt-8 text-emerald-400">
                        {age} <span className="text-2xl text-gray-500">years</span>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="text-3xl font-black mb-4">Waist &amp; Height</h2>
                      <p className="text-gray-400 mb-8">Your waist-to-height ratio is a powerful predictor of visceral fat and insulin resistance.</p>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Height (inches)</label>
                          <input type="range" min="48" max="84" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-emerald-500" />
                          <div className="text-xl font-bold mt-2">{heightFeet}&apos;{heightInches}&quot; ({height} in)</div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Waist Circumference (inches)</label>
                          <input type="range" min="20" max="60" value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="w-full accent-emerald-500" />
                          <div className="text-xl font-bold mt-2">{waist} in</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h2 className="text-3xl font-black mb-8">How much sleep do you get on average?</h2>
                      <div className="grid gap-4">
                        <OptionButton label="Less than 6 hours" selected={sleep === 1} onClick={() => setSleep(1)} />
                        <OptionButton label="6 to 8 hours" selected={sleep === 2} onClick={() => setSleep(2)} />
                        <OptionButton label="More than 8 hours" selected={sleep === 3} onClick={() => setSleep(3)} />
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <h2 className="text-3xl font-black mb-8">How active are you?</h2>
                      <div className="grid gap-4">
                        <OptionButton label="Sedentary (mostly sitting)" selected={activity === 1} onClick={() => setActivity(1)} />
                        <OptionButton label="Moderately Active (exercise 2-3x/week)" selected={activity === 2} onClick={() => setActivity(2)} />
                        <OptionButton label="Highly Active (exercise 4+x/week)" selected={activity === 3} onClick={() => setActivity(3)} />
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div>
                      <h2 className="text-3xl font-black mb-8">What is your daily stress level?</h2>
                      <div className="grid gap-4">
                        <OptionButton label="Low (I feel calm most days)" selected={stress === 1} onClick={() => setStress(1)} />
                        <OptionButton label="Medium (Manageable stress)" selected={stress === 2} onClick={() => setStress(2)} />
                        <OptionButton label="High (Constantly overwhelmed)" selected={stress === 3} onClick={() => setStress(3)} />
                      </div>
                    </div>
                  )}

                  {step === 6 && (
                    <div className="text-center py-8">
                      <Activity className="w-20 h-20 text-emerald-500 mx-auto mb-6 animate-pulse" />
                      <h2 className="text-3xl font-black mb-4">Ready for your results?</h2>
                      <p className="text-gray-400">Our clinical algorithm is ready to calculate your true metabolic age based on your biomarkers and lifestyle.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-6">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                    Previous
                  </button>
                ) : <div />}
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-black font-black rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {step === 6 ? "Calculate Age" : "Next"} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={
                "border rounded-[2rem] p-10 md:p-16 text-center " +
                (isOlder ? "border-red-500/30 bg-red-500/10" : "border-emerald-500/30 bg-emerald-500/10")
              }
            >
              <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">Your True Metabolic Age is</div>
              <div className={"text-8xl md:text-9xl font-black tracking-tighter mb-6 " + (isOlder ? "text-red-400" : "text-emerald-400")}>
                {calculatedAge}
              </div>

              <div className="text-xl font-bold mb-8">
                {isOlder
                  ? "You are aging metabolically " + ageDiff + " years faster than your real age."
                  : "Excellent! Your metabolic age is " + ageDiff + " years younger than your real age."
                }
              </div>

              {isOlder && (
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8 text-left">
                  <h3 className="font-bold text-xl mb-4 text-white">How to turn back the clock:</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2"><HeartPulse className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <strong>Optimize your insulin:</strong> Visceral fat (waist size) accelerates cellular aging by driving insulin resistance.</li>
                    <li className="flex items-start gap-2"><HeartPulse className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <strong>Manage cortisol:</strong> Chronic stress and poor sleep rapidly degrade metabolic health and drive inflammation.</li>
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  {isOlder ? "Start Preventing It Now" : "Optimize Your Health"}
                  <ChevronRight size={20} />
                </Link>
                <button onClick={reset} className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                  <RotateCcw size={18} /> Retake Test
                </button>
              </div>
            </motion.div>
          )}

          {/* SEO Text Content */}
          <div className="mt-20 prose prose-invert max-w-none">
            <h2>What is Metabolic Age?</h2>
            <p>
              Your chronological age is simply how many years you have been alive. Your <strong>metabolic age</strong> is a calculation that compares your basal metabolic rate, body composition, and lifestyle biomarkers against the average for your age group.
            </p>
            <p>
              If your metabolic age is higher than your actual age, it is a clinical warning sign that your cells are experiencing accelerated aging, often due to visceral adiposity, chronic stress, or early insulin resistance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
