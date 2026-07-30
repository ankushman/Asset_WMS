'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

function AccountActivationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { activateEmployeeAccount, employees } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const targetEmp = employees.find((e) => e.invitationToken === token);

  useEffect(() => {
    if (!token) {
      setErrorMsg('No activation token provided in URL. Please use the activation link sent to your email.');
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Invalid token.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Please accept the corporate security and terms of service.');
      return;
    }

    setLoading(true);

    const res = activateEmployeeAccount({ token, password });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(res.error || 'Failed to activate account.');
    }
  };

  return (
    <div className="bg-navy-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
      {success ? (
        <div className="text-center space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800 shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Account Activated Successfully!</h3>
          <p className="text-xs text-slate-300">
            Your employee account has been activated. You can now log in using your corporate email address and new password.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 rounded-xl shadow-lg shadow-royal-900/50 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            Proceed to Login <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          {targetEmp && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">INVITATION DETAILS</span>
              <div className="font-bold text-white text-sm">{targetEmp.name}</div>
              <div className="text-slate-400">{targetEmp.email} • {targetEmp.designation}</div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1">Create Password <span className="text-rose-400">*</span></label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Confirm Password <span className="text-rose-400">*</span></label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="py-1">
            <label className="flex items-center text-slate-400 gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="rounded bg-navy-950 border-slate-700 text-royal-600 focus:ring-0"
                required
              />
              I accept corporate security guidelines & terms of use.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 shadow-lg shadow-royal-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Activating Account...</span>
            ) : (
              <>
                Activate Account & Save Password <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AccountActivationPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-royal-600 selection:text-white">
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
        <h2 className="mt-6 text-2xl font-bold text-white tracking-tight">
          Employee Account Activation
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Verify your invitation and create your permanent account password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="bg-navy-900 border border-slate-800 p-8 rounded-3xl text-center text-slate-400 text-xs">Loading activation verification...</div>}>
          <AccountActivationContent />
        </Suspense>
      </div>
    </div>
  );
}
