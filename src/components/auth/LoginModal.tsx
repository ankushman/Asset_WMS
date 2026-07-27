'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/lib/rbac';
import { Lock, Mail, ArrowRight, X } from 'lucide-react';
import { AuthAlert } from './AuthAlert';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_CREDENTIALS: Record<UserRole, { email: string; pass: string }> = {
  SUPER_ADMIN: { email: 'admin@sankajlogistics.com', pass: 'password123' },
  COMPANY_ADMIN: { email: 'deepak@sankajlogistics.com', pass: 'password123' },
  WAREHOUSE_MANAGER: { email: 'rajesh.sharma@sankajlogistics.com', pass: 'password123' },
  SUPERVISOR: { email: 'priya.s@sankajlogistics.com', pass: 'password123' },
  INVENTORY_EXECUTIVE: { email: 'amit.verma@sankajlogistics.com', pass: 'password123' },
  PICKER: { email: 'rohan.d@sankajlogistics.com', pass: 'password123' },
  PACKER: { email: 'suresh.p@sankajlogistics.com', pass: 'password123' },
  VIEWER: { email: 'viewer@sankajlogistics.com', pass: 'password123' },
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { signInWithSupabase, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('admin@sankajlogistics.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // If already authenticated and modal is triggered, redirect to dashboard
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      onClose();
      router.push('/dashboard');
    }
  }, [isOpen, isAuthenticated, router, onClose]);

  // Handle body scroll lock & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    setTimeout(() => emailInputRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRolePresetChange = (role: UserRole) => {
    setSelectedRole(role);
    const creds = PRESET_CREDENTIALS[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.pass);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await signInWithSupabase({
      email,
      password,
      role: selectedRole,
    });

    setLoading(false);

    if (res.success) {
      onClose();
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'The email or password you entered is incorrect.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const res = await signInWithSupabase({
      email: 'google.user@sangkaj.com',
      password: 'google-sso-password-2026',
      role: 'SUPER_ADMIN',
    });
    setLoading(false);
    if (res.success) {
      onClose();
      router.push('/dashboard');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-navy-900 border border-slate-800 w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100 selection:bg-royal-600 selection:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-orange-600/20 flex-shrink-0">
              S
            </div>
            <div className="text-left leading-tight">
              <div className="text-base font-extrabold tracking-wider text-white">
                SANKAJ <span className="text-orange-500 font-semibold">LOGISTICS LIMITED</span>
              </div>
              <span className="block text-[10px] text-slate-400 font-medium">Enterprise Warehouse Management System</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-2">
            Sign In to Enterprise Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter credentials or choose a role preset to access the dashboard.
          </p>
        </div>

        {errorMsg && (
          <AuthAlert
            error={errorMsg}
            onRetry={() => {
              setErrorMsg('');
              setTimeout(() => emailInputRef.current?.focus(), 50);
            }}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-slate-300 mb-1">Corporate Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                required
              />
            </div>
          </div>

          {/* Quick Demo Role Selector */}
          <div>
            <label className="block text-slate-300 mb-1 flex justify-between">
              <span>Select Access Role Preset (Demo)</span>
              <span className="text-royal-400 text-[10px]">Auto-fills demo user</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => handleRolePresetChange(e.target.value as UserRole)}
              className="w-full py-2.5 px-3 rounded-xl bg-navy-950 border border-slate-800 text-royal-300 font-bold text-xs outline-none focus:border-royal-500 cursor-pointer"
            >
              <option value="SUPER_ADMIN">Super Admin (Full System Control)</option>
              <option value="COMPANY_ADMIN">Company Admin (Company Scope)</option>
              <option value="WAREHOUSE_MANAGER">Warehouse Manager (Facility Scope)</option>
              <option value="SUPERVISOR">Supervisor (Ops Supervision)</option>
              <option value="INVENTORY_EXECUTIVE">Inventory Executive (Stock Master)</option>
              <option value="PICKER">Picker (Outbound Dispatch Console)</option>
              <option value="PACKER">Packer (Outbound Packing Station)</option>
              <option value="VIEWER">Viewer (Read-Only Portal)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center text-slate-400 gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-navy-950 border-slate-700 text-royal-600 focus:ring-0"
              />
              Remember me (7 Days)
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to corporate administrator.')}
              className="text-royal-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 shadow-lg shadow-royal-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                Sign In to Portal <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
              <span className="bg-navy-900 px-3">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-navy-950 border border-slate-800 hover:bg-slate-800/80 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            Google Enterprise Single Sign-On
          </button>
        </div>
      </div>
    </div>
  );
}
