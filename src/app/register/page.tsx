import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Mail, Lock, CheckCircle2, User, Phone } from "lucide-react";
import { signup } from "../login/actions";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row-reverse">
      {/* Right side (now left): Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
              predinex
            </span>
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-gray-500 mb-8">
              Start your journey to better metabolic health today.
            </p>
            {searchParams?.error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {searchParams.error}
              </div>
            )}
          </div>

          <form className="space-y-5" action={signup}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="phone">
                Phone Number <span className="text-gray-400 font-normal">(for WhatsApp reminders)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">Must be at least 8 characters long.</p>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_8px_16px_-6px_rgba(16,185,129,0.4)] text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all hover:translate-y-[-1px]"
            >
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Left side (now right): Image/Graphic */}
      <div className="hidden md:flex flex-1 relative bg-emerald-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-24 w-full">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
            Taking the first step is the hardest part.
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-lg leading-relaxed">
            But you don't have to do it alone. Predinex provides a clear, personalized path to reversing pre-diabetes.
          </p>

          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 max-w-sm">
             <div className="flex items-center gap-4 mb-4">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Testimonial" className="w-12 h-12 rounded-full ring-4 ring-emerald-50" />
               <div>
                 <p className="font-bold text-gray-900">Sarah Jenkins</p>
                 <p className="text-sm text-emerald-600 font-medium">HbA1c lowered by 1.2%</p>
               </div>
             </div>
             <p className="text-gray-600 italic text-sm">
               "Predinex completely changed how I look at my pre-diabetes diagnosis. The daily plans are so easy to follow, and seeing my progress keeps me motivated."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
