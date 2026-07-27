'use client';

import React, { useState } from 'react';
import { Building2, Plus, Search, Edit2, Trash2, Globe, Phone, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { MockCompany } from '@/lib/mock-data';

export default function CompaniesPage() {
  const { companies, addCompany, updateCompany, deleteCompany } = useWarehouseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ACTIVE');

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setGstNumber('');
    setAddress('');
    setPhone('');
    setEmail('');
    setLogo('');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: MockCompany) => {
    setEditingId(c.id);
    setName(c.name);
    setGstNumber(c.gstNumber);
    setAddress(c.address);
    setPhone(c.phone);
    setEmail(c.email);
    setLogo(c.logo);
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCompany(editingId, { name, gstNumber, address, phone, email, logo, status });
    } else {
      addCompany({
        name,
        gstNumber,
        address,
        phone,
        email,
        logo: logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
        status,
        warehouseCount: 0,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Company & Multi-Tenant Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Super Admin hub to manage registered entities and multi-tenant warehouse allocations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Company Entity
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name or GST number..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-800"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.name}</h3>
                  <span className="text-[11px] font-mono text-royal-600 dark:text-royal-400 font-semibold">
                    GST: {c.gstNumber}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                  c.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-800 py-3">
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> {c.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-500">
                Warehouses Owned: <strong className="text-slate-900 dark:text-white">{c.warehouseCount || 2} facilities</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-royal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCompany(c.id)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingId ? 'Edit Company Entity' : 'Create New Company Entity'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sankaj Logistics Limited"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GST Number</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="27AAACS1234F1Z5"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 22 4918 2000"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="corp@sangkaj.com"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="Suite 401, Apex Financial Tower, BKC, Mumbai"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-royal-600 rounded-xl hover:bg-royal-700 shadow-md"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
