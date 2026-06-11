"use client";

import { useState, useEffect } from "react";
import { 
  Heart, 
  Droplets, 
  Activity, 
  Moon, 
  Monitor, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Plus, 
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  RotateCcw,
  User,
  Zap,
  Flame,
  UtensilsCrossed,
  X
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { 
  getUserProfile, 
  getHabitHistory, 
  getLatestAssessment, 
  upsertHabits, 
  updateUserProfile,
  getPosts, 
  clearHabitHistory 
} from "@/app/(app)/actions";
import { useInclusivity } from "@/context/InclusivityContext";
import MetabolicBioTwin from "@/components/dashboard/MetabolicBioTwin";
import BluetoothConnector from "@/components/dashboard/BluetoothConnector";

export default function Dashboard() {
  const { t } = useInclusivity();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [habits, setHabits] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [showNewsArchive, setShowNewsArchive] = useState(false);
  
  // Logging Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [activeLogType, setActiveLogType] = useState<'blood_sugar' | 'blood_pressure' | 'weight' | 'sleep_hours'>('blood_sugar');
  const [logValue, setLogValue] = useState('');
  
  // Action Plan State (Local)
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  
  // BMI Calculator State
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');

  // Chart State
  const [chartData, setChartData] = useState([
    { name: 'Mon', risk: 42, activity: 65 },
    { name: 'Tue', risk: 38, activity: 72 },
    { name: 'Wed', risk: 45, activity: 58 },
    { name: 'Thu', risk: 35, activity: 85 },
    { name: 'Fri', risk: 32, activity: 90 },
    { name: 'Sat', risk: 28, activity: 60 },
    { name: 'Sun', risk: 25, activity: 45 },
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [u, h_res, a, p] = await Promise.all([
          getUserProfile(),
          getHabitHistory(7),
          getLatestAssessment(),
          getPosts()
        ]);
        
        // Get today's date string
        const todayStr = new Date().toISOString().split('T')[0];
        const h = h_res?.find((habit: any) => habit.date === todayStr) || null;
        
        setCurrentUser(u);
        setHabits(h);
        setAssessment(a);
        setNews(p.filter((post: any) => post.tag === "Advice Needed" || post.tag === "Diet & Recipes"));
        
        if (u && !u.first_name) {
          setShowRegistration(true);
        }

        // Build dynamic chart data
        if (h_res) {
          const dynamicChartData = [];
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const habitDay = h_res.find((hd: any) => hd.date === dateStr);
            
            let activityScore = 40; // baseline
            let riskScore = 60; // baseline
            
            if (habitDay) {
              activityScore += (habitDay.workout_minutes || 0);
              if (habitDay.sleep_hours > 7) activityScore += 10;
              if (habitDay.water_glasses > 6) activityScore += 10;
              
              riskScore -= (habitDay.workout_minutes || 0) * 0.5;
              if (habitDay.blood_sugar && habitDay.blood_sugar > 140) riskScore += 20;
              if (habitDay.blood_pressure) {
                const sys = parseInt(habitDay.blood_pressure.split('/')[0]);
                if (sys > 130) riskScore += 15;
              }
            }
            
            dynamicChartData.push({
              name: days[d.getDay()],
              activity: Math.min(100, Math.max(0, activityScore)),
              risk: Math.min(100, Math.max(0, riskScore))
            });
          }
          setChartData(dynamicChartData);
        }
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({ first_name: formData.firstName, last_name: formData.lastName });
      const u = await getUserProfile();
      setCurrentUser(u);
      setShowRegistration(false);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (field: string) => {
    if (confirm(`Reset ${field.replace('_', ' ')}?`)) {
      await upsertHabits({ [field]: 0 });
      const h_res = await getHabitHistory(1);
      setHabits(h_res?.[0] || null);
    }
  };

  const openLogModal = (type: 'blood_sugar' | 'blood_pressure' | 'weight' | 'sleep_hours') => {
    setActiveLogType(type);
    setLogValue('');
    setShowLogModal(true);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {};
      if (activeLogType === 'blood_pressure') {
        payload[activeLogType] = logValue;
      } else {
        payload[activeLogType] = parseFloat(logValue) || 0;
      }
      await upsertHabits(payload);
      
      // Refresh local habits data
      const h_res = await getHabitHistory(1);
      setHabits(h_res?.[0] || null);
      
      setShowLogModal(false);
    } catch (err) {
      console.error("Failed to log data:", err);
      alert("Failed to log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (index: number) => {
    if (completedTasks.includes(index)) {
      setCompletedTasks(completedTasks.filter(i => i !== index));
    } else {
      setCompletedTasks([...completedTasks, index]);
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Clear all habit history? This cannot be undone.")) {
      await clearHabitHistory();
      const h_res = await getHabitHistory(1);
      setHabits(h_res?.[0] || null);
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(bmiHeight);
    const w = parseFloat(bmiWeight);
    if (!h || !w) return;

    let bmi = 0;
    if (bmiUnit === 'metric') {
      bmi = w / ((h / 100) * (h / 100));
    } else {
      bmi = (w / (h * h)) * 703;
    }
    setBmiResult(parseFloat(bmi.toFixed(1)));
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (bmi < 25) return { label: "Normal", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (bmi < 30) return { label: "Overweight", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Obese", color: "text-rose-500", bg: "bg-rose-500/10" };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={32} />
        </div>
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Loading Your Health Data...</p>
      </div>
    );
  }

  const isProfileComplete = currentUser?.first_name;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 md:pb-8 relative">
       <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none"></div>

       {/* Patient Health Overview Hero Section */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-center">
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-8"
             >
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl mb-6">
                   <Sparkles className="text-emerald-400" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Predinex · Scientifically Proven Programme</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter mb-6 uppercase">
                   Your <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500">Health Dashboard</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                   Monitor your metabolic health in real time. Track daily vitals, follow your personalised care plan, and measure your progress toward remission.
                </p>
             </motion.div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-[2.5rem] bg-white/40 dark:bg-gray-900/40 border border-gray-200/50 dark:border-white/5 hover:scale-[1.02] transition-all cursor-default group">
                   <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Programme Adherence</p>
                   <p className="text-3xl font-black text-gray-900 dark:text-white">98.2%</p>
                   <div className="h-1.5 w-full bg-gray-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]" />
                   </div>
                </div>
                <div className="glass-card p-6 rounded-[2.5rem] bg-white/40 dark:bg-gray-900/40 border border-gray-200/50 dark:border-white/5 hover:scale-[1.02] transition-all cursor-default group">
                   <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Health Record Status</p>
                   <p className="text-3xl font-black text-gray-900 dark:text-white">Active</p>
                   <div className="flex gap-1.5 mt-4">
                      {[1,2,3,4,5].map(i => <div key={i} className="h-1.5 flex-1 bg-blue-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                   </div>
                </div>
             </div>
          </div>
          
          <div className="lg:col-span-12 xl:col-span-5 flex justify-center">
             <MetabolicBioTwin score={assessment?.score || 5} habits={habits} />
          </div>
       </div>

       {/* Step 2: Diagnostic Cards - Dedicated Grid Row to avoid overlap */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {/* Glucose Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05, translateZ: 50 }}
          style={{ transformStyle: "preserve-3d" }}
          className="glass-card dark:bg-gray-900/40 p-8 rounded-[3rem] border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(30px)" }}>
             <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl shadow-lg shadow-red-500/5"><Droplets size={28} /></div>
             <div className="flex items-center gap-1.5">
               <button 
                 onClick={() => openLogModal('blood_sugar')} 
                 className="text-[10px] font-black bg-red-500 text-white px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
               >
                 Log Data
               </button>
             </div>
          </div>
          <div style={{ transform: "translateZ(60px)" }}>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
              {habits?.blood_sugar || '0'} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">mg/dL</span>
            </h3>
            <p className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 uppercase tracking-[0.3em]">{t("blood_sugar")}</p>
          </div>
        </motion.div>

        {/* BP Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          whileHover={{ rotateY: -10, rotateX: 5, scale: 1.05, translateZ: 50 }}
          style={{ transformStyle: "preserve-3d" }}
          className="glass-card dark:bg-gray-900/40 p-8 rounded-[3rem] border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(30px)" }}>
             <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl shadow-lg shadow-blue-500/5"><Activity size={28} /></div>
             <div className="flex items-center gap-1.5">
               <button 
                 onClick={() => openLogModal('blood_pressure')} 
                 className="text-[10px] font-black bg-blue-500 text-white px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
               >
                 Log Data
               </button>
             </div>
          </div>
          <div style={{ transform: "translateZ(60px)" }}>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
              {habits?.blood_pressure || '0/0'} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">mmHg</span>
            </h3>
            <p className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 uppercase tracking-[0.3em]">{t("blood_pressure")}</p>
          </div>
        </motion.div>

        {/* Weight Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05, translateZ: 50 }}
          style={{ transformStyle: "preserve-3d" }}
          className="glass-card dark:bg-gray-900/40 p-8 rounded-[3rem] border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(30px)" }}>
             <div className="p-4 bg-teal-500/10 text-teal-500 rounded-2xl shadow-lg shadow-teal-500/5"><Monitor size={28} /></div>
             <div className="flex items-center gap-1.5">
               <button 
                 onClick={() => openLogModal('weight')} 
                 className="text-[10px] font-black bg-teal-500 text-white px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform"
               >
                 Log Data
               </button>
             </div>
          </div>
          <div style={{ transform: "translateZ(60px)" }}>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
              {habits?.weight || '0'} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">kg</span>
            </h3>
            <p className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 uppercase tracking-[0.3em]">{t("weight")}</p>
          </div>
        </motion.div>

        {/* Sleep Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          whileHover={{ rotateY: -10, rotateX: -5, scale: 1.05, translateZ: 50 }}
          style={{ transformStyle: "preserve-3d" }}
          className="glass-card dark:bg-gray-900/40 p-8 rounded-[3rem] border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(30px)" }}>
             <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/5"><Moon size={28} /></div>
             <div className="flex items-center gap-1.5">
               <button 
                 onClick={() => openLogModal('sleep_hours')} 
                 className="text-[10px] font-black bg-indigo-500 text-white px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform"
               >
                 Log Data
               </button>
             </div>
          </div>
          <div style={{ transform: "translateZ(60px)" }}>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
              {habits?.sleep_hours || '0'} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">hrs</span>
            </h3>
            <p className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500 uppercase tracking-[0.3em]">{t("sleep")}</p>
          </div>
        </motion.div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT TWO COLUMNS (Main Content) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Main Visual Progress - 3D Card */}
          <motion.div 
            whileHover={{ rotateY: 3, rotateX: -2, scale: 1.01 }}
            className="bg-white dark:bg-gray-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{t("risk_projection")}</h2>
                  <p className="text-gray-500 font-medium">{t("habit_correlation")}</p>
                </div>
                <button 
                  onClick={handleClearHistory}
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm hover:scale-110 active:scale-95"
                  title={t("reset")}
                >
                  <RotateCcw size={18} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl">
                 <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> {t("risk_index")}</div>
                 <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span> {t("activity_level")}</div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                  <Area yAxisId="left" type="monotone" dataKey="risk" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                  <Area yAxisId="right" type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Actions / Today's Plan - 3D Card */}
          <motion.div 
            whileHover={{ rotateY: -3, rotateX: 2, scale: 1.01 }}
            className="bg-white dark:bg-gray-900/40 backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl relative"
          >
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl text-white shadow-lg shadow-primary-500/30">
                  <Heart size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("action_plan")}</h2>
                  <p className="text-sm font-semibold text-gray-500">{t("targeted_interventions")}</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { title: t("walk_task"), type: `${t("exercise")} • Blood Sugar Stabilization`, icon: Flame, color: "bg-orange-50 text-orange-500", borderColor: "border-primary-400" },
                { title: t("blood_sugar_task"), type: t("tracking"), icon: Droplets, color: "bg-red-50 text-red-500", borderColor: "border-gray-200" },
                { title: t("quinoa_task"), type: t("nutrition"), icon: UtensilsCrossed, color: "bg-green-50 text-green-500", borderColor: "border-gray-300" },
                { title: t("sleep_task"), type: t("lifestyle"), icon: Moon, color: "bg-indigo-50 text-indigo-500", borderColor: "border-gray-200" }
              ].map((task, i) => {
                const Icon = task.icon;
                const isCompleted = completedTasks.includes(i) || (i === 1 && !!habits?.blood_sugar) || (i === 3 && !!habits?.sleep_hours);
                return (
                  <div key={i} onClick={() => toggleTask(i)} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${task.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-base transition-colors ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{task.title}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{task.type}</p>
                      </div>
                    </div>
                    {isCompleted ? (
                      <div className="p-2 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 transition-all scale-100">
                        <Check size={18} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-400 transition-colors scale-100"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Premium BMI Calculator - 3D Card */}
          <motion.div 
            whileHover={{ rotateY: 3, rotateX: 2, scale: 1.01 }}
            className="bg-white dark:bg-gray-900/40 backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/10 overflow-hidden relative p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-teal-400 to-blue-600 rounded-[1.5rem] text-white shadow-xl shadow-teal-500/30">
                  <Activity size={28} />
                </div>
                 <div>
                   <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight uppercase">BMI Calculator</h2>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Body Mass Index Assessment</p>
                 </div>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5">
                <button onClick={() => setBmiUnit('metric')} className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${bmiUnit === 'metric' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Metric</button>
                <button onClick={() => setBmiUnit('imperial')} className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${bmiUnit === 'imperial' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Imperial</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">{t("height")} {bmiUnit === 'metric' ? '(cm)' : '(in)'}</label>
                  <input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl px-6 py-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20" placeholder={bmiUnit === 'metric' ? "175" : "69"} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">{t("weight")} {bmiUnit === 'metric' ? '(kg)' : '(lb)'}</label>
                  <input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl px-6 py-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20" placeholder={bmiUnit === 'metric' ? "75" : "165"} />
                </div>
                <button onClick={calculateBMI} className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs">{t("calculate_index")}</button>
              </div>
              
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 opacity-50"></div>
                {bmiResult ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Your BMI</p>
                    <div className="text-7xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">{bmiResult}</div>
                    <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest inline-block ${getBmiCategory(bmiResult).bg} ${getBmiCategory(bmiResult).color}`}>
                      {getBmiCategory(bmiResult).label}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <TrendingUp size={48} className="text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enter Data to Compute</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (News & Analytics) */}
        <div className="space-y-8">
           <div className="glass-card dark:bg-gray-900/40 p-8 rounded-[3rem] border border-white/50 dark:border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                   <BookOpen size={24} className="text-secondary-500" /> {t("habits_insight")}
                </h2>
                <button 
                  onClick={() => setShowNewsArchive(true)}
                  className="text-xs font-black text-secondary-500 uppercase tracking-[0.2em] hover:text-secondary-600 transition-colors"
                >
                  History
                </button>
              </div>

              <div className="space-y-6">
                {news.slice(0, 3).map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => setSelectedArticle(item)}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-secondary-300 dark:hover:border-secondary-800 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-secondary-600 bg-secondary-50 dark:bg-secondary-500/10 px-2 py-1 rounded-lg border border-secondary-200/50">{item.source}</span>
                       <span className="text-[10px] text-gray-400 font-bold">{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Today'}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-secondary-600 transition-colors line-clamp-2">{item.title}</h3>
                  </motion.div>
                ))}
              </div>
             <BluetoothConnector />

            {/* Performance Widget */}
            <div className="glass-card dark:bg-gray-900/40 p-8 rounded-[3rem] border border-white/50 dark:border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
               <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">Health Record Status</h2>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        <span>Database integrity</span>
                        <span>OK</span>
                     </div>
                     <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-full animate-pulse" />
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        <span>Identity Proofing</span>
                        <span>Complete</span>
                     </div>
                     <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[95%]" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
        </div>
      </div>
      {/* Profile Incomplete Banner */}
      <AnimatePresence>
        {!isProfileComplete && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-6 right-6 md:left-auto md:right-12 md:w-96 z-40"
          >
            <div className="bg-gray-900 dark:bg-[#0c0f16] text-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700"><AlertCircle size={100} /></div>
              <h3 className="text-xl font-black mb-2 flex items-center gap-3"><AlertCircle className="text-amber-500" /> {t("profile_incomplete")}</h3>
              <p className="text-sm font-medium text-gray-400 mb-6 leading-relaxed">{t("profile_prompt")}</p>
              <button 
                onClick={() => setShowRegistration(true)}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
               >
                 Complete My Profile
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vitals Logging Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl cursor-pointer" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#0c0f16] rounded-[3rem] p-8 md:p-12 w-full max-w-sm relative z-10 border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.5)] text-center"
            >
               <button onClick={() => setShowLogModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <X size={20} className="text-gray-500" />
               </button>
               
               <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${
                 activeLogType === 'blood_sugar' ? 'bg-red-500/10 text-red-500' :
                 activeLogType === 'blood_pressure' ? 'bg-blue-500/10 text-blue-500' :
                 activeLogType === 'weight' ? 'bg-teal-500/10 text-teal-500' :
                 'bg-indigo-500/10 text-indigo-500'
               }`}>
                 {activeLogType === 'blood_sugar' && <Droplets size={32} />}
                 {activeLogType === 'blood_pressure' && <Activity size={32} />}
                 {activeLogType === 'weight' && <Monitor size={32} />}
                 {activeLogType === 'sleep_hours' && <Moon size={32} />}
               </div>
               
               <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Log Data</h2>
               <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 uppercase tracking-widest text-[10px]">Today's Vitals Tracking</p>
               
               <form onSubmit={handleLogSubmit} className="space-y-6">
                 <div>
                   <input 
                     required 
                     type={activeLogType === 'blood_pressure' ? 'text' : 'number'}
                     step={activeLogType === 'weight' || activeLogType === 'sleep_hours' ? '0.1' : '1'}
                     value={logValue} 
                     onChange={e => setLogValue(e.target.value)} 
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-center text-4xl font-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-300" 
                     placeholder={
                       activeLogType === 'blood_sugar' ? '110' :
                       activeLogType === 'blood_pressure' ? '120/80' :
                       activeLogType === 'weight' ? '70.5' :
                       '7.5'
                     } 
                   />
                   <p className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">
                     {activeLogType === 'blood_sugar' && 'mg/dL'}
                     {activeLogType === 'blood_pressure' && 'mmHg'}
                     {activeLogType === 'weight' && 'kg'}
                     {activeLogType === 'sleep_hours' && 'Hours'}
                   </p>
                 </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black py-4 rounded-3xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm mt-4">
                    Save Record
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegistration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRegistration(false)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl cursor-pointer" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#0c0f16] rounded-[3rem] p-8 md:p-12 w-full max-w-xl relative z-10 border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
            >
               <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">{t("clinical_identity")}</h2>
               <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 uppercase tracking-widest text-[10px]">{t("identity_verification_desc")}</p>
               
               <form onSubmit={handleRegistration} className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">{t("first_name")}</label>
                   <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" placeholder="John" />
                 </div>
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">{t("last_name")}</label>
                   <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" placeholder="Doe" />
                 </div>
                  <button type="submit" className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black py-5 rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm mt-4">
                    Save & Continue
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => setSelectedArticle(null)} />
            <motion.div className="w-full max-w-3xl bg-white dark:bg-[#0c0f16] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 max-h-[85vh] flex flex-col border border-white/10">
              <div className="h-32 bg-gradient-to-br from-secondary-400 to-secondary-600 relative shrink-0">
                  <button onClick={() => setSelectedArticle(null)} className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex justify-center text-white items-center hover:bg-black/40 border border-white/20 transition-all"><X size={24} /></button>
              </div>
              <div className="p-8 sm:p-12 overflow-y-auto flex-1">
                 <div className="flex gap-3 mb-6">
                    <span className="bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 font-black text-[10px] px-3 py-1.5 rounded-lg border border-secondary-200/50 uppercase tracking-widest">{selectedArticle.source}</span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> {selectedArticle.pubDate ? new Date(selectedArticle.pubDate).toLocaleDateString() : 'Recent'}</span>
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-8 tracking-tighter">{selectedArticle.title}</h2>
                 <div className="prose prose-lg dark:prose-invert max-w-none text-[18px] leading-relaxed font-medium text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.description || 'No content.' }} />
                 <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <button onClick={() => setSelectedArticle(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-colors">Close Reader</button>
                    <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer" className="bg-secondary-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-secondary-500/20">Source <ChevronRight size={16}/></a>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* News Archive Modal */}
      <AnimatePresence>
        {showNewsArchive && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => setShowNewsArchive(false)} />
            <motion.div className="w-full max-w-2xl bg-white dark:bg-[#0c0f16] rounded-[3rem] overflow-hidden relative z-10 max-h-[80vh] flex flex-col border border-white/10 shadow-3xl">
              <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5 backdrop-blur-xl">
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3"><BookOpen size={24} className="text-secondary-500" /> Community Health Posts</h2>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Patient Tips & Advice</p>
                 </div>
                 <button onClick={() => setShowNewsArchive(false)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 flex justify-center items-center transition-all border border-transparent dark:border-white/10"><X size={20} /></button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 hide-scrollbar">
                 <div className="space-y-4">
                   {news.map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ x: 10, scale: 1.02 }}
                        onClick={() => { setSelectedArticle(item); setShowNewsArchive(false); }} 
                        className="p-6 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-secondary-500 cursor-pointer bg-white dark:bg-white/5 group transition-all"
                      >
                         <div className="flex justify-between items-start gap-4 mb-3">
                            <span className="text-[10px] font-black text-secondary-600 uppercase bg-secondary-50 dark:bg-secondary-500/10 px-3 py-1.5 rounded-lg border border-secondary-200/50 tracking-widest">{item.source}</span>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Recent'}</span>
                         </div>
                         <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 leading-snug group-hover:text-secondary-600 transition-colors">{item.title}</h3>
                      </motion.div>
                   ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
