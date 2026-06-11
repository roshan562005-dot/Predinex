"use client";

import { useState } from "react";
import { Users, Heart, MessageCircle, Share2, Award, Search, Sparkles, Filter, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { getPosts, createPost, getUserProfile } from "@/app/(app)/actions";
import { useInclusivity } from "@/context/InclusivityContext";

const initialPosts = [
  {
    id: 1,
    author: "Sarah M.",
    role: "Community Mentor",
    avatar: "SM",
    time: "2 hours ago",
    tag: "Success Story",
    title: "Down 15lbs and my A1C dropped!",
    content: "Just got back from my 6-month checkup. My doctor was thrilled. Intermittent fasting and the daily 30-min brisk walks totally changed my trajectory. If you're struggling today, keep pushing. It gets easier!",
    likes: 124,
    comments: 18,
    isLiked: false,
  },
  {
    id: 2,
    author: "David R.",
    role: "Member",
    avatar: "DR",
    time: "5 hours ago",
    tag: "Advice Needed",
    title: "Struggling with late-night sugar cravings",
    content: "I do so well during the day, but right around 9 PM I get massive cravings for sugar. I’m trying to avoid ice cream. What are your go-to snacks that won't ruin my fasting blood sugar tomorrow morning?",
    likes: 45,
    comments: 32,
    isLiked: false,
  },
  {
    id: 3,
    author: "Elena G.",
    role: "Nutritionist",
    avatar: "EG",
    time: "1 day ago",
    tag: "Diet & Recipes",
    title: "5-Ingredient Low GI Breakfast Skillet",
    content: "Hey everyone! I wanted to share my go-to breakfast that keeps my blood sugar perfectly stable until lunch. You just need eggs, spinach, cherry tomatoes, feta, and a dash of olive oil. Takes 10 minutes!",
    likes: 312,
    comments: 56,
    isLiked: true,
  }
];

export default function CommunityPage() {
  const { t } = useInclusivity();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Topics");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("Discussion");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, u] = await Promise.all([getPosts(), getUserProfile()]);
        setPosts(p);
        setCurrentUser(u);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ["All Topics", "Success Story", "Advice Needed", "Diet & Recipes", "Motivation"];

  const filteredPosts = activeTab === "All Topics" 
    ? posts 
    : posts.filter(post => post.tag === activeTab);

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } 
        : post
    ));
  };

  const handlePostSubmit = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await createPost(newPostTitle, newPostContent, newPostTag);
      const updatedPosts = await getPosts();
      setPosts(updatedPosts);
      setIsComposeOpen(false);
      setNewPostTitle("");
      setNewPostContent("");
    } catch (e) {
      alert("Error posting discussion");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 md:pb-8 relative">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Premium 3D Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group relative w-full min-h-[400px] h-auto rounded-[3rem] overflow-hidden shadow-2xl dark:shadow-none border border-black/5 dark:border-white/10 cursor-default mb-8 flex flex-col justify-end p-8 md:p-14"
      >
        {/* 30-Background */}
        <img 
          src="/community_3d_v3.png" 
          alt="3D Glowing Network" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent dark:from-black dark:via-gray-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/50 to-transparent"></div>
        
        {/* Content */}
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full">
           <div className="max-w-2xl">
              <div className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg inline-flex items-center gap-2 mb-6 mt-16 md:mt-0">
                 <Users size={14} /> GLOBAL CONNECT
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-md leading-tight">
                {t("community_hub") || "Community Hub"}
              </h1>
              <p className="text-gray-300 md:text-xl font-medium leading-relaxed opacity-90 drop-shadow-sm line-clamp-2 md:line-clamp-none">
                {t("community_desc") || "You are not alone. Connect, share, and grow with a powerful global network dedicated to metabolic wellness and longevity."}
              </p>
           </div>
 
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0 flex items-center mb-2">
             <button 
               onClick={() => setIsComposeOpen(true)}
               className="relative inline-flex items-center justify-center gap-3 bg-white text-gray-900 border border-white/20 px-8 py-4 rounded-2xl font-black transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
             >
               <MessageCircle size={22} className="text-blue-500" />
               <span>{t("start_discussion") || "Start a Discussion"}</span>
             </button>
           </motion.div>
         </div>
      </motion.div>

      {/* Interactive Filter Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-gray-200/50 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto hide-scrollbar"
      >
        <div className="pl-3 pr-2 text-gray-400">
          <Filter size={18} />
        </div>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === category
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t(category.toLowerCase().replace(/ /g, "_").replace(/&/g, "and")) || category}
          </button>
        ))}
        
        <div className="ml-auto pl-4 border-l border-gray-200 relative hidden md:block">
          <Search size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder={t("search_discussions") || "Search discussions..."} 
            className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-64"
          />
        </div>
      </motion.div>

      {/* Feed */}
      <div className="space-y-6 relative z-10 perspective-1000">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              whileHover={{ rotateY: 3, rotateX: -2, scale: 1.01 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              key={post.id}
              className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-3xl rounded-3xl border border-white/60 dark:border-white/10 shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center font-extrabold text-primary-700 text-lg border border-primary-200/50 shadow-inner overflow-hidden relative">
                    <span className="relative z-10">
                      {post.profiles?.first_name?.[0] || post.author?.[0] || 'U'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/60"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-extrabold text-gray-900 dark:text-white text-base">
                        {post.profiles ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() : post.author}
                      </div>
                      {(post.role && post.role !== "Member") && (
                         <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider">
                           <Award size={10} /> {post.role}
                         </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5">
                      {new Date(post.created_at || post.time).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border flex items-center gap-1.5 uppercase tracking-wider ${
                    post.tag === "Success Story"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100/50"
                      : post.tag === "Advice Needed"
                      ? "bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100/50"
                      : "bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-100/50"
                  }`}
                >
                  {post.tag === "Success Story" && <Sparkles size={12} className="text-emerald-500" />}
                  {post.tag}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-primary-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8 font-medium">
                {post.content}
              </p>

              <div className="flex items-center gap-6 border-t border-gray-100 dark:border-white/5 pt-5">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-all ${
                    post.isLiked 
                      ? "bg-red-50 text-red-600 border border-red-100 shadow-sm" 
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Heart 
                    size={18} 
                    className={`transition-all ${post.isLiked ? "fill-red-500 scale-110" : ""}`} 
                  />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent px-4 py-2 rounded-xl transition-all font-bold text-sm">
                  <MessageCircle size={18} />
                  {post.comments}
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent px-4 py-2 rounded-xl transition-all font-bold text-sm ml-auto hidden sm:flex">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposeOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0c0f16] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-white/20 flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("create_discussion") || "Create a New Discussion"}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">V3.0 Global Connect Protocol</p>
                </div>
                <button
                  onClick={() => setIsComposeOpen(false)}
                  className="w-10 h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full text-gray-500 flex items-center justify-center transition-all border border-transparent dark:border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">{t("category") || "Category"}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                     {categories.filter(c => c !== 'All Topics').map(c => (
                       <button 
                         key={c}
                         onClick={() => setNewPostTag(c)}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newPostTag === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-400'}`}
                       >
                         {c}
                       </button>
                     ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">{t("title") || "Title"}</label>
                  <input 
                    type="text" 
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter a compelling title..." 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">{t("details") || "Details"}</label>
                  <textarea 
                    rows={6}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your story or ask a question..." 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-end gap-3">
                <button onClick={() => setIsComposeOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {t("cancel") || "Cancel"}
                </button>
                <button 
                  onClick={handlePostSubmit}
                  className="bg-emerald-600 text-white px-10 py-4 rounded-2xl text-sm font-black shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Send size={18} />
                  {t("post_discussion") || "Post Discussion"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
