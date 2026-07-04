import Link from "next/link";
import Image from "next/image";
import { PredinexLogo } from "@/components/PredinexLogo";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { CarePathway } from "@/components/landing/CarePathway";
import { TelemetryShowcase } from "@/components/landing/TelemetryShowcase";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-emerald-500/30 font-sans">
      
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

      <HeroSection />
      <FeatureGrid />
      <CarePathway />
      <TelemetryShowcase />

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
              <Image 
                src="/marketing/ui-mockup.png" 
                alt="Predinex Mobile UI App Mockup - AI Metabolic Health Tracking for Pre-Diabetes" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-white font-black text-2xl tracking-tight">Clinical Dashboard</h3>
                <p className="text-emerald-400 font-semibold mt-1">Mobile Telemetry</p>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-[2rem] border border-white/10 relative bg-black aspect-square shadow-2xl md:-translate-y-8">
              <Image 
                src="/marketing/biotwin-concept.png" 
                alt="Predinex AI Metabolic BioTwin Concept - Advanced DNA and Diabetes Reversal Technology" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-white font-black text-2xl tracking-tight">AI BioTwin</h3>
                <p className="text-emerald-400 font-semibold mt-1">Predictive Engine</p>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-[2rem] border border-white/10 relative bg-black aspect-square shadow-2xl">
              <Image 
                src="/marketing/wearable-tech.png" 
                alt="Predinex Wearable Tech Integration - Real-time Glucose and Blood Pressure Smartwatch" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-white font-black text-2xl tracking-tight">Wearable Sync</h3>
                <p className="text-emerald-400 font-semibold mt-1">Real-time Analysis</p>
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

      {/* SEO Optimized About Section */}
      <section className="py-24 bg-[#020202] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                About the Predinex Diabetes Prevention App
              </h2>
              <div className="space-y-4 text-gray-400 font-medium leading-relaxed">
                <p>
                  The <strong className="text-gray-200">Predinex App</strong> is a leading-edge software application designed to help individuals track their metabolic health and prevent Type 2 Diabetes. Founded by A. Roshan, our platform provides evidence-based clinical guidance, personalized insulin resistance diet plans, and real-time blood sugar monitoring tools.
                </p>
                <p>
                  Unlike a medication (such as the similarly named corticosteroid, Prednisolone Acetate), Predinex is a comprehensive digital health ecosystem. We leverage advanced AI telemetry to analyze your health data and deliver actionable insights for diabetes reversal and metabolic syndrome management.
                </p>
                <p>
                  Whether you are looking to calculate your HOMA-IR score, find a diabetic meal plan, or track your fasting glucose, the Predinex Health App is your ultimate clinical companion. Download our mobile telemetry dashboard today and join thousands reversing pre-diabetes naturally.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full flex justify-center md:justify-end">
              <div className="relative w-64 h-64 opacity-50 hover:opacity-100 transition-opacity duration-500">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                 <Image 
                    src="/images/predinex_hex_3d.png" 
                    alt="Predinex Diabetes App Logo" 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain relative z-10" 
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-black relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-70">
            <PredinexLogo size="sm" linked={false} />
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Health</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/its_roshanahmed" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#E1306C] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/roshan562005" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0A66C2] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">© 2026 Predinex · Founded by A. Roshan · Secure Platform</p>
        </div>
      </footer>
    </div>
  );
}
