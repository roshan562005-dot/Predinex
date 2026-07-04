"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  HeartPulse, 
  Droplets, 
  Zap, 
  Wifi, 
  ShieldCheck, 
  Server,
  RefreshCw,
  Cpu,
  Lock,
  Binary
} from "lucide-react";

// Simulated Data Generators
const generateData = (base: number, variance: number) => base + (Math.random() * variance * 2 - variance);

export default function TelemetryDashboard() {
  const [isSyncing, setIsSyncing] = useState(true);
  const [dataStream, setDataStream] = useState<any[]>([]);
  const [connectionQuality, setConnectionQuality] = useState(99.9);
  const [simulationMode, setSimulationMode] = useState<'normal' | 'spike' | 'fasting' | 'phone_sensors'>('normal');
  
  // Simulated Live Metrics
  const [metrics, setMetrics] = useState({
    hrv: 65,
    glucose: 92,
    cortisol: 12.4,
    spO2: 98,
    temp: 36.6
  });

  useEffect(() => {
    // Simulate real-time synchronization
    const interval = setInterval(() => {
      setMetrics(prev => {
        let targetHrv = 65;
        let targetGlucose = 92;
        let targetCortisol = 12.4;
        let targetSpO2 = 98;
        let targetTemp = 36.6;

        if (simulationMode === 'spike') {
          targetHrv = 45; // stress goes up (hrv down)
          targetGlucose = 165; // glucose spikes
          targetCortisol = 18.5; // cortisol spikes
          targetTemp = 37.1; // temp slightly up
        } else if (simulationMode === 'fasting') {
          targetHrv = 75; // relaxed
          targetGlucose = 82; // low glucose
          targetCortisol = 9.8; // low stress
          targetSpO2 = 99;
        } else if (simulationMode === 'phone_sensors') {
          targetHrv = 70; // active recovery
          targetGlucose = 88; // stable blood sugar from walking
          targetCortisol = 10.5; // lowered stress from activity
          targetSpO2 = 99; 
        }

        return {
          hrv: parseFloat((prev.hrv + (targetHrv - prev.hrv) * 0.1 + (Math.random() * 4 - 2)).toFixed(1)),
          glucose: parseFloat((prev.glucose + (targetGlucose - prev.glucose) * 0.1 + (Math.random() * 3 - 1.5)).toFixed(1)),
          cortisol: parseFloat((prev.cortisol + (targetCortisol - prev.cortisol) * 0.1 + (Math.random() * 0.4 - 0.2)).toFixed(2)),
          spO2: Math.min(100, Math.max(90, Math.round(prev.spO2 + (targetSpO2 - prev.spO2) * 0.1 + (Math.random() - 0.5)))),
          temp: parseFloat((prev.temp + (targetTemp - prev.temp) * 0.1 + (Math.random() * 0.1 - 0.05)).toFixed(2))
        };
      });

      setDataStream(prev => {
        const newStream = [...prev, { time: new Date().toISOString(), value: generateData(50, 20) }];
        if (newStream.length > 30) newStream.shift();
        return newStream;
      });

      if (Math.random() > 0.95) {
        setConnectionQuality(prev => Math.max(85, prev - Math.random() * 5));
      } else if (connectionQuality < 99.9) {
        setConnectionQuality(prev => Math.min(99.9, prev + Math.random() * 2));
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [connectionQuality, simulationMode]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 text-white relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#060b14] -m-8 md:-m-12 min-h-[120vh] -z-20"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-4">
            <Activity className="text-blue-400" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Zero Error Protocol Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white mb-2">
            Metabolic <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Telemetry Sync</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-lg text-sm">
            Real-time synchronization and dynamic bio-feedback visualization. Data streams are cryptographically secured and processed with sub-millisecond latency.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Signal Integrity</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">{connectionQuality.toFixed(1)}%</span>
              <Wifi className={connectionQuality > 95 ? "text-green-400" : "text-amber-400"} size={20} />
            </div>
          </div>
          <div className="w-[1px] h-10 bg-white/10 mx-2"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Stream Status</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Main Bio-Feedback Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                <Binary className="text-teal-400" size={20}/> Dynamic Bio-Feedback
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                {simulationMode === 'spike' ? (
                  <span className="text-red-400 animate-pulse flex items-center gap-2"><Lock size={12}/> METABOLIC SHOCK DETECTED</span>
                ) : simulationMode === 'phone_sensors' ? (
                  <span className="text-indigo-400 animate-pulse flex items-center gap-2"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> SYNCING VIA APPLE HEALTH / GOOGLE FIT</span>
                ) : (
                  "Multi-modal sensory synthesis"
                )}
              </p>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setSimulationMode('phone_sensors')} className={`border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 ${simulationMode === 'phone_sensors' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> Phone Sync
               </button>
               <button onClick={() => setSimulationMode('fasting')} className={`border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${simulationMode === 'fasting' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>Fasting</button>
               <button onClick={() => setSimulationMode('normal')} className={`border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${simulationMode === 'normal' ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>Normal</button>
               <button onClick={() => setSimulationMode('spike')} className={`border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${simulationMode === 'spike' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>Simulate Spike</button>
            </div>
          </div>

          <div className="relative h-[350px] w-full flex items-center justify-center perspective-[1000px]">
             {/* Holographic Centerpiece */}
             <motion.div 
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-48 h-48 transform-style-3d"
             >
                {/* Core Sphere */}
                <div className="absolute inset-0 rounded-full border-2 border-teal-500/30 shadow-[0_0_40px_rgba(45,212,191,0.2)]"></div>
                <div className="absolute inset-4 rounded-full border border-blue-500/40 rotate-45"></div>
                <div className="absolute inset-8 rounded-full border border-indigo-500/50 -rotate-45"></div>
                
                {/* Glowing Core */}
                <div className="absolute inset-[30%] bg-gradient-to-tr from-teal-400 to-blue-500 rounded-full blur-[20px] animate-pulse"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                   <Activity className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" size={40} />
                </div>

                {/* Orbiting Elements */}
                <motion.div 
                  animate={{ rotateZ: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-8 border border-white/5 rounded-full"
                >
                   <div className="absolute top-0 left-1/2 w-3 h-3 bg-teal-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(45,212,191,0.8)]"></div>
                </motion.div>
                
                <motion.div 
                  animate={{ rotateZ: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-16 border border-white/5 rounded-full"
                >
                   <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2 translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                </motion.div>
             </motion.div>

             {/* Live Data Overlays */}
             <div className="absolute left-0 top-1/4 bg-[#060b14]/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl max-w-[140px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">HRV Index</p>
                <div className="text-2xl font-black text-white">{metrics.hrv}<span className="text-xs ml-1 text-teal-400">ms</span></div>
             </div>

             <div className="absolute right-0 bottom-1/4 bg-[#060b14]/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl max-w-[140px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Glucose Var</p>
                <div className="text-2xl font-black text-white">{metrics.glucose}<span className="text-xs ml-1 text-blue-400">mg/dL</span></div>
             </div>
          </div>
          
          {/* Data Stream Ticker */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-black/40 border-t border-white/5 flex items-center px-6 overflow-hidden">
             <div className="flex gap-8 whitespace-nowrap opacity-50 font-mono text-[10px] text-teal-400 tracking-widest">
               {dataStream.map((d, i) => (
                 <span key={i}>0x{Math.floor(d.value * 1000).toString(16).toUpperCase()}</span>
               ))}
             </div>
          </div>
        </motion.div>

        {/* Telemetry Matrix Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          {/* Node Status */}
          <div className="bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Server size={80}/></div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <Cpu size={14} className="text-blue-400"/> System Diagnostics
            </h3>
            
            <div className="space-y-5">
              {[
                { label: "Neural Engine", val: "Optimal", color: "text-green-400" },
                { label: "Sync Latency", val: "12ms", color: "text-teal-400" },
                { label: "Data Integrity", val: "100%", color: "text-blue-400" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.label}</span>
                  <span className={`text-sm font-black tracking-wider ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Vitals Grid */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {[
              { icon: HeartPulse, label: "Heart Rate", val: Math.round(metrics.hrv * 1.2), unit: "bpm", color: "text-red-400", bg: "bg-red-500/10" },
              { icon: Droplets, label: "SpO2 Level", val: metrics.spO2, unit: "%", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Zap, label: "Cortisol", val: metrics.cortisol, unit: "ug/dL", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: ShieldCheck, label: "Temp", val: metrics.temp, unit: "°C", color: "text-emerald-400", bg: "bg-emerald-500/10" },
            ].map((v, i) => (
              <div key={i} className="bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 hover:bg-white/5 transition-colors">
                <div className={`w-8 h-8 rounded-lg ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon size={16} className={v.color} />
                </div>
                <div className="text-xl font-black text-white">{v.val}<span className="text-[10px] ml-1 text-gray-500">{v.unit}</span></div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-1">{v.label}</div>
              </div>
            ))}
          </div>
          
          {/* Zero Error Protocol Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-[1.5rem] p-5 shadow-[0_0_30px_rgba(45,212,191,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="text-white" size={20} />
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Encrypted Sync</h4>
                <p className="text-[9px] font-bold text-white/70 uppercase tracking-wider">AES-256 E2E Security</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
