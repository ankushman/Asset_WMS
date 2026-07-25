'use client';

import React from 'react';
import { FolderKanban, Upload, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useDocumentStore } from '@/store/useDocumentStore';

export default function DocumentsPage() {
  const { documents } = useDocumentStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Enterprise Document Vault & Repository
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store and verify Invoices, Purchase Orders, GRNs, Proof of Delivery (POD), Asset Warranties, and Inspection Certificates.
          </p>
        </div>

        <button className="px-4 py-2.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl shadow-md flex items-center gap-2 transition-all">
          <Upload className="w-4 h-4" /> Upload Enterprise Document
        </button>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                {doc.category}
              </span>
              <span className="font-mono text-[10px] text-slate-400">{doc.version}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{doc.title}</h3>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>Uploaded By: <strong className="text-slate-800 dark:text-slate-200">{doc.uploadedBy}</strong></p>
              <p>Date: <span className="font-mono">{doc.uploadedAt}</span> | Size: <span className="font-mono">{doc.fileSize}</span></p>
              <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> OCR Status: {doc.ocrStatus}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
