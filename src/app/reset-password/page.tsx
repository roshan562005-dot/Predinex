'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, CheckCircle2, Leaf, Eye, EyeOff } from 'lucide-react';

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setDone(true);
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="text-red-500" size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Invalid Reset Link</h1>
        <p className="text-gray-500 mb-8">This link is missing required parameters. Please request a new one.</p>
        <Link href="/forgot-password" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
          Request new reset link →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-emerald-500" size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Password Updated!</h1>
        <p className="text-gray-500 mb-2">Your password has been reset successfully.</p>
        <p className="text-sm text-gray-400">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to login
      </Link>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Set new password</h1>
      <p className="text-gray-500 mb-2">
        Resetting password for <strong className="text-gray-700">{email}</strong>
      </p>

      {error && (
        <div className="mb-6 mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="new-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirm-password"
              type={showPass ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="Re-enter password"
            />
          </div>
        </div>

        {/* Password strength indicator */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                password.length >= i * 2
                  ? password.length >= 8
                    ? 'bg-emerald-500'
                    : 'bg-amber-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          id="reset-password-submit"
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_8px_16px_-6px_rgba(16,185,129,0.4)] text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <Suspense fallback={<div className="animate-pulse h-64 rounded-2xl bg-gray-100" />}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
