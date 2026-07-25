'use client';

import React from 'react';
import { QrCode, Barcode as BarcodeIcon, Printer } from 'lucide-react';

interface BarcodeQRGeneratorProps {
  code: string;
  type?: 'barcode' | 'qrcode';
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showPrint?: boolean;
}

export function BarcodeQRGenerator({
  code,
  type = 'barcode',
  title,
  subtitle,
  size = 'md',
  showPrint = true,
}: BarcodeQRGeneratorProps) {
  const handlePrint = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head>
          <title>Print Label - ${code}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .label-box { border: 2px solid #000; padding: 15px; display: inline-block; border-radius: 8px; }
            .code-text { font-family: monospace; font-weight: bold; font-size: 16px; margin-top: 8px; letter-spacing: 2px; }
            .title { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
            .sub { font-size: 11px; color: #555; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <div class="label-box">
            ${title ? `<div class="title">${title}</div>` : ''}
            ${subtitle ? `<div class="sub">${subtitle}</div>` : ''}
            <div style="font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 3px; padding: 10px; background: #f0f0f0; border-radius: 4px; display: inline-block;">
              ${code}
            </div>
            <div class="code-text">${code}</div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
      {title && <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{title}</h4>}
      {subtitle && <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3">{subtitle}</p>}

      {type === 'qrcode' ? (
        <div className="relative bg-white p-3 rounded-lg border border-slate-200 shadow-inner flex flex-col items-center">
          <QrCode className="w-24 h-24 text-slate-900" />
          <span className="text-[10px] font-mono font-bold text-slate-800 tracking-wider mt-1">{code}</span>
        </div>
      ) : (
        <div className="relative bg-white p-3 rounded-lg border border-slate-200 shadow-inner flex flex-col items-center w-full max-w-[240px]">
          {/* Simulated Industrial 128 Barcode Pattern */}
          <div className="flex items-center justify-center space-x-[2px] h-14 w-full py-1">
            {code.split('').map((char, i) => {
              const codeVal = char.charCodeAt(0);
              const width = (codeVal % 3) + 1; // 1, 2, or 3px
              const isTransparent = i % 4 === 0;
              return (
                <div
                  key={i}
                  className={`h-full ${isTransparent ? 'bg-transparent w-1' : 'bg-slate-950'}`}
                  style={{ width: `${width}px` }}
                />
              );
            })}
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 tracking-widest mt-1 uppercase">{code}</span>
        </div>
      )}

      {showPrint && (
        <button
          onClick={handlePrint}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5 text-royal-600 dark:text-royal-400" />
          Print Label
        </button>
      )}
    </div>
  );
}
