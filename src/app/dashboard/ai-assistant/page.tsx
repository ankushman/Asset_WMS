'use client';

import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Trash2, ArrowRight } from 'lucide-react';
import { useAiStore } from '@/store/useAiStore';

export default function AiAssistantPage() {
  const { chatHistory, addMessage, clearChat } = useAiStore();
  const [inputQuery, setInputQuery] = useState('');

  const PRESET_QUERIES = [
    'How many shipments are delayed today?',
    'Show today\'s inbound summary.',
    'Which warehouse has the highest occupancy?',
    'Which forklifts require maintenance this week?',
    'Show inventory below minimum stock.',
    'Why did Warehouse 3 miss its SLA yesterday?',
  ];

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    // 1. Add User message
    addMessage(textToSend, 'USER');
    setInputQuery('');

    // 2. Generate simulated AI Contextual Answer based on query keywords
    setTimeout(() => {
      let responseText = '';
      let structuredData = null;

      const lower = textToSend.toLowerCase();

      if (lower.includes('delayed') || lower.includes('shipment')) {
        responseText = 'Currently, 1 shipment (Trip TRP-2026-8802 to Jaipur) is experiencing a 1.5-hour delay due to severe monsoon rain on Highway 17. 1 other shipment (TRP-2026-8801) arrived 15 minutes ahead of schedule.';
      } else if (lower.includes('inbound') || lower.includes('receiving')) {
        responseText = 'Today\'s Inbound Summary:\n• Total Receiving Shipments: 3 Shipments\n• Completed GRNs: 2 (850 units total)\n• Active Dock: Dock 01 (Mumbai Central Hub)\n• Avg Dock-to-Stock SLA: 2.4 hours (Meeting Target).';
      } else if (lower.includes('occupancy') || lower.includes('highest')) {
        responseText = 'Mumbai Central Mega Hub has the highest occupancy at 84% capacity (63,000 / 75,000 Sq Ft utilized). Delhi North Logistics Park is at 72% capacity.';
      } else if (lower.includes('forklift') || lower.includes('maintenance')) {
        responseText = 'Equipment Maintenance Alert:\n• Jungheinrich Electric Stacker (MHE-STK-09) at Delhi Hub has a battery charge of 18% and requires scheduled seal replacement.\n• Toyota 3-Ton Forklift (MHE-FRK-01) is in EXCELLENT health (85% battery).';
      } else if (lower.includes('min') || lower.includes('stock')) {
        responseText = 'Inventory Items Below Minimum Safety Level:\n1. SKU-HD-BARCODE-01 (Honeywell Handheld Scanner) - 4 units available (Min target: 10)\n2. SKU-PALLET-WRAP-99 (Heavy Duty Wrap) - 8 rolls available (Min target: 20).';
      } else if (lower.includes('sla') || lower.includes('warehouse 3')) {
        responseText = 'Delhi Logistics Park missed its same-day dispatch SLA yesterday for customer Reliance Industrial Supplies because order picking stalled during shift handover at 02:00 PM (+1.2 hours delay). Estimated SLA penalty fee: ₹10,000.';
      } else {
        responseText = `I have analyzed your query "${textToSend}" against real-time operational data across Mumbai Hub and Delhi Logistics Park. All metrics comply with active RBAC role security controls.`;
      }

      addMessage(responseText, 'AI', structuredData);
    }, 400);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-royal-600 flex items-center justify-center text-white font-bold shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Enterprise Conversational AI Assistant
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                Online
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Natural language intelligence engine for instant operational queries, SLA breakdown, and automated purchase requests.
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Query Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
        <span className="text-[10px] font-bold uppercase text-slate-400 whitespace-nowrap">Suggested Questions:</span>
        {PRESET_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-royal-500 hover:text-royal-500 font-medium whitespace-nowrap transition-all flex-shrink-0 shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-4 shadow-sm">
        {chatHistory.map((msg) => {
          const isAi = msg.sender === 'AI';
          return (
            <div key={msg.id} className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-royal-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs max-w-xl shadow-xs leading-relaxed ${
                  isAi
                    ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    : 'bg-royal-600 text-white font-medium'
                }`}
              >
                <div className="flex justify-between items-center mb-1 text-[10px] opacity-70">
                  <span className="font-bold">{isAi ? 'Ennea AI Engine' : 'You'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI anything (e.g. Which warehouse missed SLA yesterday?)..."
          className="flex-1 p-3.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-slate-900 dark:text-white shadow-sm focus:border-royal-500 transition-all"
        />
        <button
          type="submit"
          className="px-5 py-3.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-2xl shadow-md flex items-center gap-2 transition-all"
        >
          <Send className="w-4 h-4" /> Send Query
        </button>
      </form>
    </div>
  );
}
