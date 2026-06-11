"use client";

import { BookOpen, Video, PlayCircle, Filter, Sparkles, Clock, Lock, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useInclusivity } from "@/context/InclusivityContext";
import { getPremiumStatus } from "@/app/(app)/actions";
import { PaywallOverlay } from "@/components/PaywallOverlay";

const articles = [
  {
    title: "Understanding Insulin Resistance",
    category: "Science",
    readTime: "5 min",
    image: "/images/insulin.png",
    summary: "Explore how cells lose sensitivity to insulin and why this is a key driver of Type 2 Diabetes.",
  },
  {
    title: "How Sleep Quality Affects Blood Glucose",
    category: "Lifestyle",
    readTime: "4 min",
    image: "/images/sleep.png",
    summary: "Clinical evidence linking poor sleep patterns to elevated fasting glucose and cortisol levels.",
  },
  {
    title: "10 Low Glycaemic Index Food Swaps",
    category: "Nutrition",
    readTime: "7 min",
    image: "/images/low_gi.png",
    summary: "Practical dietary substitutions proven to reduce post-meal glucose spikes by up to 30%.",
  },
  {
    title: "Walking 30 Minutes a Day: The Clinical Evidence",
    category: "Exercise",
    readTime: "3 min",
    image: "/images/apple_health.png",
    summary: "How moderate daily walking lowers HbA1c, improves insulin sensitivity, and supports weight management.",
  },
  {
    title: "HbA1c Explained: Your 3-Month Glucose Average",
    category: "Science",
    readTime: "6 min",
    image: "/images/netflix_docu.png",
    summary: "What your HbA1c number means, target ranges for remission, and how lifestyle changes can reduce it.",
  },
  {
    title: "Stress, Cortisol & Blood Sugar — The Hidden Link",
    category: "Lifestyle",
    readTime: "8 min",
    image: "/images/futuristic_ui.png",
    summary: "Chronic stress triggers cortisol release, which directly elevates blood glucose — here is how to manage it.",
  },
];

export default function EducationPage() {
  const { t } = useInclusivity();
  const [activeCategory, setActiveCategory] = useState("All");
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [isPremium, setIsPremium] = useState(true); // default true to avoid flicker before load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPremium() {
      const status = await getPremiumStatus();
      setIsPremium(status);
      setLoading(false);
    }
    checkPremium();
  }, []);

  const categories = ["All", "Science", "Lifestyle", "Nutrition", "Exercise"];

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 md:pb-8 relative">
      <div className="absolute top-[-10%] right-[-20%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10"
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">
          {t("learn_prevent") || "Learn & Prevent"}
        </h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">
          {t("knowledge_def") || "Evidence-based health education to support your metabolic journey."}
        </p>
      </motion.div>

      {/* ─── PREMIUM CONTENT AREA ─── */}
      <div className="relative">
        {!loading && !isPremium && <PaywallOverlay />}

        {/* Featured Video — Coming Soon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden relative ${!isPremium ? 'opacity-30 blur-sm pointer-events-none select-none' : ''}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl mix-blend-overlay pointer-events-none" />
          <div className="h-80 w-full relative overflow-hidden">
            <img
              src="/ai-metabolic-video.png"
              alt="How Carbohydrates Impact Your Health"
              className="w-full h-full object-cover opacity-30 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Lock size={28} strokeWidth={1.5} className="text-white/80" />
              </div>
              <div className="text-center bg-black/40 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/5">
                <span className="inline-block bg-amber-500/90 text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg mb-3">
                  🎬 Available Soon
                </span>
                <p className="text-white text-sm font-semibold mt-3">
                  Our clinical video series is currently in production
                </p>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 z-10">
              <div className="flex gap-3 mb-3">
                <span className="bg-primary-500/80 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Sparkles size={12} /> {t("expert_curated") || "Expert Curated"}
                </span>
                <span className="bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-md border border-white/10 flex items-center gap-1.5">
                  <Video size={14} className="text-blue-400" /> 08:32
                </span>
              </div>
              <h2 className="text-3xl font-black text-white/70 mb-2 tracking-tight uppercase">
                {t("carb_impact_title") || "How Carbohydrates Impact Your Health"}
              </h2>
              <p className="text-gray-400 font-medium max-w-2xl line-clamp-1">
                {t("carb_impact_desc") || "Explore the biological journey of glucose and how it influences your energy and metabolic stability."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Notify Me Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative z-10 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-500/10 dark:to-blue-500/10 border border-primary-200 dark:border-primary-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${!isPremium ? 'opacity-30 blur-sm pointer-events-none select-none' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/30 shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white text-sm">Be the first to know</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Get notified when our clinical video library launches</p>
            </div>
          </div>
          <button
            onClick={() => setNotifyRequested(true)}
            className={`shrink-0 px-6 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all hover:scale-105 active:scale-95 ${
              notifyRequested
                ? "bg-green-500 text-white shadow-lg shadow-green-500/30 cursor-default"
                : "bg-gray-900 dark:bg-white dark:text-gray-900 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {notifyRequested ? "✓ You're on the list!" : "Notify Me"}
          </button>
        </motion.div>

        {/* Articles Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`relative z-10 ${!isPremium ? 'opacity-30 blur-sm pointer-events-none select-none' : ''}`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white tracking-tight">
              <BookOpen className="text-blue-500" /> {t("latest_insights") || "Clinical Articles"}
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
              <div className="mr-2 text-gray-400">
                <Filter size={18} />
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-gray-900 dark:bg-white dark:text-gray-900 text-white shadow-lg"
                      : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t(cat.toLowerCase()) || cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredArticles.map((article, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  key={article.title}
                  className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-white/10 shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col relative group"
                >
                  {/* Article image */}
                  <div className="h-52 w-full overflow-hidden relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Coming Soon Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                          <Lock size={20} className="text-white/70" />
                        </div>
                        <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-gray-900 dark:text-white border border-white/50 shadow-sm">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2 mb-4">
                      {article.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400 font-medium gap-1.5 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-md border border-gray-100 dark:border-white/10">
                        <Clock size={14} className="text-gray-400" /> {article.readTime}
                      </div>
                      <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                        Soon
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

