"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PredinexLogo } from "@/components/PredinexLogo";
import {
  Home,
  Activity,
  UtensilsCrossed,
  Dumbbell,
  BookOpen,
  Users,
  Brain,
  Settings,
  LogOut,
  LineChart,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { logout } from "@/app/login/actions";
import { getUserProfile } from "@/app/(app)/actions";

import { useInclusivity } from "@/context/InclusivityContext";
import { Language } from "@/lib/translations";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { language, setLanguage, t, easyMode, setEasyMode } = useInclusivity();

  const navItems = [
    { name: t("dashboard"), href: "/dashboard", icon: Home },
    { name: t("assessment"), href: "/assessment", icon: Activity },
    { name: t("workouts"), href: "/workout", icon: Dumbbell },
    { name: t("diet"), href: "/plans", icon: UtensilsCrossed },
    { name: t("progress"), href: "/progress", icon: LineChart },
    { name: t("mindfulness"), href: "/mindfulness", icon: Brain },
    { name: t("education"), href: "/education", icon: BookOpen },
    { name: t("community"), href: "/community", icon: Users },
    { name: t("telemetry"), href: "/telemetry", icon: Activity },
  ];

  useEffect(() => {
    async function loadProfile() {
      const p = await getUserProfile();
      setProfile(p);
    }
    loadProfile();
  }, []);

  const getInitials = () => {
    if (!profile) return "??";
    const first = profile.first_name?.[0] || "";
    const last = profile.last_name?.[0] || "";
    return (first + last).toUpperCase() || profile.email?.[0].toUpperCase() || "U";
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-white/50 fixed top-0 w-full z-50 shadow-sm">
        <div className="flex flex-col">
          <div className="py-1">
            <PredinexLogo size="md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 glass-panel border-r border-white/40 dark:border-white/10 w-[280px] flex flex-col pt-20 md:pt-0 transition-transform duration-300 z-40 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="hidden md:flex flex-col gap-1 px-5 pt-8 pb-6 overflow-hidden">
          <PredinexLogo size="md" />
        </div>

        {/* Language & Accessibility Controls (NEW) */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 mb-2">
          <div className="flex bg-white/50 dark:bg-black/20 p-1 rounded-xl border border-gray-200/50 dark:border-white/10 shadow-sm">
            {(["en", "hi", "ta"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
                  language === lang
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                )}
              >
                {lang === "en" ? "EN" : lang === "hi" ? "हि" : "த"}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setEasyMode(!easyMode)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all flex items-center gap-1.5",
              easyMode
                ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30"
                : "bg-white/50 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10"
            )}
          >
            <Sparkles size={12} className={easyMode ? "animate-pulse" : ""} />
            {t("easy_mode")}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group overflow-hidden",
                  isActive
                    ? "text-primary-800 font-semibold"
                    : "text-gray-500 font-medium hover:text-gray-900 dark:hover:text-gray-200",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-100/80 to-primary-50/50 dark:from-primary-500/20 dark:to-primary-500/10 border border-primary-200/50 dark:border-primary-500/20 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <item.icon
                  className={cn(
                    "w-5 h-5 relative z-10 transition-transform duration-300",
                    isActive
                      ? "text-primary-600 scale-110"
                      : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110",
                  )}
                />
                <span className="text-[14px] font-bold relative z-10 tracking-tight dark:text-gray-200">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-x-4 gap-y-2 items-center justify-between mt-auto">
          <div className="flex gap-x-4">
            <Link href="/privacy" className="text-[10px] font-bold text-gray-400 hover:text-primary-500 transition-colors uppercase">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-bold text-gray-400 hover:text-primary-500 transition-colors uppercase">Terms</Link>
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        {/* User Profile sticky at bottom */}
        <div className="p-4 mb-2 flex items-center justify-between gap-2">
          <Link href="/profile" onClick={() => setIsOpen(false)} className="flex-1 flex items-center gap-3 px-4 py-3 cursor-pointer bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm transition-all duration-300 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-secondary-400 to-primary-400 p-[2px]">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                   <div className="text-transparent bg-clip-text bg-gradient-to-tr from-secondary-600 to-primary-600 font-extrabold text-sm">
                     {getInitials()}
                   </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[14px] text-gray-900 dark:text-white truncate">
                {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Predinex User' : 'Loading...'}
              </p>
              <p className="text-[12px] font-medium text-gray-500 truncate group-hover:text-primary-600 transition-colors">
                View Profile
              </p>
            </div>
          </Link>
          <form action={logout} className="shrink-0">
            <button type="submit" title="Logout" className="p-3 bg-white/50 dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm transition-colors group/logout">
              <LogOut size={20} className="text-gray-400 group-hover/logout:text-red-500 transition-colors" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
