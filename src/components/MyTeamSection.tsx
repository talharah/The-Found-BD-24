import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Wallet, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
  totalDeposited: number;
  status: string;
  isActive: boolean;
}

interface TeamTier {
  members: TeamMember[];
  totalInvite: number;
  validInvite: number;
  totalInvestment: number;
  totalIncome: number;
}

interface TeamData {
  totalIncome: number;
  totalInvitation: number;
  teamInvestment: number;
  teamProfitPercent: number;
  teams: { A: TeamTier; B: TeamTier; C: TeamTier };
}

export const MyTeamSection: React.FC = () => {
  const { currentUser } = useApp();
  const [data, setData] = useState<TeamData | null>(null);
  const [activeTier, setActiveTier] = useState<'A' | 'B' | 'C'>('A');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    api.getTeam()
      .then((res: TeamData) => setData(res))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto text-center p-8 bg-white border border-slate-200 rounded-3xl text-sm text-slate-600">
        আপনার টিম দেখতে অনুগ্রহ করে লগইন করুন।
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto text-center p-8 text-sm text-slate-500">লোড হচ্ছে...</div>;
  }

  if (error || !data) {
    return <div className="max-w-3xl mx-auto text-center p-8 text-sm text-red-500">{error || 'ডেটা পাওয়া যায়নি।'}</div>;
  }

  const tier = data.teams[activeTier];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-black text-slate-900">আমার টিম</h2>
      </div>

      {/* Summary card */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-5 sm:p-6 text-slate-900 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-950/70">মোট টিম ইনকাম</p>
        <p className="text-3xl sm:text-4xl font-black mt-1">৳{data.totalIncome.toFixed(2)}</p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/30 rounded-2xl p-3">
            <p className="text-xl font-black">{data.totalInvitation}</p>
            <p className="text-[11px] font-semibold text-amber-950/70">মোট ইনভাইট</p>
          </div>
          <div className="bg-white/30 rounded-2xl p-3">
            <p className="text-xl font-black">৳{data.teamInvestment.toFixed(2)}</p>
            <p className="text-[11px] font-semibold text-amber-950/70">টিম বিনিয়োগ</p>
          </div>
        </div>
      </div>

      {/* Tier tabs */}
      <div className="flex gap-2">
        {(['A', 'B', 'C'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTier(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              activeTier === t
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            টিম {t}
            <span className="block text-[11px] font-medium opacity-80">{data.teams[t].totalInvite} সদস্য</span>
          </button>
        ))}
      </div>

      {/* Tier stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">{tier.totalInvite}</p>
            <p className="text-[11px] text-slate-500">মোট ইনভাইট</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">{tier.validInvite}</p>
            <p className="text-[11px] text-slate-500">ভ্যালিড ইনভাইট</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">৳{tier.totalIncome.toFixed(2)}</p>
            <p className="text-[11px] text-slate-500">এই টিয়ার থেকে আয়</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
            <span className="text-xs font-black">%</span>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">{data.teamProfitPercent}%</p>
            <p className="text-[11px] text-slate-500">টিম প্রফিট রেট</p>
          </div>
        </div>
      </div>

      {/* Member list */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">টিম {activeTier} সদস্যরা</h3>
        {tier.members.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-8">টিম {activeTier}-এ এখনো কোনো সদস্য নেই।</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tier.members.map(m => (
              <li key={m.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                  <p className="text-[11px] text-slate-400">{m.phone} &middot; যোগদান: {m.joinedAt.slice(0, 10)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">৳{m.totalDeposited.toFixed(2)}</p>
                  <p className={`text-[11px] font-semibold ${m.isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {m.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
