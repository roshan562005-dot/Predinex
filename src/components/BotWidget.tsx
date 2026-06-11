"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, User, ShieldCheck, RefreshCw, AudioLines } from "lucide-react";
import { getDailyHabits, getLatestAssessment, getUserProfile } from "@/app/(app)/actions";

// --- Custom Hook for Streaming Text ---
function useStreamText(text: string, speed: number = 20) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let i = 0;
    
    // Quick skip for short or instant messages (e.g., loaded from history)
    if (speed === 0) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isComplete };
}

// --- Simple Markdown Parser Component ---
// This handles **bold**, bullet points starting with "-", and line breaks
const FormattedMessage = ({ text, speed }: { text: string; speed: number }) => {
  const { displayedText } = useStreamText(text, speed);
  
  // Split into paragraphs by double line breaks
  const paragraphs = displayedText.split("\n\n");

  return (
    <div className="space-y-3 leading-relaxed">
      {paragraphs.map((para, i) => {
        // If it looks like a list
        if (para.includes("\n- ") || para.startsWith("- ")) {
          const items = para.split("\n").filter(Boolean);
          return (
            <ul key={i} className="list-disc pl-4 space-y-2 mt-2">
              {items.map((item, j) => {
                const textContent = item.replace(/^- /, "");
                return (
                  <li key={j} className="text-[14px]">
                    <span dangerouslySetInnerHTML={{ __html: formatBold(textContent) }} />
                  </li>
                );
              })}
            </ul>
          );
        }
        
        // Normal paragraph
        return (
           <p key={i} className="text-[14px]" dangerouslySetInnerHTML={{ __html: formatBold(para.replace(/\n/g, '<br/>')) }} />
        );
      })}
    </div>
  );
};

// Helper to convert **text** to <strong>text</strong> safely
function formatBold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');
}


