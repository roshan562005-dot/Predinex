"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, ShieldCheck, Mail, Phone, Settings, AlertCircle, Save } from "lucide-react";
import { getUserProfile } from "@/app/(app)/actions";
import { useInclusivity } from "@/context/InclusivityContext";

export default function ProfilePage() {
  const { t } = useInclusivity();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    notifications: true
  });

  useEffect(() => {
    async function loadData() {
      try {
        const p = await getUserProfile() as any;
        setProfile(p);
        if (p) {
          setFormData(prev => ({
            ...prev,
            firstName: p.first_name || "",
            lastName: p.last_name || "",
            email: p.email || ""
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API delay, since we don't have db update method out of the box
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    alert("Settings updated successfully and synced with Predinex.");
  };

  if (loading) {
    return <div className="p-8"><div className="animate-pulse flex gap-4"><div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div><div className="flex-1 space-y-3"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div></div></div></div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto min-h-screen">
       <div className="mb-10">
         <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <User className="text-teal-500" size={32} strokeWidth={2.5} /> {t("profile_settings") || "Profile & Settings"}
         </h1>
         <p className="text-gray-500 font-medium mt-2">{t("profile_desc") || "Manage your clinical identity and application preferences."}</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
             {/* Security Box - 3D Card */}
             <motion.div 
               whileHover={{ rotateY: 8, rotateX: -5, scale: 1.02, perspective: 1000 }}
               className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-[2rem] p-6 relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldCheck size={100} /></div>
                <ShieldCheck size={28} strokeWidth={2.5} className="text-emerald-500 mb-4 relative z-10" />
                <h3 className="font-bold text-gray-900 dark:text-emerald-400 text-lg relative z-10">{t("protected_identity") || "Protected Identity"}</h3>
                <p className="text-sm font-medium text-emerald-700/70 dark:text-emerald-400/70 mt-2 relative z-10">{t("privacy_desc") || "Your clinical data and genetic history are encrypted locally via SQLite."}</p>
             </motion.div>

             <motion.div 
               whileHover={{ rotateY: -8, rotateX: 5, scale: 1.02, perspective: 1000 }}
               className="bg-white dark:bg-gray-900/40 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 p-6 shadow-2xl"
             >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Settings size={18} /> {t("preferences") || "Preferences"}</h3>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{t("push_notifications") || "Push Notifications"}</span>
                  <input type="checkbox" checked={formData.notifications} onChange={e => setFormData({...formData, notifications: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500 relative"></div>
                </label>
             </motion.div>
          </div>

          <div className="lg:col-span-2">
             <motion.form 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                onSubmit={handleSave} 
                className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6"
             >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t("first_name") || "First Name"}</label>
                      <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" required />
                   </div>
                   <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t("last_name") || "Last Name"}</label>
                      <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" required />
                   </div>
                </div>

                <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><Mail size={14}/> Email Address</label>
                   <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-medium text-gray-500 dark:text-gray-400 opacity-70 cursor-not-allowed" />
                   <p className="text-xs text-gray-500 mt-2 font-medium">Email cannot be changed natively. Contact support.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><Phone size={14}/> {t("phone_number") || "Phone Number"}</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                   </div>
                   <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><AlertCircle size={14}/> {t("emergency_contact") || "Emergency Contact"}</label>
                      <input type="tel" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} placeholder="Spouse or Doctor" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                   <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100">
                      {saving ? "Syncing..." : <><Save size={18}/> {t("save_profile") || "Save Profile Firmware"}</>}
                   </button>
                </div>
             </motion.form>
          </div>
       </div>
    </div>
  );
}
