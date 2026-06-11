'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Leaf } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <Leaf className="text-white" size={18} />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">Prednix</span>
        </div>

        {sent ? (
          /* Success State */
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-3">Check your inbox</h1>
            <p className="text-gray-500 leading-relaxed mb-8">
              If an account exists for <strong className="text-gray-700">{email}</strong>, we've sent a password reset link. It expires in 1 hour.
            </p>
            <p className="text-xs text-gray-400 mb-6 p-3 bg-gray-50 rounded-xl">
              💡 <strong>Dev mode:</strong> If SMTP is not configured, check the server console for the reset link.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700">
              <ArrowLeft size={16} /> Back to login
            </Link>
          </div>
        ) : (
          /* Form State */
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 mb-8 transition-colors">
              <ArrowLeft size={16} /> Back to login
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Forgot password?</h1>
            <p className="text-gray-500 mb-8">Enter your email and we'll send you a reset link.</p>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="forgot-email">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    placeholder="john@example.com"
                    autoFocus
                  />
                </div>
              </div>

              <button
                id="forgot-password-submit"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_8px_16px_-6px_rgba(16,185,129,0.4)] text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
