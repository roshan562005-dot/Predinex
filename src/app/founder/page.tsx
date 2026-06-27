"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PredinexLogo } from "@/components/PredinexLogo";
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  Star,
  Globe,
  BookOpen,
  Microscope,
  HeartPulse,
  Users,
  Lightbulb,
  Quote,
  Linkedin,
  Instagram,
  Mail,
  ChevronRight,
  Dna,
  Brain,
  Trophy,
} from "lucide-react";

const timeline = [
  {
    year: "2022",
    title: "Pharmacy Foundation",
    description:
      "Began a Bachelor of Pharmacy (BPharm) at Sree Balaji Medical College and Hospital. Consistently demonstrated academic excellence, maintaining an outstanding 8.89 CGPA and serving as Class Representative.",
    icon: BookOpen,
    color: "from-yellow-400 to-orange-500",
  },
  {
    year: "2024",
    title: "World Records & Recognition",
    description:
      "Achieved Kalam's World Record for an 8-hour non-stop educational talkathon on pharmaceutical drug interactions. Won multiple 'Best Presentation' awards at national conferences, including Integrative Medical Science and Pharma Congregation.",
    icon: Trophy,
    color: "from-emerald-400 to-teal-600",
  },
  {
    year: "2025",
    title: "Clinical Innovation & Research",
    description:
      "Spearheaded 'A Phyto Fusion'—creating a next-gen herbal cream with Annona squamosa. Gained hands-on industrial expertise at Teyro Labs in QA, QC, and pharmaceutical manufacturing.",
    icon: Microscope,
    color: "from-blue-400 to-blue-600",
  },
  {
    year: "2026",
    title: "Teaching & Digital Health",
    description:
      "Certified in 'Digital Health in Pharma' by NCVET and started consulting as a Freelance Faculty Teacher. Blending a passion for education with cutting-edge technology to simplify complex medical concepts.",
    icon: Lightbulb,
    color: "from-violet-400 to-purple-600",
  },
  {
    year: "Present",
    title: "The Birth of Predinex",
    description:
      "Fusing a multidisciplinary background in pharmacology, predictive science, medical writing, and education to build Predinex — shifting global healthcare from treatment to proactive prevention.",
    icon: HeartPulse,
    color: "from-pink-400 to-rose-600",
  },
];

