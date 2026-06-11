"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, CheckCircle, Mic, MicOff, Globe, ChevronDown, AlertTriangle, Brain, Heart, Activity, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { LANGUAGES, CHAPTERS, TOTAL_DURATION, chapterStart, type LangConfig } from "./lectureData";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const TT = { contentStyle: { background: "#0c1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff", fontSize: 12 } };

// ── Shared animation helpers ──────────────────────────────────────────────────
const fadeUp = (d = 0) => ({ initial: { y: 24, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: d, duration: 0.5 } });
const fadeIn = (d = 0) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d, duration: 0.45 } });
const slideL = (d = 0) => ({ initial: { x: -28, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { delay: d, duration: 0.45 } });

function RevealHeading({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span key={i} className="inline-block mr-[0.25em]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.06 + i * 0.05, duration: 0.42 }}>
          {w}
        </motion.span>
      ))}
    </span>
  );
}

function ChLabel({ n, sub }: { n: number; sub: string }) {
  return (
    <motion.div {...fadeIn(0)} className="flex items-center gap-2 mb-1.5">
      <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">Chapter {String(n).padStart(2, "0")}</span>
      <span className="w-6 h-px bg-teal-500/40" />
      <span className="text-gray-600 text-[10px] uppercase tracking-wider">{sub}</span>
    </motion.div>
  );
}

function Orb({ pos }: { pos: "tr" | "bl" }) {
  return <div className={`absolute pointer-events-none rounded-full blur-[90px] w-64 h-64 ${pos === "tr" ? "top-[-15%] right-[-10%] bg-teal-500/8" : "bottom-[-15%] left-[-10%] bg-blue-500/8"}`} />;
}

// ── Chart Data ────────────────────────────────────────────────────────────────
const bloodSugarData = [
  { t: "0",    s: 80,  c: 80,  o: 80  },
  { t: "15m",  s: 138, c: 92,  o: 83  },
  { t: "30m",  s: 174, c: 108, o: 88  },
  { t: "45m",  s: 178, c: 118, o: 91  },
  { t: "60m",  s: 148, c: 120, o: 89  },
  { t: "90m",  s: 88,  c: 113, o: 86  },
  { t: "120m", s: 68,  c: 104, o: 84  },
  { t: "180m", s: 80,  c: 87,  o: 82  },
];
const giData = [
  { food: "White Bread", gi: 75, fill: "#ef4444" },
  { food: "White Rice",  gi: 72, fill: "#f97316" },
  { food: "Sugar",       gi: 65, fill: "#f97316" },
  { food: "Oats",        gi: 55, fill: "#eab308" },
  { food: "Sweet Potato",gi: 44, fill: "#22c55e" },
  { food: "Lentils",     gi: 32, fill: "#14b8a6" },
  { food: "Broccoli",    gi: 10, fill: "#06b6d4" },
];
const radarData = [
  { s: "Energy",     smart: 90, poor: 38 },
  { s: "Insulin",    smart: 85, poor: 33 },
  { s: "Weight",     smart: 80, poor: 28 },
  { s: "Brain",      smart: 88, poor: 44 },
  { s: "Gut Health", smart: 92, poor: 22 },
  { s: "Inflamm.",   smart: 75, poor: 18 },
];

// ── Slides ────────────────────────────────────────────────────────────────────
function Slide0() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center px-10 gap-7 overflow-hidden">
      <Orb pos="tr" /><Orb pos="bl" />
      <motion.div {...fadeUp(0.05)}>
        <motion.div animate={{ boxShadow: ["0 0 30px #14b8a630","0 0 60px #14b8a640","0 0 30px #14b8a630"] }} transition={{ duration: 3.5, repeat: Infinity }}
          className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-6xl ring-4 ring-teal-500/20">🔬</motion.div>
      </motion.div>
      <div>
        <motion.p {...fadeIn(0.18)} className="text-teal-400 font-bold text-xs uppercase tracking-[0.25em] mb-3">Prednix Lecture Series · Episode 01</motion.p>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1]">
          <RevealHeading text="How Carbohydrates" /><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
            <RevealHeading text="Impact Your Health" />
          </span>
        </h1>
      </div>
      <motion.p {...fadeUp(0.38)} className="text-gray-300 text-base max-w-md leading-relaxed">
        The complete biological journey of glucose — from the food on your plate to your cells, blood vessels, and long-term metabolic health.
      </motion.p>
      <motion.div {...fadeIn(0.52)} className="flex flex-wrap gap-2.5 justify-center">
        {["7 Chapters","Evidence-Based","6:33 mins","Voice-Guided"].map(t=>(
          <motion.span key={t} whileHover={{ scale:1.06 }} className="bg-white/8 border border-white/12 text-gray-300 text-xs font-semibold px-4 py-2 rounded-full">{t}</motion.span>
        ))}
      </motion.div>
    </div>
  );
}

