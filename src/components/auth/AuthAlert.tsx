'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { formatAuthError } from '@/lib/auth-errors';

interface AuthAlertProps {
  error: string | null;
  onRetry?: () => void;
  className?: string;
}

export function AuthAlert({ error, onRetry, className = '' }: AuthAlertProps) {
  if (!error) return null;

  const formatted = formatAuthError(error);

  return (
    <div className={`p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs shadow-md space-y-2 animate-in fade-in duration-200 ${className}`}>
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-bold text-white text-xs">{formatted.title}</div>
          <p className="text-[11px] text-rose-300 mt-0.5 leading-relaxed">{formatted.message}</p>
        </div>
      </div>

      {formatted.showTryAgain && onRetry && (
        <div className="pt-1 text-right">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white bg-rose-800 hover:bg-rose-700 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
