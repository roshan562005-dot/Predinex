"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Flame,
  TrendingDown,
  TrendingUp,
  Plus,
  Droplet,
  Scale,
  GlassWater,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { getHabitHistory, upsertHabits } from "@/app/(app)/actions";
import ProgressExportButton from "@/components/ProgressExportButton";
import { useInclusivity } from "@/context/InclusivityContext";

const weightData = [
  { date: "Mar 1", weight: 185 },
  { date: "Mar 4", weight: 184.2 },
  { date: "Mar 7", weight: 183.8 },
  { date: "Mar 10", weight: 183.1 },
  { date: "Mar 14", weight: 182.0 },
];

const bloodSugarData = [
  { date: "Mon", fasting: 112, postMeal: 145 },
  { date: "Tue", fasting: 108, postMeal: 138 },
  { date: "Wed", fasting: 110, postMeal: 142 },
  { date: "Thu", fasting: 105, postMeal: 135 },
  { date: "Fri", fasting: 106, postMeal: 130 },
  { date: "Sat", fasting: 102, postMeal: 128 },
  { date: "Sun", fasting: 105, postMeal: 132 },
];

export default function ProgressPage() {
  const { t } = useInclusivity();
  const [activeTab, setActiveTab] = useState("bloodsugar");
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState<"bloodSugar" | "weight" | "water" | "steps">("bloodSugar");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHabitHistory(30);
        setHistory(data);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (logType === 'bloodSugar') {
        await upsertHabits({ 
          date, 
          blood_sugar: parseFloat(val1) || undefined 
        });
      } else if (logType === 'weight') {
        await upsertHabits({ 
          date, 
          weight: parseFloat(val1) || undefined 
        });
      } else if (logType === 'water') {
        await upsertHabits({ 
          date, 
          water_ml: (parseFloat(val1) || 0) * 250
        });
      } else if (logType === 'steps') {
        await upsertHabits({
          date,
          steps: parseInt(val1) || undefined
        });
      }
      // Refresh
      const data = await getHabitHistory(30);
      setHistory(data);
      setShowLogModal(false);
      setVal1("");
      setVal2("");
    } catch (e) {
      alert("Error saving data");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Format Chart Data
  const chartData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: h.weight,
    blood_sugar: h.blood_sugar,
    steps: h.steps,
    water: h.water_ml / 250 // Convert ml to glasses (approx)
  }));

  const todayHabits = history.find(h => h.date === new Date().toISOString().split('T')[0]) || {};

  // Compute Streak
  const todayStr = new Date().toISOString().split('T')[0];
  let currentStreak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = history.find(h => h.date === dateStr);
    
    const active = log && (log.steps || log.blood_sugar || log.weight || log.water_ml || log.mindfulness_mins);
    if (active) {
      currentStreak++;
    } else if (dateStr !== todayStr) {
      break;
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-8 selection:bg-emerald-500/30 text-gray-900 dark:text-white">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {t("monthly_overview") || "Your Progress Analytics"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
            {t("consistency_desc") || "Consistency is key. See how your habits are improving your health."}
          </p>
        </div>
        <ProgressExportButton history={history} />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto hide-scrollbar pb-px">
        <button
          onClick={() => setActiveTab("bloodsugar")}
          className={`pb-3 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === "bloodsugar"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700"
          }`}
        >
          Blood Sugar
        </button>
        <button
          onClick={() => setActiveTab("weight")}
          className={`pb-3 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === "weight"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700"
          }`}
        >
          Weight
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`pb-3 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === "activity"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700"
          }`}
        >
          Activity & Steps
        </button>
      </div>

      {/* Chart Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#11141d] p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {activeTab === "bloodsugar" && "Weekly Glucose Levels"}
              {activeTab === "weight" && "Weight Journey"}
              {activeTab === "activity" && "Weekly Activity"}
            </h2>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
              {activeTab === "bloodsugar" && "Fasting vs Post-Meal (mg/dL)"}
              {activeTab === "weight" && "Last 30 days trend (lbs)"}
              {activeTab === "activity" && "Daily step count & active minutes"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 border shadow-sm ${
              activeTab === "weight" || activeTab === "bloodsugar"
                ? "bg-green-50 text-green-700 border-green-200 shadow-green-500/10"
                : "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-500/10"
            }`}>
              {activeTab === "activity" ? <TrendingUp size={16} /> : <TrendingDown size={16} />} 
              {activeTab === "activity" ? "Increasing" : "Improving"}
            </div>
            
            <button 
              onClick={() => { 
                setLogType(activeTab === "weight" ? "weight" : activeTab === "activity" ? "steps" : "bloodSugar"); 
                setShowLogModal(true); 
              }}
              className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Plus size={16} /> Log Data
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "bloodsugar" ? (
              <LineChart
                data={chartData.filter(d => d.blood_sugar)}
                margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  domain={[80, 160]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(17, 20, 29, 0.8)",
                    backdropFilter: "blur(8px)",
                    color: "#fff"
                  }}
                  itemStyle={{ fontWeight: 500 }}
                  labelStyle={{ color: "#9CA3AF", marginBottom: "4px" }}
                />
                <Line
                  type="monotone"
                  dataKey="blood_sugar"
                  name="Glucose (mg/dL)"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : activeTab === "weight" ? (
              <LineChart
                data={chartData.filter(d => d.weight)}
                margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(17, 20, 29, 0.8)",
                    backdropFilter: "blur(8px)",
                    color: "#fff"
                  }}
                  itemStyle={{ fontWeight: 500 }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (lbs)"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={chartData.filter(d => d.steps)}
                margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(17, 20, 29, 0.8)",
                    backdropFilter: "blur(8px)",
                    color: "#fff"
                  }}
                />
                <Bar
                  dataKey="steps"
                  name="Steps"
                  fill="#F97316"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goals Progress */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#11141d] p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        >
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2 tracking-tight">
            <Flame className="text-orange-500 drop-shadow-md animate-pulse" size={24} /> Daily Clinical Goals
          </h3>

          <div className="space-y-6">
            <div className="group">
              <div className="flex justify-between text-sm mb-2.5">
                <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors">Steps Tracked</span>
                <span className="text-gray-500 font-bold">{todayHabits.steps?.toLocaleString() || 0} <span className="text-gray-400 font-medium">/ 8,000</span></span>
              </div>
              <div className="h-3 w-full bg-gray-100/80 dark:bg-black/30 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((todayHabits.steps || 0) / 8000) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                ></motion.div>
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between text-sm mb-2.5">
                <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors">Active Minutes</span>
                <span className="text-gray-500 font-bold">{Math.round((todayHabits.steps || 0) / 100)} <span className="text-gray-400 font-medium">/ 30 min</span></span>
              </div>
              <div className="h-3 w-full bg-gray-100/80 dark:bg-black/30 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((((todayHabits.steps || 0) / 100) / 30) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                ></motion.div>
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between text-sm mb-2.5">
                <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">Water Intake</span>
                <span className="text-gray-500 font-bold">{Math.round((todayHabits.water_ml || 0) / 250)} <span className="text-gray-400 font-medium">/ 8 gl</span></span>
              </div>
              <div className="h-3 w-full bg-gray-100/80 dark:bg-black/30 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((((todayHabits.water_ml || 0) / 250) / 8) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                   className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Milestone */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center group transition-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-black/80"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/40 transition-colors"></div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 text-4xl mb-6 ring-4 ring-white/10"
          >
            🏆
          </motion.div>
          <h3 className="font-black text-2xl text-white mb-3 tracking-tight">
            {currentStreak} Day Streak!
          </h3>
          <p className="text-indigo-100 mb-8 text-sm max-w-xs leading-relaxed font-medium">
            You&apos;ve meticulously tracked your health data for {currentStreak || "a few"} consecutive days. Predinex is proud of your consistency!
          </p>
          <button className="px-6 py-3 bg-white text-indigo-900 text-sm font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg relative z-10 w-full sm:w-auto">
            Share Achievement
          </button>
        </motion.div>
      </div>

      {/* Log Data Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#11141d] rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden border dark:border-white/10"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Log {logType === "bloodSugar" ? "Blood Sugar" : logType === "weight" ? "Weight" : logType === "steps" ? "Steps" : "Water"}
                  </h3>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${logType === "bloodSugar" ? "bg-red-50 text-red-500 dark:bg-red-500/10" : logType === "water" ? "bg-cyan-50 text-cyan-500 dark:bg-cyan-500/10" : "bg-blue-50 text-blue-500 dark:bg-blue-500/10"}`}>
                    {logType === "bloodSugar" ? <Droplet size={20} /> : logType === "water" ? <GlassWater size={20} /> : <Scale size={20} />}
                  </div>
                </div>
                
                <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setLogType("bloodSugar")}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                        logType === "bloodSugar" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                      }`}
                    >
                      Glucose
                    </button>
                    <button 
                      onClick={() => setLogType("weight")}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                        logType === "weight" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                      }`}
                    >
                      Weight
                    </button>
                    <button 
                      onClick={() => setLogType("water")}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                        logType === "water" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                      }`}
                    >
                      Water
                    </button>
                    <button 
                      onClick={() => setLogType("steps")}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                        logType === "steps" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                      }`}
                    >
                      Steps
                    </button>
                  </div>

                <div className="space-y-5">
                  {logType === "bloodSugar" ? (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Glucose Level (mg/dL)</label>
                      <input 
                        type="number" 
                        value={val1}
                        onChange={(e) => setVal1(e.target.value)}
                        placeholder="e.g. 102" 
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium transition-shadow dark:text-white" 
                      />
                    </div>
                  ) : logType === "weight" ? (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Weight (lbs)</label>
                      <input 
                        type="number" 
                        value={val1}
                        onChange={(e) => setVal1(e.target.value)}
                        placeholder="e.g. 182.5" 
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium transition-shadow dark:text-white" 
                      />
                    </div>
                  ) : logType === "steps" ? (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Steps Count</label>
                      <input 
                        type="number" 
                        value={val1}
                        onChange={(e) => setVal1(e.target.value)}
                        placeholder="e.g. 7500" 
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium transition-shadow dark:text-white" 
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Glasses of Water (approx 250ml each)</label>
                      <input 
                        type="number" 
                        value={val1}
                        onChange={(e) => setVal1(e.target.value)}
                        placeholder="e.g. 8" 
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium transition-shadow dark:text-white" 
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium text-gray-600 dark:text-gray-300 transition-shadow" 
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={() => setShowLogModal(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-300 text-gray-700 font-bold rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-gray-900 dark:bg-emerald-500 hover:bg-black dark:hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Entry"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
