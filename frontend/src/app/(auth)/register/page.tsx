'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, Mail, Lock, User, ArrowRight, Phone, MapPin, Factory, Eye, EyeOff, Warehouse, FileText } from 'lucide-react';
import { AuthAlert } from '@/components/auth/AuthAlert';

const INDUSTRY_OPTIONS = [
  'Logistics & Supply Chain',
  'Manufacturing',
  'E-Commerce & Retail',
  'Pharmaceutical & Healthcare',
  'Automotive',
  'Food & Beverage',
  'FMCG',
  'Electronics & Technology',
  'Construction & Infrastructure',
  'Agriculture & Agri-Tech',
  'Other',
];

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithSupabase, isAuthenticated } = useAuthStore();

  // Company Information
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [warehouseCount, setWarehouseCount] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Admin Information
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validate password match
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const res = await signUpWithSupabase({
      email: workEmail,
      password,
      name: fullName,
      phone: mobileNumber,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      industry,
      warehouseCount: warehouseCount ? parseInt(warehouseCount) : undefined,
      gstNumber: gstNumber || undefined,
    });

    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-royal-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
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
          Register New Organization
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Set up your company account. The first user will be assigned <span className="text-royal-400 font-bold">Super Admin</span> access automatically.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-navy-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {errorMsg && (
            <AuthAlert
              error={errorMsg}
              onRetry={() => setErrorMsg('')}
              className="mb-6"
            />
          )}

          <form onSubmit={handleRegister} className="space-y-6 text-xs font-medium">
            {/* Company Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                <Building2 className="w-4 h-4 text-royal-400" />
                <h3 className="text-sm font-bold text-white">Company Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">Company Name <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Sankaj Logistics Ltd."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Company Email <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="info@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Company Phone <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="+91 22 4918 2000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Industry <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Factory className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white focus:outline-none focus:border-royal-500 text-xs appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Industry</option>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1">Company Address <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Plot 42, Bhiwandi Logistics Corridor, Mumbai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Number of Warehouses <span className="text-slate-500">(Optional)</span></label>
                  <div className="relative">
                    <Warehouse className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      min="0"
                      value={warehouseCount}
                      onChange={(e) => setWarehouseCount(e.target.value)}
                      placeholder="e.g. 4"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">GST Number <span className="text-slate-500">(Optional)</span></label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 27AABCS1429B1ZS"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                <User className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Administrator Information</h3>
                <span className="ml-auto text-[10px] text-royal-400 bg-royal-950 px-2 py-0.5 rounded border border-royal-800 font-bold">AUTO: SUPER ADMIN</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">Full Name <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Deepak Sankaj"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Work Email <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1">Mobile Number <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Password <span className="text-rose-400">*</span></label>
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
                      autoComplete="new-password"
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

                <div>
                  <label className="block text-slate-300 mb-1">Confirm Password <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 text-xs"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 shadow-lg shadow-royal-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Enterprise Account...</span>
              ) : (
                <>
                  Register Company & Create Admin <ArrowRight className="w-4 h-4" />
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
