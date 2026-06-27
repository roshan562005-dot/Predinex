"use client";

import Link from "next/link";
import { PredinexLogo } from "@/components/PredinexLogo";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  RefreshCw,
  Droplets,
  Activity,
  Brain,
  ChevronRight,
  Users,
  BookOpen,
  ArrowRight,
  Check,
  HeartPulse,
  Dumbbell,
  ShieldCheck,
  Stethoscope,
  Binary
} from "lucide-react";
import { useRef } from "react";

const stats = [
  { value: "96%", label: "Accuracy" },
  { value: "10k+", label: "Enrolled Patients" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "30", label: "Days to Improvement" },
];

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

export default function LandingPage() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-emerald-500/30 font-sans" ref={scrollRef}>
      
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay" style={{backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'}}></div>

      {/* Navbar - Glassmorphic */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/40 backdrop-blur-2xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <PredinexLogo size="md" />

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Clinical Features</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <Link href="/founder" className="hover:text-emerald-400 transition-colors">Our Founder</Link>
            <Link href="/blog" className="hover:text-emerald-400 transition-colors">Journal</Link>
            <Link href="/tools" className="hover:text-emerald-400 transition-colors text-emerald-500 font-bold">Free Tools</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-bold text-gray-300 hover:text-white transition-colors">
              Patient Login
            </Link>
            <Link
              href="/login"
              className="relative px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        {/* Glow Orbs */}
        <motion.div style={{ y: yBackground }} className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></motion.div>
        <motion.div style={{ y: yBackground }} className="absolute bottom-0 right-1/4 translate-x-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></motion.div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-center mb-8 relative">
               <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full w-40 h-40 m-auto"></div>
               <div className="relative w-40 h-40 md:w-56 md:h-56">
                 <motion.img 
                    animate={{ y: [0, -15, 0] }} 
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    src="/images/predinex_hex_3d.png" 
                    alt="Predinex Health Platform" 
                    className="w-full h-full object-contain relative z-10" 
                 />
               </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-12 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md"
            >
              <Stethoscope size={14} className="animate-pulse" />
              Next-Generation Metabolic Care
            </motion.div>



            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              Prevent Diabetes <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Before It Begins.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Predinex is a secure, patient-centred metabolic health tracking platform designed to reverse pre-diabetes through evidence-based lifestyle interventions and personalised clinical guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative">
              <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full w-3/4 mx-auto animate-pulse pointer-events-none"></div>
              <Link
                href="/login"
                className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-[length:200%_auto] text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_40px_rgba(16,185,129,0.5)] w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                Begin My Health Journey
                <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
            
            <p className="text-gray-500 text-sm font-semibold mt-8 flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-teal-500" />
              Private & Secure · Your Data Never Leaves Your Device
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                <div className="text-3xl md:text-5xl font-black text-white tracking-tighter relative z-10">
                   {stat.value}
                </div>
                <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid Features */}
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

      {/* How It Works Layer */}
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

      {/* Telemetry Showcase */}
      <section className="py-24 relative overflow-hidden bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Binary size={12} className="animate-pulse" />
                Live Telemetry AI
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                The World's First <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Metabolic BioTwin.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Connect your wearable devices to the Predinex AI engine. Our proprietary <strong>Zero Error Protocol</strong> monitors your Heart Rate Variability, Glucose Variance, and Cortisol proxies in real-time. 
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Predicts metabolic shock before it happens",
                  "AES-256 E2E encrypted data streams",
                  "Personalized AI health forecasts"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 font-medium text-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                      <Check size={12} className="text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/telemetry" className="inline-flex items-center gap-2 text-teal-400 font-bold hover:text-teal-300 transition-colors group">
                Explore Telemetry Dashboard <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Visual representation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-teal-500/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden aspect-square flex flex-col justify-between max-h-[500px]">
                 <div className="absolute top-0 right-0 p-8 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Stream Live</span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                    </span>
                 </div>
                 
                 <div className="flex-1 flex items-center justify-center relative">
                    <div className="absolute inset-0 border border-teal-500/10 rounded-full w-48 h-48 m-auto animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-0 border border-blue-500/10 rounded-full w-32 h-32 m-auto animate-[spin_15s_linear_infinite_reverse]"></div>
                    <Activity className="text-teal-400 w-16 h-16 animate-pulse drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                 </div>

                 <div className="bg-black/50 backdrop-blur-md rounded-2xl p-5 border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">HRV Index</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-500/10 px-2 py-1 rounded">Optimal</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-3xl font-black text-white tracking-tighter">62.2<span className="text-sm font-bold text-gray-500 ml-1">ms</span></span>
                       <div className="h-6 w-16 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-teal-500/20 rounded border border-teal-500/30 opacity-70"></div>
                    </div>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* AI Image Gallery - SEO Optimized */}
      <section className="py-24 relative overflow-hidden bg-[#030303] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Visualizing Metabolic Health
            </h2>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto text-lg">
              Explore our state-of-the-art AI imagery depicting diabetes reversal, precision diets, and glucose tracking technologies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group overflow-hidden rounded-[2rem] border border-white/10 relative bg-black aspect-square shadow-2xl">
              <img 
                src="/images/seo/diabetes-reversal.png" 
                alt="High quality cinematic medical dashboard showing diabetes reversal progress and pre-diabetes clinical management" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-white font-black text-2xl tracking-tight">Diabetes Reversal</h3>
                <p className="text-emerald-400 font-semibold mt-1">Clinical Analytics</p>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-[2rem] border border-white/10 relative bg-black aspect-square shadow-2xl md:-translate-y-8">
              <img 
                src="/images/seo/metabolic-health-ai.png" 
                alt="Futuristic AI core analyzing human metabolic health and glucose monitoring data for diabetes prevention" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-white font-black text-2xl tracking-tight">AI Tracking</h3>
                <p className="text-emerald-400 font-semibold mt-1">Metabolic Health</p>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-[2rem] border border-white/10 relative bg-black aspect-square shadow-2xl">
              <img 
                src="/images/seo/clinical-diabetes-diet.png" 
                alt="Beautiful fresh healthy metabolic diet plate for diabetes management with avocado and wild salmon" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-white font-black text-2xl tracking-tight">Clinical Diet</h3>
                <p className="text-emerald-400 font-semibold mt-1">Nutrition Optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-emerald-500/20 blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 border border-emerald-500/20 bg-black/40 backdrop-blur-3xl p-12 md:p-20 rounded-[3rem]">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
            Take control of<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">your metabolic health today.</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-10">
            Join thousands of patients who have successfully lowered their diabetes risk through Predinex&apos;s structured lifestyle medicine programme.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto"
          >
            Start Your Free Assessment
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-black relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-70">
            <PredinexLogo size="sm" linked={false} />
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Health</span>
          </div>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">© 2026 Predinex · Scientifically Proven · Secure Platform</p>
        </div>
      </footer>
    </div>
  );
}
