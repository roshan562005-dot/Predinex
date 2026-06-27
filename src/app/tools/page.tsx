import Link from "next/link";
import { PredinexLogo } from "@/components/PredinexLogo";
import { Activity, Calculator, ArrowRight, HeartPulse } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Clinical Metabolic Tools & Calculators | Predinex",
  description: "Assess your metabolic health instantly with our free clinical calculators. Calculate your HOMA-IR insulin resistance score and discover your true metabolic age.",
  alternates: {
    canonical: "/tools",
  },
};

const tools = [
  {
    id: "homa-ir",
    title: "HOMA-IR Calculator",
    description: "Calculate your exact level of insulin resistance using the clinical gold-standard Homeostatic Model Assessment.",
    icon: Calculator,
    href: "/tools/homa-ir",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    glow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]",
    border: "group-hover:border-rose-500/50",
    badge: "Clinical Grade",
  },
  {
    id: "metabolic-age",
    title: "Metabolic Age Test",
    description: "Are your cells aging faster than you are? Take our 5-minute interactive clinical assessment to find out your true metabolic age.",
    icon: Activity,
    href: "/tools/metabolic-age",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    border: "group-hover:border-emerald-500/50",
    badge: "Popular",
  },
];

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-teal-500/30">
      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PredinexLogo />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Journal
            </Link>
            <Link href="/login" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6">
              Engineering as Medicine
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Free Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Tools</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Take the guesswork out of your health. Use our clinical-grade calculators and interactive assessments to understand your metabolic risk instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="group outline-none">
                <div className={"relative bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-10 transition-all duration-500 h-full flex flex-col " + tool.glow + " " + tool.border}>

                  <div className="flex justify-between items-start mb-8">
                    <div className={"w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 " + tool.bg}>
                      <tool.icon className={"w-8 h-8 " + tool.color} />
                    </div>
                    {tool.badge && (
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl font-black mb-4 group-hover:text-white transition-colors">{tool.title}</h2>
                  <p className="text-gray-400 leading-relaxed mb-10 flex-grow text-lg">
                    {tool.description}
                  </p>

                  <div className={"flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform " + tool.color}>
                    Open Calculator <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-24 bg-gradient-to-br from-teal-900/20 to-emerald-900/20 border border-teal-500/20 rounded-[2rem] p-10 md:p-16 text-center">
            <HeartPulse className="w-12 h-12 text-teal-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black mb-4">Want the full picture?</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
              Do not stop at just one metric. Join Predinex to connect your continuous glucose monitor, log your lifestyle, and get a complete 360-degree view of your metabolic health.
            </p>
            <Link href="/register" className="inline-block px-10 py-4 bg-white text-black font-black text-lg rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Start Your Journey Free
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
