"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bluetooth, Watch, AlertCircle, CheckCircle, Activity, Info } from "lucide-react";

export default function BluetoothConnector() {
  const [status, setStatus] = useState<"idle" | "scanning" | "connected" | "error">("idle");
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const connectDevice = async () => {
    try {
      setStatus("scanning");
      setErrorMsg(null);
      
      // Artificial delay to show off the cool radar animation
      await new Promise(r => setTimeout(r, 1200));

      if (!(navigator as any).bluetooth) {
        throw new Error("Bluetooth API not supported in this browser.");
      }

      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'heart_rate']
      });

      setDeviceName(device.name || "Health Tracker");
      setStatus("connected");
      
      device.addEventListener('gattserverdisconnected', async () => {
        console.log("Device disconnected. Attempting auto-reconnect...");
        setStatus("scanning");
        try {
          if (!device.gatt) throw new Error("GATT not found");
          let attempts = 0;
          while (attempts < 3) {
             await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempts))); // exponential backoff
             try {
               await device.gatt.connect();
               setStatus("connected");
               return; // successfully reconnected
             } catch (e) {
               attempts++;
             }
          }
          throw new Error("Unable to reconnect after 3 attempts.");
        } catch (e) {
          setStatus("idle");
          setDeviceName(null);
        }
      });
      
    } catch (error: any) {
      console.error(error);
      if (error.name === "NotFoundError" || error.message.includes("cancelled")) {
        // User just closed the prompt
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMsg(error.message || "Failed to connect to device.");
        setTimeout(() => setStatus("idle"), 4000);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0f1219] border border-white/5 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group"
    >
      {/* Background glow effects */}
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[180px]">
        
        <AnimatePresence mode="wait">
          
          {/* IDLE STATE */}
          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                 <Bluetooth size={28} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-1">Sync Wearable</h3>
              <p className="text-gray-500 text-sm font-medium mb-6">Connect your smartwatch or monitor.</p>
              
              <button 
                onClick={connectDevice}
                className="w-full relative overflow-hidden rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-bold py-3.5 border border-teal-500/30 transition-all hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] active:scale-[0.98]"
              >
                Scan for Devices
              </button>
            </motion.div>
          )}

          {/* SCANNING STATE (Premium Radar Graphics) */}
          {status === "scanning" && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                 {/* Expanding Radar Rings */}
                 {[0, 1, 2].map((i) => (
                   <motion.div
                     key={i}
                     className="absolute inset-0 rounded-full border border-teal-500/50"
                     initial={{ scale: 0.8, opacity: 1 }}
                     animate={{ 
                       scale: [0.8, 2.5], 
                       opacity: [1, 0] 
                     }}
                     transition={{
                       duration: 2,
                       repeat: Infinity,
                       delay: i * 0.6,
                       ease: "easeOut"
                     }}
                   />
                 ))}
                 <div className="relative z-10 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.6)]">
                    <Bluetooth size={24} className="text-gray-900 animate-pulse" />
                 </div>
              </div>
              <p className="text-teal-400 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning frequency...</p>
            </motion.div>
          )}

          {/* CONNECTED STATE */}
          {status === "connected" && (
            <motion.div 
              key="connected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full"
            >
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.4)]">
                   <Watch size={32} className="text-gray-900" />
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1"
                >
                  <CheckCircle size={20} className="text-green-400" />
                </motion.div>
              </div>
              <h3 className="text-xl font-black text-white mb-1 line-clamp-1 truncate w-full text-center px-4">{deviceName}</h3>
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Activity size={12} /> Active Feed Syncing
              </div>
              <button 
                onClick={() => setStatus("idle")}
                className="text-gray-500 hover:text-white text-sm font-semibold transition-colors"
              >
                Disconnect
              </button>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {status === "error" && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                 <AlertCircle size={28} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-red-400 mb-2">Connection Failed</h3>
              <p className="text-gray-500 text-xs max-w-[80%] leading-relaxed">{errorMsg}</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      {/* Top right indicator */}
      {status === "connected" && (
        <span className="absolute top-6 right-6 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] animate-pulse" />
      )}
    </motion.div>
  );
}
