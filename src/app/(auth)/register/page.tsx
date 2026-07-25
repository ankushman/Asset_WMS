'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/lib/rbac';
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { AuthAlert } from '@/components/auth/AuthAlert';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithSupabase } = useAuthStore();

  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('COMPANY_ADMIN');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await signUpWithSupabase({
      email,
      password,
      name: fullName,
      companyName,
      role: selectedRole,
    });

    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-royal-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-royal-600 to-royal-400 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-royal-500/20">
            E
          </div>
          <div className="text-left">
            <span className="text-xl font-extrabold tracking-wider text-white">
              ENNEA <span className="text-royal-400">SANGKAJ</span>
            </span>
            <span className="block text-xs text-slate-400">Supabase Auth Onboarding</span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-white tracking-tight">
          Register New Organization
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Create your enterprise user account with Email & Password via Supabase Auth.
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

          <form onSubmit={handleRegister} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-300 mb-1">Company / Entity Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Sangkaj Logistics Ltd."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Administrator Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Deepak Sangkaj"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
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
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Initial Enterprise Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full py-2.5 px-3 rounded-xl bg-navy-950 border border-slate-800 text-royal-300 font-bold text-xs outline-none focus:border-royal-500"
              >
                <option value="SUPER_ADMIN">Super Admin (Full Platform Control)</option>
                <option value="COMPANY_ADMIN">Company Admin (Company Scope)</option>
                <option value="WAREHOUSE_MANAGER">Warehouse Manager (Facility Scope)</option>
                <option value="SUPERVISOR">Supervisor (Ops Supervision)</option>
                <option value="INVENTORY_EXECUTIVE">Inventory Executive (Stock Master)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 shadow-lg shadow-royal-900/50 flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Supabase Account...</span>
              ) : (
                <>
                  Register with Supabase <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-royal-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
