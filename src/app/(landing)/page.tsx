'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginModal } from '@/components/auth/LoginModal';
import {
  Warehouse,
  Box,
  Package,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const features = [
    {
      icon: <Warehouse className="w-6 h-6 text-royal-400" />,
      title: 'Warehouse Management',
      description: 'Manage multi-tenant warehouses, capacity planning, working hours, rental costs, and real-time occupancy rates.',
    },
    {
      icon: <Box className="w-6 h-6 text-emerald-400" />,
      title: 'Asset Tracking & EAM',
      description: 'Track forklifts, printers, scanners, generators, laptops with QR/Barcode generation, maintenance schedules, and assignment logs.',
    },
    {
      icon: <Package className="w-6 h-6 text-amber-400" />,
      title: 'Inventory Control',
      description: 'Granular SKU tracking down to Rack, Shelf, Bin level with min/max stock safety alerts and automated batch management.',
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      title: 'Inbound & Outbound Workflows',
      description: 'End-to-end multi-step receiving (GRN, Put-away) and order dispatch (Picking, Packing, Gate Pass) with timestamp logs.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
      title: 'Role Based Access Control (RBAC)',
      description: '8 granular roles from Super Admin to Picker & Packer with isolated view rights and action permissions.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cyan-400" />,
      title: 'Enterprise Analytics & PDF Reports',
      description: 'Real-time Recharts dashboards, inventory trends, capacity heatmaps, and instant PDF/Excel export engines.',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      role: 'VP of Supply Chain Operations',
      company: 'Sangkaj Enterprises Ltd.',
      quote: 'Ennea – Sangkaj transformed our 4 mega hubs. We reduced dock turnaround time by 38% within the first month of deployment.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Priya Sundaram',
      role: 'Head of Industrial Assets',
      company: 'Apex Global Logistics',
      quote: 'The asset tracking with QR/barcode generation gave us 100% visibility over our heavy forklifts and mobile scanners.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does Ennea – Sangkaj handle multi-warehouse organizations?',
      a: 'Ennea provides clean multi-tenancy. Super Admins and Company Admins can add unlimited warehouses, assign dedicated managers, and filter inventory or assets globally or per facility.',
    },
    {
      q: 'What roles are supported out of the box?',
      a: '8 enterprise roles: Super Admin, Company Admin, Warehouse Manager, Supervisor, Inventory Executive, Picker, Packer, and Viewer.',
    },
    {
      q: 'Can we export reports for audits?',
      a: 'Yes, all modules support 1-click export to PDF, Microsoft Excel (.xlsx), and CSV formats with official timestamp headers.',
    },
    {
      q: 'Is Ennea ready for integration with SAP or Oracle ERPs?',
      a: 'Absolutely. The architecture is modular and exposes clean REST API endpoints for Goods Receipt Notes (GRN), PO matching, and stock sync.',
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-royal-600 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-royal-600 to-royal-400 flex items-center justify-center font-bold text-white shadow-lg shadow-royal-500/20 group-hover:scale-105 transition-transform">
              E
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-wider text-white">
                ENNEA <span className="text-royal-400 font-semibold">SANGKAJ</span>
              </span>
              <span className="block text-[10px] text-slate-400 tracking-tight">Enterprise WMS & EAM</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="text-royal-400 font-semibold">Home</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <span className="flex items-center gap-1 text-slate-400 cursor-not-allowed">
              Pricing <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-royal-950 text-royal-400 border border-royal-800">Coming Soon</span>
            </span>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleSignInClick}
              className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 rounded-xl shadow-lg shadow-royal-900/50 hover:shadow-royal-600/30 transition-all flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-900 border-b border-slate-800 px-6 py-4 space-y-3 text-sm">
            <Link href="/" className="block py-1 text-royal-400 font-semibold">Home</Link>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300">Features</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300">Solutions</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300">Testimonials</a>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleSignInClick(e);
                }}
                className="w-full py-2 text-center text-slate-200 bg-slate-800 rounded-xl font-semibold"
              >
                Sign In
              </button>
              <Link href="/dashboard" className="w-full py-2 text-center text-white bg-royal-600 rounded-xl font-semibold">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Background Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-royal-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-royal-950/80 border border-royal-800/80 text-royal-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-royal-400" />
            <span>Phase 1 Enterprise Release • Multi-Warehouse Ready</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Enterprise Asset & Warehouse Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-400 via-royal-300 to-cyan-400">Simplified</span>
          </h1>

          <p className="mt-6 text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Manage multi-tenant warehouses, inventory stock, industrial assets, employee roles, and inbound/outbound receiving workflows from one intelligent platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 rounded-2xl shadow-xl shadow-royal-900/50 hover:shadow-royal-600/40 transition-all flex items-center justify-center gap-2 group"
            >
              Launch Live WMS Portal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleSignInClick}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Access Enterprise Portal
            </button>
          </div>

          {/* Interactive Enterprise Mockup Showcase */}
          <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-slate-700/50 to-slate-900/90 border border-slate-700/80 shadow-2xl shadow-navy-950/80">
            <div className="rounded-2xl overflow-hidden bg-navy-950 border border-slate-800 p-6 text-left space-y-6">
              {/* Fake Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-3 text-xs font-mono text-slate-400">ennea-sangkaj.enterprise/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  WMS ENGINE ONLINE
                </div>
              </div>

              {/* Sample Metrics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Total Warehouses</p>
                  <p className="text-2xl font-bold text-white mt-1">4 Active</p>
                  <span className="text-[10px] text-emerald-400">92% Average Occupancy</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Asset Catalog</p>
                  <p className="text-2xl font-bold text-royal-400 mt-1">1,240 Assets</p>
                  <span className="text-[10px] text-slate-400">QR/Barcode Verified</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Inbound Shipments</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">18 Today</p>
                  <span className="text-[10px] text-emerald-400">9-Step GRN Engine</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Outbound Orders</p>
                  <p className="text-2xl font-bold text-indigo-400 mt-1">42 Dispatched</p>
                  <span className="text-[10px] text-indigo-400">Pallet & Batch Picked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 bg-navy-900/60 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-royal-400 mb-2">Architected for Scale</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              End-to-End Enterprise Operations Control
            </h3>
            <p className="text-slate-400 text-sm md:text-base mt-3">
              Built on Next.js 15, PostgreSQL, and Prisma ORM to ensure sub-100ms response times across global warehouse networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-navy-950 border border-slate-800/80 hover:border-royal-500/50 hover:shadow-xl hover:shadow-royal-900/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions / Module Overview Section */}
      <section id="solutions" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Streamlined Receiving</span>
              <h3 className="text-3xl font-extrabold text-white mt-2">
                Inbound Receiving & Outbound Dispatch Visual Engines
              </h3>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                Eliminate receiving errors with automated 9-step inbound pipelines (Vehicle Reporting -&gt; Dock Allocation -&gt; Unload -&gt; Inspection -&gt; GRN -&gt; Put Away). Every action is time-stamped and assigned to an authorized warehouse executive.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Real-time GRN (Goods Receipt Note) generation & PO audit</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Batch, Loose, Case, and Pallet picking strategies</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Automated gate pass verification before dispatch</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/dashboard/inbound"
                  className="inline-flex items-center gap-2 text-sm font-bold text-royal-400 hover:text-royal-300"
                >
                  Explore Inbound Workflow <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-navy-900 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inbound Pipeline Status</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">LIVE TRACKER</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-royal-400">INB-2026-001</span>
                    <p className="text-slate-400">Tata International • Dock 04</p>
                  </div>
                  <span className="px-2 py-1 bg-royal-950 text-royal-300 font-bold rounded">Step 7: Staging (65%)</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-emerald-400">INB-2026-002</span>
                    <p className="text-slate-400">Reliance Industrial • Dock 02</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-950 text-emerald-300 font-bold rounded">Completed (100%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-navy-900/60 border-t border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-royal-400 mb-2">Trusted by Leaders</h2>
            <h3 className="text-3xl font-extrabold text-white">What Enterprise Leaders Say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 rounded-2xl bg-navy-950 border border-slate-800 space-y-4">
                <p className="text-sm text-slate-300 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-royal-500/30" />
                  <div>
                    <h5 className="text-sm font-bold text-white">{t.name}</h5>
                    <p className="text-xs text-slate-400">{t.role} • {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-royal-400 mb-2">Got Questions?</h2>
            <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-navy-900 border border-slate-800 text-left">
                <h4 className="text-base font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-slate-800/80 pt-16 pb-12 px-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-royal-600 flex items-center justify-center font-bold text-white">E</div>
              <span className="text-base font-extrabold text-white">ENNEA <span className="text-royal-400">SANGKAJ</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Enterprise Asset & Warehouse Management System Phase 1 MVP. Built for precision logistics.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Modules</h5>
            <ul className="space-y-2">
              <li><Link href="/dashboard/warehouses" className="hover:text-white">Warehouse Hub</Link></li>
              <li><Link href="/dashboard/assets" className="hover:text-white">Asset Tracking</Link></li>
              <li><Link href="/dashboard/inventory" className="hover:text-white">Inventory Control</Link></li>
              <li><Link href="/dashboard/inbound" className="hover:text-white">Inbound Receiving</Link></li>
              <li><Link href="/dashboard/outbound" className="hover:text-white">Outbound Dispatch</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Legal & Governance</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Enterprise Service</a></li>
              <li><a href="#" className="hover:text-white">Security & RBAC Compliance</a></li>
              <li><a href="#" className="hover:text-white">Audit Logs</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Contact Support</h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-royal-400" /> BKC Financial Tower, Mumbai</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-royal-400" /> +91 22 4918 2000</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-royal-400" /> support@sangkaj.com</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Ennea – Sangkaj Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="hover:text-slate-300">Twitter</span>
            <span className="hover:text-slate-300">LinkedIn</span>
            <span className="hover:text-slate-300">GitHub</span>
          </div>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
