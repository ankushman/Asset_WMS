'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { AuthAlert } from '@/components/auth/AuthAlert';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithSupabase, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await signInWithSupabase({ email, password });

    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'The email or password you entered is incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-royal-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center font-extrabold text-xl text-white shadow-xl shadow-orange-600/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="text-left leading-tight">
            <div className="text-lg font-extrabold tracking-wider text-white">
              SANKAJ <span className="text-orange-500 font-semibold">LOGISTICS LIMITED</span>
            </div>
            <span className="block text-xs text-slate-400 font-medium">Enterprise Warehouse Management System</span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-white tracking-tight">
          Sign in to your Enterprise Account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter your corporate email and password to access the platform.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-navy-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {errorMsg && (
            <AuthAlert
              error={errorMsg}
              onRetry={() => setErrorMsg('')}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center text-slate-400 gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-navy-950 border-slate-700 text-royal-600 focus:ring-0"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-royal-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 shadow-lg shadow-royal-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an enterprise account?{' '}
            <Link href="/register" className="text-royal-400 font-bold hover:underline">
              Register Company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
