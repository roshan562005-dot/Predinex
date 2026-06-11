'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid admin password.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 mx-auto mb-4">
            <Database size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Admin Terminal</h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Prednix Encrypted Access</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6"
        >
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              <Lock size={12} /> Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Authenticating...' : 'Access Terminal'}
          </button>
        </form>
      </div>
    </div>
  );
}
