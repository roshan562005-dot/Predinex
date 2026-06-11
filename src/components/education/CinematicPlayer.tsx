"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Maximize, Volume2, SkipBack, SkipForward, Pause, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { articleData } from "./articleData";

interface CinematicPlayerProps {
  title: string;
  category: string;
  image: string;
  onClose: () => void;
}

export default function CinematicPlayer({ title, category, image, onClose }: CinematicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fake progress bar logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentArticle = articleData[title];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Cinematic dark backdrop with heavy blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-[#090b11] rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-y-auto flex flex-col hide-scrollbar"
      >
        {/* Video Player Container */}
        <div className="w-full aspect-video bg-black relative shrink-0 overflow-hidden group/player">
          {/* Header (Top UI) */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-500">
             <div>
               <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-black uppercase px-3 py-1.5 rounded flex items-center mb-3 w-fit tracking-widest backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse mr-2"></span>
                  {category} Series
               </span>
               <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight text-shadow-xl">{title}</h2>
             </div>
             <button 
               onClick={onClose}
               className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors"
             >
               <X size={20} />
             </button>
          </div>

          {/* The Media / Poster */}
          <div className="absolute inset-0 z-0">
            <img 
              src={image} 
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isPlaying ? 'scale-105 filter saturate-110 brightness-110' : 'scale-100 brightness-75'}`}
            />
            {isPlaying && (
               <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none"></div>
            )}
          </div>

          {/* Center Play Button Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                 <div className="w-20 h-20 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/40 flex items-center justify-center text-white hover:bg-teal-500/40 hover:scale-110 transition-all duration-300 shadow-[0_0_50px_rgba(45,212,191,0.5)]">
                   <Play size={32} className="ml-1.5 drop-shadow-md" fill="currentColor" />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls (Bottom UI) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-500">
             
             {/* Scrubber Bar */}
             <div className="group/scrubber relative h-1.5 w-full bg-white/20 rounded-full mb-6 cursor-pointer overflow-hidden">
               <div className="absolute top-0 left-0 bottom-0 bg-teal-500 transition-all ease-linear" style={{ width: `${progress}%` }}>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/scrubber:scale-100 transition-transform"></div>
               </div>
             </div>

             {/* Buttons */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-white">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:scale-110 transition-transform hover:text-teal-400">
                     {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                  </button>
                  <div className="flex items-center gap-4 text-white/70">
                     <button className="hover:text-white transition-colors"><SkipBack size={20} fill="currentColor" /></button>
                     <button className="hover:text-white transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                  </div>
                  <div className="flex items-center gap-3 group/vol cursor-pointer">
                     <Volume2 size={20} className="text-white/70 hover:text-white transition-colors" />
                     <div className="w-0 overflow-hidden group-hover/vol:w-16 transition-all duration-300">
                        <div className="h-1 bg-white/20 rounded-full w-full">
                           <div className="h-full w-3/4 bg-teal-500 rounded-full"></div>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white/70">
                   <span className="text-xs font-medium tracking-wide">
                     {Math.floor(progress / 100 * 5)}:{(Math.floor((progress / 100) * 300) % 60).toString().padStart(2, '0')} / 05:00
                   </span>
                   <button className="hover:text-white transition-colors hover:scale-110"><Maximize size={20} strokeWidth={2.5} /></button>
                </div>
             </div>
          </div>
        </div>

        {/* Written Article Section */}
        {currentArticle && (
          <div className="p-8 md:p-10 bg-[#090b11] border-t border-white/5 relative z-10 text-gray-300">
            {/* Clinical Summary Badge/Insight */}
            <div className="bg-gradient-to-br from-teal-950/30 to-teal-900/10 border border-teal-500/20 p-6 rounded-3xl relative overflow-hidden mb-10 shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-lg font-black text-teal-400 tracking-tight mb-3 flex items-center gap-2 relative z-10">
                <Sparkles size={20} className="text-teal-400 animate-pulse" /> Clinical Focus
              </h3>
              <p className="text-teal-200 text-sm md:text-base font-medium leading-relaxed relative z-10 text-pretty">
                {currentArticle.clinicalSummary}
              </p>
            </div>

            {/* Main Reading Flow */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              <div className="md:col-span-3 space-y-8">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 border-b border-white/10 pb-4">
                  <BookOpen size={20} className="text-teal-500" /> Detailed Insight
                </h3>
                <div className="space-y-6 pt-2">
                  {currentArticle.sections.map((section, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <h4 className="font-extrabold text-white text-base md:text-lg">{section.title}</h4>
                      <p className="text-gray-400 font-medium leading-relaxed text-sm md:text-base text-pretty">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Actionable Takeaways */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 border-b border-white/10 pb-4">
                  <CheckCircle2 size={20} className="text-teal-500" /> Action Items
                </h3>
                <ul className="space-y-4 pt-2">
                  {currentArticle.takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-300 font-medium text-sm md:text-base leading-relaxed">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
