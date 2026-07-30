'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Send reset password request to backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => null);
    } catch (err: any) {
      // Continue gracefully
    }

    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center font-extrabold text-xl text-white shadow-xl shadow-orange-600/20">
            S
          </div>
          <div className="text-left leading-tight">
            <div className="text-lg font-extrabold tracking-wider text-white">
              SANKAJ <span className="text-orange-500 font-semibold">LOGISTICS LIMITED</span>
            </div>
            <span className="block text-xs text-slate-400 font-medium">Enterprise Warehouse Management System</span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter your registered email address and we&apos;ll send you a secure password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-navy-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Reset Link Sent</h3>
              <p className="text-xs text-slate-400">
                We sent a secure password reset link to <strong className="text-slate-200">{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Link
                href="/login"
                className="block py-2.5 px-4 text-xs font-bold text-white bg-royal-600 rounded-xl hover:bg-royal-500 mt-4"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-rose-300 font-semibold">{errorMsg}</p>
                    <button onClick={() => setErrorMsg('')} className="text-[10px] text-rose-400 hover:underline mt-1">
                      Try again
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Corporate Email Address</label>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 shadow-lg shadow-royal-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Sending Reset Email...</span>
                  ) : (
                    <>
                      Send Password Reset Email <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center text-xs text-slate-400">
            Remembered your password?{' '}
            <Link href="/login" className="text-royal-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