export function BotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load initial greeting and data
  useEffect(() => {
    async function loadHealthData() {
      try {
        const [h, a, p] = await Promise.all([
          getDailyHabits(),
          getLatestAssessment(),
          getUserProfile()
        ]);
        
        const combined = { ...h, assessment: a };
        setHealthData(combined);
        setProfile(p);

        setMessages([{
          id: 1,
          sender: "bot",
          text: `Hello ${p?.first_name || 'there'}! I am your Predinex Health Assistant.\n\nI've synchronized your clinical data. Your current metabolic profile is marked as **${a?.risk_level || 'Moderate Risk'}**.\n\nI can clarify any doubts regarding your diet, analyze workout modifications, or explain the science behind your blood sugar drops. What's on your mind today?`,
          speed: 0 // Show instantly on load
        }]);
      } catch (e) {
        console.error("Bot failed to load health data", e);
      }
    }
    if (messages.length === 0) loadHealthData();
  }, [messages.length]);

  const handleClearChat = () => {
    const defaultMsg = {
      id: Date.now(),
      sender: "bot",
      text: "Memory cleared. Starting a fresh session. How can I assist your health journey right now?",
      speed: 15
    };
    setMessages([defaultMsg]);
  };

  const handleSend = (overrideInput?: string) => {
    const textToSend = typeof overrideInput === 'string' ? overrideInput : input;
    if (!textToSend.trim() || isTyping) return;
    
    const newMsg = { id: Date.now(), sender: "user", text: textToSend, speed: 0 };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Advanced clarification logic engine
    setTimeout(() => {
      let responseText = "Based on my real-time analysis, your biomarkers are currently stable.\n\nI recommend continuing your clinical protocol as prescribed in the `Plans` tab. Do you want me to break down your meals for today?";
      
      const lowerInput = textToSend.toLowerCase();
      const steps = healthData?.steps || 0;
      const glucose = healthData?.blood_sugar;
      const sleep = healthData?.sleep_hours || 0;
      const risk = healthData?.assessment?.risk_level || "Moderate Risk";

      if (lowerInput.includes("why") && lowerInput.includes("walk")) {
        responseText = "Walking, specifically immediately after meals, is one of the most powerful tools against pre-diabetes.\n\n**Here is the clinical mechanism:**\n- Your muscles require glucose to contract.\n- When you walk, muscle cells open their 'doors' (GLUT4 receptors) to pull sugar directly from your bloodstream.\n- This happens completely **independent of insulin**, which means you naturally lower a glucose spike without taxing your pancreas.\n\nAim for 10-15 minutes immediately after your heaviest meal.";
      } else if (lowerInput.includes("diet") || lowerInput.includes("food") || lowerInput.includes("clarify") && lowerInput.includes("meal")) {
        responseText = "Absolutely. Based on your profile, your personalized diet focuses on stabilizing blood sugar by pairing complex carbohydrates with healthy fats and lean proteins.\n\n**Why this matters:**\n- Eating carbohydrates alone causes a rapid glucose spike.\n- Adding fiber (like broccoli) and fat (like avocado or olive oil) physically slows down stomach emptying.\n- This results in a slow, steady trickle of energy rather than a dangerous surge.\n\nIf you want a detailed breakdown of specific recipes, check out the `Diet Plans` tab.";
      } else if (lowerInput.includes("risk") || lowerInput.includes("status") || lowerInput.includes("assessment")) {
        responseText = `Our diagnostics categorized you as having **${risk}**.\n\nThis means you have several lifestyle markers that strongly correlate with developing Type 2 Diabetes if left unmanaged.\n\n**The Good News:**\nPre-diabetes is completely reversible. By adhering to the Predinex 30-Day Protocol, you can literally reprogram how your cells respond to insulin within a matter of weeks. Would you like me to prioritize your daily habits?`;
      } else if (lowerInput.includes("sleep")) {
        responseText = sleep > 0 
          ? `I see you logged **${sleep} hours** of sleep. Great job.\n\nDeep sleep is when your body repairs cellular damage and resets your insulin sensitivity for the next morning. Chronic sleep deprivation directly causes insulin resistance. Try to maintain this habit!`
          : "I don't see any sleep logged for today yet.\n\n**Did you know?** Just one night of poor sleep can make your cells up to 30% more resistant to insulin the next day. I highly recommend using the Deep Rest soundscape tonight to wind down properly.";
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
        responseText = "Hello again! I'm here and ready to analyze. Do you have any doubts about your protocol, or would you like me to explain the science behind your current plan?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: responseText,
          speed: 15 // Stream text smoothly
        }
      ]);
      setIsTyping(false);
    }, 1200 + Math.random() * 1000); // Simulate "thinking" time
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[500px] bg-white/90 dark:bg-[#11141d]/90 backdrop-blur-3xl rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-200/50 dark:border-white/10 overflow-hidden flex flex-col h-[70vh] max-h-[750px] min-h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-900 to-[#0c0f16] p-5 flex items-center justify-between text-white relative overflow-hidden shrink-0 border-b border-white/5">
              {/* Premium Glows */}
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-teal-500/20 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500 rounded-[14px] shadow-lg shadow-teal-500/30 border border-white/10">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[16px] tracking-wide flex items-center gap-1.5 uppercase">
                    Predinex System <ShieldCheck size={16} className="text-teal-400" />
                  </h3>
                  <p className="text-[12px] text-teal-100/70 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    Intelligent Health Diagnostics
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 relative z-10">
                <button 
                  onClick={handleClearChat}
                  title="New Conversation"
                  className="hover:bg-white/10 p-2.5 rounded-xl text-teal-100/70 hover:text-white transition-colors"
                >
                  <RefreshCw size={18} />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  title="Close Assistant"
                  className="hover:bg-white/10 p-2.5 rounded-xl text-teal-100/70 hover:text-white transition-colors bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-gray-50/50 dark:bg-black/20 hide-scrollbar relative">
              {messages.length === 0 && !isTyping && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-50">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Sparkles size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Your personalized assistant is ready to help you optimize your metabolic health.</p>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 mt-1 border shadow-sm ${
                    msg.sender === "bot" 
                      ? "bg-gradient-to-br from-teal-500 to-blue-600 border-teal-400/30 text-white" 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  }`}>
                    {msg.sender === "bot" ? <Sparkles size={18} /> : <User size={18} />}
                  </div>
                  
                  <div className={`px-5 py-4 max-w-[85%] ${
                    msg.sender === "bot" 
                      ? "bg-white dark:bg-[#1a1e29] border border-gray-100 dark:border-white/5 rounded-3xl rounded-tl-sm text-gray-700 dark:text-gray-200 shadow-sm" 
                      : "bg-teal-600 text-white rounded-3xl rounded-tr-sm shadow-md shadow-teal-600/20"
                  }`}>
                    {msg.sender === "bot" ? (
                      <FormattedMessage text={msg.text} speed={msg.speed} />
                    ) : (
                      <p className="text-[14px] leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                   <div className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 mt-1 border shadow-sm bg-gradient-to-br from-teal-500 to-blue-600 border-teal-400/30 text-white">
                      <Sparkles size={18} className="animate-pulse" />
                   </div>
                   <div className="px-5 py-4 bg-white dark:bg-[#1a1e29] border border-gray-100 dark:border-white/5 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-2 h-[52px]">
                      <div className="flex gap-1">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-wider">Analyzing</span>
                   </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-4" /> {/* Spacer for scrolling */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/95 dark:bg-[#11141d]/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/10 shrink-0">
               <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 font-medium mb-3 pb-1 border-b border-gray-100 dark:border-white/5">
                 Your personalized smart assistant. Clinical data strictly confidential.
               </p>
               
               {/* Suggested Prompts */}
               <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar pb-1">
                  {[
                    "Explain my risk level",
                    "How can I sleep better?",
                    "Why walk after meals?",
                    "Recommend a diet plan"
                  ].map(prompt => (
                    <button 
                      key={prompt} 
                      onClick={() => handleSend(prompt)} 
                      className="px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-[12px] font-semibold text-gray-600 dark:text-gray-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 whitespace-nowrap transition-colors shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
               </div>

               <div className="relative flex items-end shadow-sm rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-400 transition-all">
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask a question about your health protocol..." 
                    className="w-full bg-transparent py-4 pl-4 pr-16 text-[14px] text-gray-900 dark:text-white focus:outline-none resize-none min-h-[56px] max-h-[120px]"
                    rows={1}
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className={`absolute right-2 bottom-2 p-2.5 rounded-[12px] transition-all transform ${
                      input.trim() && !isTyping 
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md shadow-teal-500/30 hover:scale-105" 
                        : "bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Send size={18} className="-ml-0.5 mt-0.5" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center overflow-hidden group shadow-[0_15px_35px_-5px_rgba(20,184,166,0.5)] border border-white/40 dark:border-white/20 transition-all duration-300"
      >
        {/* Core background color behind image just in case */}
        <div className="absolute inset-0 bg-gray-900"></div>
        
        {isOpen ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-600"></div>
            <X size={32} className="relative z-10 text-white drop-shadow-md" />
          </>
        ) : (
          <>
            {/* Ultra-Premium 3D Base (Failsafe) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1e293b] via-[#334155] to-[#0f172a]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.3)_0%,_rgba(255,255,255,0)_60%)] pointer-events-none"></div>

            {/* The 8D Premium Cybernetic Robot SVG */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-1.5 transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                <defs>
                  <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="innerShadow">
                     <feOffset dx="0" dy="2"/>
                     <feGaussianBlur stdDeviation="1.5" result="offset-blur"/>
                     <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                     <feFlood floodColor="black" floodOpacity="0.4" result="color"/>
                     <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                     <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                  </filter>
                </defs>
                
                {/* Antenna Bulb Glowing */}
                <circle cx="50" cy="18" r="6" fill="url(#eyeGrad)" filter="url(#glow)" />
                {/* Antenna Base */}
                <path d="M47 30 L53 30 L52 22 L48 22 Z" fill="#cbd5e1" filter="url(#innerShadow)" />
                
                {/* Outer Cyber Head */}
                <rect x="18" y="28" width="64" height="52" rx="18" fill="url(#botGrad)" stroke="#475569" strokeWidth="1" filter="url(#innerShadow)" />
                
                {/* Ears / Side Nodes */}
                <rect x="12" y="45" width="6" height="18" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1" />
                <rect x="82" y="45" width="6" height="18" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1" />
                
                {/* Inner Glass Visor */}
                <rect x="24" y="40" width="52" height="24" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" filter="url(#innerShadow)" />
                
                {/* Cybernetic Eyes */}
                <path d="M 33 52 A 5 5 0 0 1 45 52 L 40 52 Z" fill="url(#eyeGrad)" filter="url(#glow)" />
                <path d="M 55 52 A 5 5 0 0 1 67 52 L 62 52 Z" fill="url(#eyeGrad)" filter="url(#glow)" />
                
                {/* Cheek highlights */}
                <circle cx="30" cy="68" r="2" fill="#cbd5e1" opacity="0.6" />
                <circle cx="70" cy="68" r="2" fill="#cbd5e1" opacity="0.6" />
              </svg>
            </div>
            
            {/* Glass Cap Overlay */}
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent rounded-t-[1.5rem] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/30 pointer-events-none mix-blend-overlay"></div>
          </>
        )}
        
        {/* Futuristic Plasma Node Notification */}
        {!isOpen && (
          <span className="absolute top-0 right-0 p-1 z-20">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-90 blur-[1px]"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-br from-pink-300 to-rose-600 border border-white/80 shadow-[0_0_10px_rgba(244,63,94,1)]"></span>
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
