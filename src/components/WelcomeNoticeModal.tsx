import React, { useEffect, useState } from 'react';
import { X, Gift, CreditCard, Banknote, Percent, Users, MessageCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SESSION_KEY = 'topmoney24_welcome_seen';

export const WelcomeNoticeModal: React.FC = () => {
  const { settings } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show once per browser tab/session, not on every page the person visits.
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setOpen(true);
    }
  }, []);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  const rows = [
    { icon: <Gift className="w-4 h-4 text-amber-500" />, label: 'স্বাগতম বোনাস', value: `৳${settings.welcomeBonus}` },
    { icon: <CreditCard className="w-4 h-4 text-blue-500" />, label: 'সর্বনিম্ন জমা', value: `৳${settings.minDeposit}` },
    { icon: <Banknote className="w-4 h-4 text-emerald-500" />, label: 'সর্বনিম্ন উত্তোলন', value: `৳${settings.minWithdraw}` },
    { icon: <Percent className="w-4 h-4 text-rose-500" />, label: 'উত্তোলনের ফি', value: `${settings.withdrawFeePercent}%` },
    { icon: <Users className="w-4 h-4 text-cyan-500" />, label: 'রেফারেল কমিশন', value: `${settings.referralBonusPercent}%` },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-700 max-w-sm w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="text-center flex-1 space-y-1">
            <h2 className="text-xl font-black text-emerald-400">Top Money 24</h2>
            <p className="text-xs text-slate-400">সাথে থাকুন, সফল হন</p>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white transition shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {settings.siteNotice && (
          <p className="text-xs text-slate-300 bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
            {settings.siteNotice}
          </p>
        )}

        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5">
              <span className="flex items-center gap-2 text-sm text-slate-300">
                {r.icon}
                {r.label}
              </span>
              <span className="text-sm font-bold text-emerald-400">{r.value}</span>
            </div>
          ))}
        </div>

        {(settings.supportWhatsapp || settings.supportTelegram) && (
          <div className="flex gap-3 pt-1">
            {settings.supportWhatsapp && (
              <a
                href={`https://wa.me/${settings.supportWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            )}
            {settings.supportTelegram && (
              <a
                href={settings.supportTelegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold transition"
              >
                <Send className="w-4 h-4" />
                Telegram
              </a>
            )}
          </div>
        )}

        <button
          onClick={close}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-sm font-bold transition"
        >
          বুঝেছি, এগিয়ে যাই
        </button>
      </div>
    </div>
  );
};