const achievements = [
  {
    icon: ShieldCheck,
    label: "Patent: Novel Anticancer Scaffolds",
    year: "2026 · Intellectual Property India",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: Star,
    label: "Kalam's World Record Holder",
    year: "8-Hour Non-Stop Educational Talkathon",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
  {
    icon: BookOpen,
    label: "3 Published Research Papers",
    year: "Clinical & Pharmaceutical Formulations",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: Trophy,
    label: "Multiple '1st Prize' & Best Papers",
    year: "National Pharmacy & Medical Conferences",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    icon: Brain,
    label: "Digital Health in Pharma",
    year: "2026 · NCVET, Govt. of India",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
  },
  {
    icon: Users,
    label: "Freelance Faculty Consultant",
    year: "Passionate Scientific Educator",
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
  },
];

const pillars = [
  {
    title: "Prevention Over Cure",
    description:
      "The most powerful medicine is the one you never have to take. Every decision at Predinex is designed to intercept disease before it can take hold.",
    icon: ShieldCheck,
    gradient: "from-emerald-500/20 to-teal-500/0",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.1)]",
    border: "border-emerald-500/20",
  },
  {
    title: "Personalised Science",
    description:
      "No two metabolisms are identical. Predinex builds a unique health fingerprint for every patient, delivering interventions tailored to their biology, not generic guidelines.",
    icon: Dna,
    gradient: "from-blue-500/20 to-blue-500/0",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.1)]",
    border: "border-blue-500/20",
  },
  {
    title: "Technology for Humanity",
    description:
      "Computational models and machine learning are only as powerful as the human insight guiding them. At Predinex, every algorithm is clinically validated and patient-centred.",
    icon: Brain,
    gradient: "from-violet-500/20 to-violet-500/0",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.1)]",
    border: "border-violet-500/20",
  },
];

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-emerald-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#030712]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <PredinexLogo size="sm" />
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-28">
        {/* ─── HERO ──────────────────────────────────────────────── */}
        <section className="min-h-[90vh] flex items-center py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: -40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative order-2 lg:order-1"
            >
              {/* Glow ring behind image */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-blue-500/20 blur-2xl scale-110" />
              
              <div className="relative aspect-[3/4] max-w-md mx-auto lg:max-w-none rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-gray-800 to-gray-900 shadow-[0_40px_100px_rgba(0,0,0,0.5)] group">
                <img
                  src="/images/roshan_founder.jpg" 
                  alt="A. Roshan — Founder and CEO, Predinex Diabetes Prevention Platform"
                  title="A. Roshan - Founder of Predinex"
                  className="w-full h-full object-cover object-top scale-[1.15] group-hover:scale-[1.2] transition-transform duration-700 saturate-[1.15] contrast-[1.1] brightness-[1.05]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/founder_4k_natural.png";
                  }}
                />
                {/* Smoothing gradient overlay to blend the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
              </div>

              {/* Dot pattern decoration */}
              <div
                className="absolute -top-8 -left-8 w-28 h-28 opacity-10 pointer-events-none hidden lg:block"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                  backgroundSize: "14px 14px",
                }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="order-1 lg:order-2 flex flex-col justify-center"
            >
              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <Award className="w-4 h-4" />
                  Founder &amp; Chief Visionary
                </div>
                <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-1 max-w-[100px]" />
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-6">
                A. Roshan
                <span className="block text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 mt-2">
                  Redefining the Future of Metabolic Health.
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed mb-6 max-w-xl text-pretty">
                A Pharmacy Scholar, World Record Holder, and passionate Educator merging pharmaceutical science with advanced clinical algorithms to intercept metabolic diseases before they begin.
              </p>

              {/* Inline mini-quote */}
              <div className="mb-8 pl-4 border-l-2 border-emerald-500/50 max-w-lg">
                <p className="text-emerald-300/80 italic font-semibold text-sm leading-relaxed">
                  "Education and prevention are the greatest medicines. By fusing traditional pharmacology with predictive modeling, we aren't just treating symptoms — we are engineering a preventative future for global health."
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5 mb-10">
                {["Patent Holder", "Clinical Educator", "Digital Health", "Multilingual Speaker"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-bold text-gray-300 tracking-wide hover:bg-white/[0.08] transition-colors"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#journey"
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-sm hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                >
                  Explore the Journey
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                
                {/* LinkedIn Button */}
                <a
                  href="https://www.linkedin.com/in/roshan562005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 transition-all text-sm font-bold text-[#70B5F9] shadow-[0_0_20px_rgba(10,102,194,0.1)] hover:shadow-[0_0_30px_rgba(10,102,194,0.2)]"
                >
                  <Linkedin size={18} />
                  Connect
                </a>

                {/* Instagram Button */}
                <a
                  href="https://www.instagram.com/its_roshanahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 border border-[#E1306C]/30 hover:border-[#E1306C]/50 transition-all text-sm font-bold text-[#E1306C] shadow-[0_0_20px_rgba(225,48,108,0.1)] hover:shadow-[0_0_30px_rgba(225,48,108,0.2)]"
                >
                  <Instagram size={18} />
                  @its_roshanahmed
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── VISION QUOTE ──────────────────────────────────────── */}
        <section className="py-24 relative">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
            >
              <Quote className="w-12 h-12 text-emerald-400/40 mx-auto mb-8" />
              <blockquote className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-8">
                "The future of healthcare is not in hospitals — it's in the decisions we make{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  every single day.
                </span>
                "
              </blockquote>
              <p className="text-gray-500 text-lg font-semibold">— A. Roshan, Founder of Predinex</p>
            </motion.div>
          </div>
        </section>

        {/* ─── JOURNEY TIMELINE ──────────────────────────────────── */}
        <section id="journey" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                The Journey
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                From Idea to Impact.
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block -translate-x-1/2" />

              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.1, duration: 0.7 }}
                    className={`flex flex-col lg:flex-row items-center gap-8 ${
                      i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                      <div
                        className={`bg-white/[0.03] border border-white/8 rounded-[2rem] p-8 hover:bg-white/[0.06] transition-all group ${
                          i % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                        } max-w-lg`}
                      >
                        <span className="text-5xl font-black text-white/10 group-hover:text-white/20 transition-colors tracking-tighter">
                          {item.year}
                        </span>
                        <h3 className="text-2xl font-black text-white mt-2 mb-3">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Centre dot */}
                    <div className="hidden lg:flex shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br items-center justify-center shadow-lg z-10 border border-white/10"
                      style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 hidden lg:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── ACHIEVEMENTS ──────────────────────────────────────── */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6">
                Recognition &amp; Achievements
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                Honours &amp; Milestones.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {achievements.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className={`flex items-start gap-4 p-6 rounded-[1.75rem] border bg-white/[0.02] hover:bg-white/[0.05] transition-all ${a.bg}`}
                >
                  <div className={`shrink-0 w-12 h-12 rounded-2xl ${a.bg} border flex items-center justify-center`}>
                    <a.icon className={`w-6 h-6 ${a.color}`} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base leading-snug">{a.label}</p>
                    <p className={`text-sm font-semibold mt-1 ${a.color}`}>{a.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PHILOSOPHY PILLARS ────────────────────────────────── */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6">
                Philosophy
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                Three Core Beliefs.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.15, duration: 0.7 }}
                  className={`relative rounded-[2rem] p-8 border bg-gradient-to-b ${p.gradient} ${p.border} ${p.glow} overflow-hidden group hover:-translate-y-2 transition-all duration-500`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <p.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{p.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{p.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PERSONAL MESSAGE ──────────────────────────────────── */}
        <section className="py-24 relative">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2.5rem] border border-white/10 bg-[#030712]/40 backdrop-blur-3xl p-8 md:p-12 overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.05)]"
            >
              {/* Background Glows & Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/5 pointer-events-none" />
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <Quote className="absolute -top-6 -right-6 w-40 h-40 text-white/[0.04] -rotate-12 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                  <Star className="w-3 h-3 text-emerald-400" />
                  A Personal Message
                </div>

                <blockquote className="text-2xl md:text-3xl text-white font-light leading-[1.4] tracking-tight mb-10 max-w-2xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200">"Your body whispers before it shouts. But modern healthcare is built to wait for the scream.</span>
                  <br /><br />
                  I built Predinex to change that. I believe true care means listening to the quiet signals in your body today, so we never have to fight a crisis tomorrow.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-semibold italic">
                    We aren't just treating risk.
                  </span>
                  <br /><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-100">
                    We are fiercely protecting your time, your joy, and the life you love."
                  </span>
                </blockquote>

                <div className="w-16 h-px bg-white/20 mb-8" />

                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-40" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#030712] to-gray-900 border border-emerald-500/30 flex items-center justify-center">
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 font-black text-lg tracking-tighter">
                        AR
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black text-lg tracking-tight">A. Roshan</p>
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mt-0.5">Founder &amp; CEO</p>
                  </div>
                </div>

                {/* Contact & Support */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-10 mb-6" />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a href="https://www.instagram.com/its_roshanahmed" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <Instagram className="w-4 h-4 text-gray-500 group-hover:text-[#E1306C] transition-colors" />
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">@its_roshanahmed</span>
                  </a>
                  <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                  <a href="mailto:predinexsupport@gmail.com" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <Mail className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">predinexsupport@gmail.com</span>
                  </a>
                  <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                  <a href="mailto:predinexlegal@gmail.com" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <ShieldCheck className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">predinexlegal@gmail.com</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────────── */}
        <section className="py-24 pb-40">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
                Be Part of the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Mission.
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-10">
                Join thousands who are taking control of their metabolic health with Predinex.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                >
                  Start My Health Journey
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Learn About Predinex
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-[#030712]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <PredinexLogo size="sm" linked={false} />
          <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">
            © 2026 Predinex · Built with Vision · Roshan A.
          </p>
        </div>
      </footer>
    </div>
  );
}