function Slide1() {
  const types = [
    { name:"Simple Carbs",  icon:"⚡", tag:"High Risk",   facts:["Fast-digesting sugars","Blood sugar spikes rapidly","Energy crash follows"],   eg:"Candy · White bread · Soda",       bdr:"border-red-500/30",    bg:"bg-red-900/18",   badge:"bg-red-500/18 text-red-300",    mol:2 },
    { name:"Complex Carbs", icon:"🌾", tag:"Moderate",    facts:["Long starch chains","Slower energy release","More sustained fuel"],             eg:"Brown rice · Oats · Legumes",      bdr:"border-yellow-500/25", bg:"bg-yellow-900/12",badge:"bg-yellow-500/18 text-yellow-300",mol:5 },
    { name:"Dietary Fiber", icon:"🥦", tag:"Best Choice", facts:["Indigestible carbs","Feeds gut microbiome","Stabilises blood glucose"],         eg:"Vegetables · Seeds · Oats",        bdr:"border-teal-500/30",   bg:"bg-teal-900/18",  badge:"bg-teal-500/18 text-teal-300",  mol:4 },
  ];
  return (
    <div className="relative flex flex-col h-full px-6 pt-5 pb-5 gap-4 overflow-hidden">
      <Orb pos="tr" />
      <div><ChLabel n={1} sub="Types of Carbohydrates" />
        <RevealHeading text="The Three Types of Carbohydrates" className="text-3xl font-black text-white block" />
        <motion.p {...fadeIn(0.28)} className="text-gray-400 text-sm mt-1">Not all carbs are equal — this distinction is the foundation of metabolic health.</motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {types.map((t,i)=>(
          <motion.div key={t.name} initial={{ y:40,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ delay:0.1+i*0.16,duration:0.55,ease:[0.16,1,0.3,1] }}
            className={`border ${t.bdr} ${t.bg} rounded-2xl p-5 flex flex-col gap-3 overflow-hidden relative`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/2 to-transparent pointer-events-none"/>
            <div className="flex items-start justify-between">
              <span className="text-4xl">{t.icon}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${t.badge}`}>{t.tag}</span>
            </div>
            <h3 className="text-white font-black text-lg">{t.name}</h3>
            <ul className="space-y-1.5 flex-1">
              {t.facts.map((f,fi)=>(
                <motion.li key={f} initial={{x:-10,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:0.35+i*0.12+fi*0.07}} className="flex items-center gap-2 text-gray-300 text-sm">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" animate={{scale:[1,1.35,1]}} transition={{duration:2,repeat:Infinity,delay:fi*0.3}}/>
                  {f}
                </motion.li>
              ))}
            </ul>
            <div className="bg-black/20 rounded-xl p-2.5">
              <p className="text-gray-600 text-[10px] uppercase font-bold mb-0.5">Examples</p>
              <p className="text-gray-400 text-xs">{t.eg}</p>
            </div>
            <div className="flex gap-1">
              {Array.from({length:t.mol}).map((_,j)=>(
                <motion.div key={j} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.5+j*0.1,type:"spring"}}
                  className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[9px] text-gray-400 font-bold">G</motion.div>
              ))}
              {i===1&&<span className="text-gray-700 self-center text-xs ml-0.5">···</span>}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeIn(0.65)} className="flex items-center gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
        <Brain size={16} className="text-blue-400 flex-shrink-0"/>
        <p className="text-blue-200 text-sm"><strong>Insight:</strong> Your brain uses ~120g of glucose daily. Quality always matters more than quantity.</p>
      </motion.div>
    </div>
  );
}

function Slide2() {
  const steps = [
    {n:"01",title:"Digestion",      body:"Salivary and pancreatic enzymes break carbs into glucose molecules.",                                       icon:"👄",cl:"border-teal-500/35 bg-teal-500/8"},
    {n:"02",title:"Absorption",     body:"Glucose crosses intestinal walls into the bloodstream — blood sugar rises.",                                icon:"🩸",cl:"border-blue-500/35 bg-blue-500/8"},
    {n:"03",title:"Insulin Release",body:"The pancreas secretes insulin — the molecular key that unlocks cells to absorb glucose.",                   icon:"🔑",cl:"border-purple-500/35 bg-purple-500/8"},
    {n:"04",title:"Cellular Fuel",  body:"Glucose powers ATP production inside muscle and organ cells — ATP is your energy currency.",                icon:"⚡",cl:"border-yellow-500/35 bg-yellow-500/8"},
    {n:"05",title:"Store or Fat",   body:"Surplus glucose stores as glycogen. When stores are full, excess converts to body fat via lipogenesis.",    icon:"🗄️",cl:"border-orange-500/35 bg-orange-500/8"},
  ];
  return (
    <div className="relative flex flex-col h-full px-6 pt-5 pb-5 gap-4 overflow-hidden">
      <Orb pos="bl"/>
      <div><ChLabel n={2} sub="Metabolism Pathway"/>
        <RevealHeading text="The Carbohydrate Journey" className="text-3xl font-black text-white block"/>
        <motion.p {...fadeIn(0.28)} className="text-gray-400 text-sm mt-1">Follow glucose from the first bite to its final destination inside your cells.</motion.p>
      </div>
      <div className="flex-1 flex flex-col gap-2.5">
        {steps.map((s,i)=>(
          <motion.div key={s.n} {...slideL(0.08+i*0.1)} className={`flex items-start gap-4 p-3.5 rounded-2xl border ${s.cl}`} whileHover={{x:4,transition:{duration:0.18}}}>
            <span className="text-2xl flex-shrink-0">{s.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-gray-600 text-[10px] font-black">{s.n}</span>
                <span className="text-white font-bold text-sm">{s.title}</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="relative flex flex-col h-full px-6 pt-5 pb-5 gap-4 overflow-hidden">
      <Orb pos="tr"/>
      <div><ChLabel n={3} sub="Blood Sugar Response"/>
        <RevealHeading text="Blood Sugar Response Curves" className="text-3xl font-black text-white block"/>
        <motion.p {...fadeIn(0.28)} className="text-gray-400 text-sm mt-1">Three carb types — three drastically different outcomes over 3 hours.</motion.p>
      </div>
      <motion.div {...fadeIn(0.35)} className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bloodSugarData} margin={{top:8,right:16,left:-28,bottom:0}}>
            <defs>
              {[["s","#ef4444"],["c","#f59e0b"],["o","#22c55e"]].map(([id,col])=>(
                <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={col} stopOpacity={0.28}/>
                  <stop offset="95%" stopColor={col} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07"/>
            <XAxis dataKey="t" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false} domain={[58,195]}/>
            <Tooltip {...TT}/>
            <Area type="monotone" dataKey="s" name="Simple Carbs"  stroke="#ef4444" strokeWidth={2.5} fill="url(#gs)" dot={false} activeDot={{r:5}}/>
            <Area type="monotone" dataKey="c" name="Complex Carbs" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gc)" dot={false} activeDot={{r:5}}/>
            <Area type="monotone" dataKey="o" name="Low GI/Fiber"  stroke="#22c55e" strokeWidth={2.5} fill="url(#go)" dot={false} activeDot={{r:5}}/>
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div {...fadeIn(0.5)} className="grid grid-cols-3 gap-2.5">
        {[{c:"#ef4444",n:"Simple Carbs",d:"Dangerous spike",bg:"bg-red-500/10 border-red-500/25"},{c:"#f59e0b",n:"Complex Carbs",d:"Moderate rise",bg:"bg-yellow-500/10 border-yellow-500/25"},{c:"#22c55e",n:"Low GI/Fiber",d:"Flat & stable ✓",bg:"bg-green-500/10 border-green-500/25"}].map(l=>(
          <div key={l.n} className={`${l.bg} border rounded-xl p-3`}>
            <div className="flex items-center gap-1.5 mb-1"><div className="w-2.5 h-2.5 rounded-full" style={{background:l.c}}/><span className="text-white text-xs font-bold">{l.n}</span></div>
            <p className="text-gray-500 text-xs">{l.d}</p>
          </div>
        ))}
      </motion.div>
      <motion.div {...fadeIn(0.65)} className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
        <AlertTriangle size={15} className="text-red-400 mt-0.5 flex-shrink-0"/>
        <p className="text-red-200 text-xs leading-relaxed"><strong>Warning:</strong> Repeated glucose spikes damage blood vessels and exhaust the pancreas — directly driving pre-diabetes and Type 2 diabetes.</p>
      </motion.div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="relative flex flex-col h-full px-6 pt-5 pb-5 gap-4 overflow-hidden">
      <Orb pos="tr"/>
      <div><ChLabel n={4} sub="Glycemic Index"/>
        <RevealHeading text="The Glycemic Index (GI)" className="text-3xl font-black text-white block"/>
        <motion.p {...fadeIn(0.28)} className="text-gray-400 text-sm mt-1">A 0–100 ranking of foods by how fast they raise blood sugar. Lower is better.</motion.p>
      </div>
      <motion.div {...fadeIn(0.35)} className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={giData} layout="vertical" margin={{top:0,right:55,left:5,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false}/>
            <XAxis type="number" domain={[0,100]} tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="food" width={100} tick={{fill:"#e5e7eb",fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip {...TT} formatter={(v:unknown)=>[`GI: ${v}`,"Glycemic Index"]}/>
            <Bar dataKey="gi" radius={[0,8,8,0]} label={{position:"right",fill:"#9ca3af",fontSize:11,formatter:(v:unknown)=>String(v)}}>
              {giData.map((d,i)=><motion.rect key={i} fill={d.fill} initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:i*0.08,duration:0.45}}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div {...fadeIn(0.55)} className="grid grid-cols-3 gap-2.5">
        {[{r:"< 55",l:"Low GI",t:"Target zone",bg:"bg-green-500/10 border-green-500/25",c:"text-green-400"},{r:"55–70",l:"Medium GI",t:"Limit these",bg:"bg-yellow-500/10 border-yellow-500/25",c:"text-yellow-400"},{r:"> 70",l:"High GI",t:"Minimise",bg:"bg-red-500/10 border-red-500/25",c:"text-red-400"}].map(z=>(
          <div key={z.l} className={`${z.bg} border rounded-xl p-3 text-center`}>
            <div className={`${z.c} font-black text-xl`}>{z.r}</div>
            <div className="text-white text-xs font-bold mt-0.5">{z.l}</div>
            <div className="text-gray-500 text-xs mt-0.5">{z.t}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="relative flex flex-col h-full px-6 pt-5 pb-5 gap-4 overflow-hidden">
      <Orb pos="bl"/>
      <div><ChLabel n={5} sub="Metabolic Profile"/>
        <RevealHeading text="Smart vs. Poor Carb Choices" className="text-3xl font-black text-white block"/>
        <motion.p {...fadeIn(0.28)} className="text-gray-400 text-sm mt-1">Full six-dimension health comparison — the gap is stark and scientifically significant.</motion.p>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        <motion.div {...fadeIn(0.35)} className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b"/>
              <PolarAngleAxis dataKey="s" tick={{fill:"#94a3b8",fontSize:10}}/>
              <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:"#374151",fontSize:8}}/>
              <Radar name="Smart" dataKey="smart" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2.5}/>
              <Radar name="Poor"  dataKey="poor"  stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2.5}/>
              <Tooltip {...TT}/>
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div {...slideL(0.4)} className="flex flex-col gap-2.5 min-w-[185px] justify-center">
          <div className="flex gap-4 mb-1">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-400"/><span className="text-green-400 text-xs font-bold">Smart Carbs</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"/><span className="text-red-400 text-xs font-bold">Poor Carbs</span></div>
          </div>
          {[{icon:<Activity size={12}/>,l:"Energy Stability",g:"90%",b:"38%",c:"text-teal-400"},{icon:<Heart size={12}/>,l:"Insulin Sens.",g:"85%",b:"33%",c:"text-pink-400"},{icon:<Brain size={12}/>,l:"Brain Function",g:"88%",b:"44%",c:"text-purple-400"},{icon:<Zap size={12}/>,l:"Gut Health",g:"92%",b:"22%",c:"text-yellow-400"}].map((m,i)=>(
            <motion.div key={m.l} {...fadeIn(0.5+i*0.08)} className="bg-white/4 rounded-xl p-3 border border-white/5">
              <div className={`flex items-center gap-1.5 ${m.c} text-xs font-bold mb-1.5`}>{m.icon}{m.l}</div>
              <div className="flex gap-2">
                <div className="flex-1 bg-green-500/15 rounded-lg py-1 text-center text-xs text-green-400 font-bold">✓ {m.g}</div>
                <div className="flex-1 bg-red-500/15 rounded-lg py-1 text-center text-xs text-red-400 font-bold">✗ {m.b}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Slide6() {
  const actions = [
    {icon:"🎯",title:"Choose Low GI",      body:"Foods GI < 55: oats, legumes, leafy greens, whole grains.",             tag:"Essential"},
    {icon:"⏰",title:"Time Your Carbs",     body:"Eat complex carbs in the morning or pre-workout when insulin peaks.",    tag:"Essential"},
    {icon:"🥗",title:"Pair Fiber + Protein",body:"Always combine carbs with fiber and protein to blunt glycemic response.",tag:"Essential"},
    {icon:"🚶",title:"Walk After Meals",    body:"10 min post-meal walk reduces blood sugar by up to 22%.",                tag:"Tip"},
    {icon:"💧",title:"Stay Hydrated",       body:"Water supports kidney function in clearing excess glucose.",              tag:"Tip"},
    {icon:"📱",title:"Track in Prednix",     body:"Log blood sugar in Progress and watch your trends improve.",             tag:"Predinex"},
  ];
  const ts: Record<string,string> = {Essential:"bg-green-500/18 text-green-300",Tip:"bg-blue-500/18 text-blue-300",Predinex:"bg-teal-500/18 text-teal-300"};
  return (
    <div className="relative flex flex-col h-full px-6 pt-5 pb-5 gap-4 overflow-hidden">
      <Orb pos="tr"/>
      <div><ChLabel n={6} sub="Action Plan"/>
        <RevealHeading text="Your Carb Action Plan" className="text-3xl font-black text-white block"/>
        <motion.p {...fadeIn(0.28)} className="text-gray-400 text-sm mt-1">Six evidence-based steps to implement starting today.</motion.p>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((a,i)=>(
          <motion.div key={a.title} initial={{y:22,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.06+i*0.09,duration:0.5,ease:[0.16,1,0.3,1]}}
            className="flex gap-3 p-4 bg-white/4 border border-white/6 rounded-2xl" whileHover={{scale:1.015,transition:{duration:0.18}}}>
            <span className="text-2xl flex-shrink-0">{a.icon}</span>
            <div><div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-bold text-sm">{a.title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ts[a.tag]}`}>{a.tag}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{a.body}</p></div>
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeIn(0.72)} className="flex items-center gap-3 bg-gradient-to-r from-teal-500/12 to-blue-500/12 border border-teal-500/22 rounded-xl px-4 py-3">
        <CheckCircle size={16} className="text-teal-400 flex-shrink-0"/>
        <div>
          <p className="text-teal-300 font-bold text-sm">🎓 Lecture Complete!</p>
          <p className="text-gray-500 text-xs mt-0.5">Prednix has personalised your plan. Knowledge is your strongest prevention tool.</p>
        </div>
      </motion.div>
    </div>
  );
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

const LANG_LIST = [
  { key: "en", label: "English",    flag: "🇬🇧" },
  { key: "hi", label: "हिंदी",      flag: "🇮🇳" },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CarbLecture({ onClose }: { onClose: () => void }) {
  const [current,  setCurrent]  = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [elapsed,  setElapsed]  = useState(0);
  const [voiceOn,  setVoiceOn]  = useState(true);
  const [volume,   setVolume]   = useState(85);
  const [speaking, setSpeaking] = useState(false);
  const [langKey,  setLangKey]  = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [voiceErr, setVoiceErr] = useState("");
  const [dir,      setDir]      = useState<1|-1>(1);

  const intervalRef    = useRef<NodeJS.Timeout|null>(null);
  const activeChapter  = useRef<number>(-1);
  const skipEffect     = useRef(false);

  const chapter = (() => {
    const idx = CHAPTERS.findIndex((_,i) => elapsed < chapterStart(i+1));
    return idx < 0 ? CHAPTERS.length - 1 : idx;
  })();
  const progress      = (elapsed / TOTAL_DURATION) * 100;
  const slideProgress = (() => {
    const start = chapterStart(chapter);
    const dur   = CHAPTERS[chapter]?.duration || 1;
    return ((elapsed - start) / dur) * 100;
  })();

  const lang: LangConfig = LANGUAGES[langKey] || LANGUAGES.en;

  // Speak method that allows fractional skipping (sRatio 0.0 to 1.0)
  const speak = useCallback((chapterIdx: number, langCfg: LangConfig, startRatio: number = 0) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setVoiceErr("");

    let text = langCfg.narrations[chapterIdx] || "";
    if (!text) return;

    // Fractional slice if seeking mid-chapter
    if (startRatio > 0.02 && startRatio < 0.98) {
      const charIndex = Math.floor(text.length * startRatio);
      const spaceIndex = text.indexOf(" ", charIndex);
      if (spaceIndex !== -1) text = text.slice(spaceIndex + 1);
      else text = text.slice(charIndex);
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang   = langCfg.code;
    utter.rate   = 0.88;
    utter.pitch  = 1.05;
    utter.volume = volume / 100;

    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => v.lang === langCfg.code)
              || voices.find(v => v.lang.startsWith(langCfg.code.split("-")[0]));

    if (pick) {
      utter.voice = pick;
    } else {
      // If voice not found in OS:
      if (langCfg.code !== "en-US") {
        setVoiceErr(`Native voice for ${langCfg.name} is not installed on your browser/OS. It may not play correctly.`);
      }
      utter.voice = voices[0] || null;
    }

    utter.onstart = () => setSpeaking(true);
    utter.onend   = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    
    // Clear the error gracefully after 6 seconds
    if (langCfg.code !== "en-US" && !pick) {
       setTimeout(() => setVoiceErr(""), 6000);
    }

    window.speechSynthesis.speak(utter);
    activeChapter.current = chapterIdx;
  }, [volume]);

  // Handle manual navigation skips
  const seekChapter = useCallback((idx: number, direction: 1|-1 = 1) => {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
    skipEffect.current = true;
    setDir(direction);
    setCurrent(clamped);
    setElapsed(chapterStart(clamped));
    if (voiceOn) speak(clamped, lang, 0);
    
    setTimeout(() => { skipEffect.current = false; }, 150);
  }, [voiceOn, speak, lang]);

  // Auto-narrate logic
  useEffect(() => {
    if (skipEffect.current) return;
    if (playing && chapter !== activeChapter.current && voiceOn) {
      speak(chapter, lang, 0);
    }
  }, [chapter, playing, voiceOn, speak, lang]);

  useEffect(() => {
    if (voiceOn && (playing || activeChapter.current >= 0)) {
      speak(chapter, LANGUAGES[langKey] || LANGUAGES.en, slideProgress / 100); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langKey]);

  const handlePlay = () => {
    setPlaying(true);
    if (voiceOn && activeChapter.current !== chapter) {
      speak(chapter, lang, slideProgress / 100);
    } else if (voiceOn && window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
    }
  };
  const handlePause = () => {
    setPlaying(false);
    window.speechSynthesis?.pause();
  };
  const toggleVoice = () => {
    setVoiceOn(v => {
      if (v) { window.speechSynthesis?.cancel(); setSpeaking(false); activeChapter.current = -1; setVoiceErr(""); }
      else    { speak(chapter, lang, slideProgress / 100); }
      return !v;
    });
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= TOTAL_DURATION - 1) { setPlaying(false); return prev; }
          const next = prev + 1;
          const ch = CHAPTERS.findIndex((_,i) => next < chapterStart(i+1));
          const cl = ch < 0 ? CHAPTERS.length - 1 : ch;
          if (cl !== current) { setDir(1); setCurrent(cl); }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, current]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const SlideComp = SLIDES[current] || SLIDES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        className="absolute inset-0 bg-black/93 backdrop-blur-md"/>

      <motion.div
        initial={{scale:0.94,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.94,opacity:0,y:24}}
        transition={{duration:0.38,ease:[0.16,1,0.3,1]}}
        className="relative z-10 w-full max-w-5xl bg-[#07090f] rounded-3xl overflow-hidden border border-white/8 flex flex-col"
        style={{height:"min(92vh, 720px)",boxShadow:"0 40px 120px -20px rgba(0,0,0,0.85),0 0 0 1px rgba(255,255,255,0.04)"}}>

        {/* ── Error Banner for Missing Voices ── */}
        <AnimatePresence>
          {voiceErr && (
            <motion.div initial={{opacity:0, y:-10, x:"-50%"}} animate={{opacity:1, y:0, x:"-50%"}} exit={{opacity:0, y:-10, x:"-50%"}}
              className="absolute top-16 left-1/2 bg-red-500/90 text-white text-[11px] font-bold px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 max-w-sm text-left">
              <AlertTriangle size={15} className="flex-shrink-0"/>
              {voiceErr}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-black/60 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div animate={{rotate:[0,6,-6,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-base flex-shrink-0">🎓</motion.div>
            <div className="min-w-0">
              <div className="text-white font-black text-sm leading-none truncate">How Carbohydrates Impact Your Health</div>
              <motion.div key={chapter} initial={{opacity:0,y:3}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
                className="text-gray-500 text-xs mt-0.5">{CHAPTERS[chapter].emoji} {CHAPTERS[chapter].title} · Ch {chapter+1}/{CHAPTERS.length}</motion.div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language picker */}
            <div className="relative">
              <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                onClick={() => setLangOpen(o=>!o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/8 text-gray-300 hover:text-white transition-colors">
                <Globe size={12}/>
                <span className="hidden sm:block">{LANG_LIST.find(l=>l.key===langKey)?.flag} {LANG_LIST.find(l=>l.key===langKey)?.label}</span>
                <ChevronDown size={10}/>
              </motion.button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div initial={{opacity:0,y:-8,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:0.96}}
                    transition={{duration:0.18}}
                    className="absolute right-0 top-full mt-1.5 bg-[#0f1623] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 min-w-[140px]">
                    {LANG_LIST.map(l=>(
                      <button key={l.key} onClick={()=>{setLangKey(l.key);setLangOpen(false);}}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-colors text-left ${langKey===l.key?"bg-teal-500/18 text-teal-300":"text-gray-400 hover:bg-white/6 hover:text-white"}`}>
                        <span>{l.flag}</span><span>{l.label}</span>
                        {langKey===l.key&&<CheckCircle size={10} className="ml-auto text-teal-400"/>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Voice toggle */}
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={toggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${voiceOn?"bg-teal-500/15 border-teal-500/35 text-teal-300":"bg-white/5 border-white/8 text-gray-500"}`}>
              {voiceOn?<Mic size={12}/>:<MicOff size={12}/>}
              <span className="hidden sm:block">{voiceOn?(speaking?"Speaking":"Voice ON"):"Voice OFF"}</span>
              {voiceOn&&speaking&&<motion.span animate={{scale:[1,1.5,1]}} transition={{duration:0.7,repeat:Infinity}} className="w-1.5 h-1.5 rounded-full bg-teal-400"/>}
            </motion.button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5 border border-white/6">
              <Volume2 size={11} className="text-gray-500"/>
              <input type="range" min={0} max={100} value={volume} onChange={e=>setVolume(+e.target.value)} className="w-14 accent-teal-500 h-1 cursor-pointer"/>
            </div>

            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-sm">✕</button>
          </div>
        </div>

        {/* ── Chapter Nav ── */}
        <div className="flex gap-1 px-4 py-2 border-b border-white/5 overflow-x-auto hide-scrollbar flex-shrink-0 bg-black/30">
          {CHAPTERS.map((ch,i)=>(
            <motion.button key={ch.id} whileHover={{scale:1.04}} whileTap={{scale:0.96}}
              onClick={()=>seekChapter(i, i>chapter?1:-1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${chapter===i
                ?"bg-teal-500/18 text-teal-300 border-teal-500/35 shadow-[0_0_12px_rgba(20,184,166,0.14)]"
                :"text-gray-500 hover:text-gray-300 hover:bg-white/4 border-transparent"}`}>
              <span>{ch.emoji}</span>
              <span className="hidden sm:block">{ch.title}</span>
              {elapsed>=chapterStart(i+1)&&<CheckCircle size={9} className="text-teal-500"/>}
            </motion.button>
          ))}
        </div>

        {/* ── Slide ── */}
        <div className="flex-1 overflow-hidden relative" onClick={()=>setLangOpen(false)}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={current}
              initial={{opacity:0,x:dir>0?60:-60,scale:0.97}}
              animate={{opacity:1,x:0,scale:1}}
              exit  ={{opacity:0,x:dir>0?-40:40,scale:0.97}}
              transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
              className="absolute inset-0 overflow-y-auto overflow-x-hidden">
              <SlideComp/>
            </motion.div>
          </AnimatePresence>

          {/* Slide progress line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <motion.div className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
              animate={{width:`${slideProgress}%`}} transition={{duration:0.9,ease:"linear"}}/>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex-shrink-0 border-t border-white/6 bg-black/60 backdrop-blur-xl px-5 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-xs font-mono w-10">{fmt(elapsed)}</span>
            <div className="flex-1 h-1.5 bg-white/8 rounded-full cursor-pointer relative overflow-hidden group"
              onClick={e=>{
                const r=(e.clientX-e.currentTarget.getBoundingClientRect().left)/e.currentTarget.getBoundingClientRect().width;
                const newE=Math.floor(r*TOTAL_DURATION);
                const ch=CHAPTERS.findIndex((_,i)=>newE<chapterStart(i+1));
                const cl=ch<0?CHAPTERS.length-1:ch;
                
                setDir(cl>chapter?1:-1);
                skipEffect.current=true;
                setElapsed(newE); setCurrent(cl);
                
                if(voiceOn) {
                  const sRatio = (newE - chapterStart(cl)) / CHAPTERS[cl].duration;
                  speak(cl, lang, sRatio);
                }
                setTimeout(()=>{skipEffect.current=false;},150);
              }}>
              {CHAPTERS.map((_,i)=>i>0&&<div key={i} className="absolute top-0 bottom-0 w-px bg-white/12 group-hover:bg-white/22 transition-colors" style={{left:`${(chapterStart(i)/TOTAL_DURATION)*100}%`}}/>)}
              <motion.div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" animate={{width:`${progress}%`}} transition={{duration:0.9,ease:"linear"}}/>
            </div>
            <span className="text-gray-700 text-xs font-mono w-10 text-right">{fmt(TOTAL_DURATION)}</span>
          </div>

          <div className="flex items-center justify-center gap-5">
            <motion.button whileHover={{scale:1.08}} whileTap={{scale:0.92}} onClick={()=>seekChapter(chapter-1,-1)}
              className="w-10 h-10 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <SkipBack size={15}/>
            </motion.button>
            <motion.button whileHover={{scale:1.07}} whileTap={{scale:0.93}} onClick={playing?handlePause:handlePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white"
              style={{boxShadow:"0 0 30px rgba(20,184,166,0.35)"}}>
              <AnimatePresence mode="wait">
                {playing
                  ?<motion.div key="p" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} transition={{duration:0.13}}><Pause size={22}/></motion.div>
                  :<motion.div key="pl" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} transition={{duration:0.13}}><Play size={22} className="ml-1"/></motion.div>}
              </AnimatePresence>
            </motion.button>
            <motion.button whileHover={{scale:1.08}} whileTap={{scale:0.92}} onClick={()=>seekChapter(chapter+1,1)}
              className="w-10 h-10 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <SkipForward size={15}/>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
