import { getAllUsers, getAllAssessments, getAllHabits } from "@/lib/db-queries";
import { Users, Activity, LogOut, CheckCircle, Database } from "lucide-react";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const users = await getAllUsers();
  const assessments = await getAllAssessments();
  const habits = await getAllHabits();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 selection:bg-teal-500/30">
       <header className="max-w-7xl mx-auto flex items-center justify-between mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
               <Database size={24} />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tighter">Prednix Admin Terminal</h1>
                <p className="text-teal-500 text-sm font-bold uppercase tracking-widest mt-1 opacity-80">Encrypted Patient Monitoring</p>
             </div>
          </div>
          <Link href="/dashboard" className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">
            Exit Terminal
          </Link>
       </header>

       <main className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Level Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:border-teal-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-teal-400"><Users size={64}/></div>
                <Users size={24} className="text-teal-500 mb-4" />
                <p className="text-6xl font-black">{users.length}</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Active Patients</p>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-blue-400"><Activity size={64}/></div>
                <Activity size={24} className="text-blue-500 mb-4" />
                <p className="text-6xl font-black">{assessments.length}</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Diagnostics Logged</p>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-emerald-400"><CheckCircle size={64}/></div>
                <CheckCircle size={24} className="text-emerald-500 mb-4" />
                <p className="text-6xl font-black">{habits.length}</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Telemetry Events</p>
             </div>
          </div>

          {/* Database Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-black/50 border border-white/10 rounded-[2rem] p-6">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Patient Ledger</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                   {users.map((u, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                         <div>
                            <p className="font-bold text-gray-200">{u.full_name}</p>
                            <p className="text-xs text-gray-500 font-medium">{u.email || u.phone}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-xs bg-teal-500/20 text-teal-400 font-bold px-2 py-1 rounded-md uppercase tracking-wide">{u.auth_provider}</span>
                         </div>
                      </div>
                   ))}
                   {users.length === 0 && <p className="text-gray-500 p-4">No patients registered.</p>}
                </div>
             </div>

             <div className="bg-black/50 border border-white/10 rounded-[2rem] p-6">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Recent Vitals & Habits</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                   {habits.slice(0, 50).map((h, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                         <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-teal-400">{h.full_name}</p>
                            <p className="text-xs text-gray-500 font-bold">{h.date}</p>
                         </div>
                         <div className="flex gap-4 text-sm text-gray-300 bg-black/30 p-2 rounded-lg">
                            <span className="flex items-center gap-1">Drops: <span className="text-white font-bold">{h.blood_sugar || '--'}</span></span>
                            <span className="flex items-center gap-1">Steps: <span className="text-white font-bold">{h.steps || '--'}</span></span>
                            <span className="flex items-center gap-1">Sleep: <span className="text-white font-bold">{h.sleep_hours || '--'}</span></span>
                         </div>
                      </div>
                   ))}
                   {habits.length === 0 && <p className="text-gray-500 p-4">No recent telemetry data.</p>}
                </div>
             </div>
          </div>

       </main>
    </div>
  );
}
