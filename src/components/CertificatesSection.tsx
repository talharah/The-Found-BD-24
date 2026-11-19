import React from 'react';
import { Award, ShieldCheck, CheckCircle2, QrCode, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CertificatesSection: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
          ভেরিফাইড ও বিশ্বস্ত প্ল্যাটফর্ম
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          সার্টিফিকেট ও সদস্য পরিচয়পত্র
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Top Money 24 একটি নিবন্ধিত ডিজিটাল ই-লার্নিং ও মাইক্রো-টাস্ক প্ল্যাটফর্ম। গ্রাহকদের নিরাপত্তা ও স্বচ্ছতাই আমাদের প্রধান অঙ্গীকার।
        </p>
      </div>

      {/* 3 Real Certificates Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Certificate 1 */}
        <article className="rounded-2xl p-5 border border-blue-200 bg-gradient-to-br from-white to-blue-50/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              REG: TM24-GOV-981
            </span>
          </div>

          <div className="my-4">
            <div className="text-[10px] font-black tracking-widest text-blue-700 uppercase">TOP MONEY 24 LTD.</div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">ডিজিটাল কমার্স নিবন্ধন সনদ</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              আইটি এবং ডিজিটাল মাইক্রো-টাস্ক সেবা পরিচালনায় অনুমোদিত অনলাইন এন্টারপ্রাইজ স্বীকৃতি সনদপত্র।
            </p>
          </div>

          <div className="border-t border-blue-200/80 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
            <span>ভেরিফিকেশন: সক্রিয়</span>
            <span className="text-emerald-700 font-bold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> সার্টিফাইড
            </span>
          </div>
        </article>

        {/* Certificate 2 */}
        <article className="rounded-2xl p-5 border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              ISO: 27001-SEC
            </span>
          </div>

          <div className="my-4">
            <div className="text-[10px] font-black tracking-widest text-emerald-700 uppercase">TOP MONEY 24 LTD.</div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">সিকিউর ডেটা ও পেমেন্ট সনদ</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              গ্রাহকের লেনদেন, ওয়ালেট সিকিউরিটি ও ২৪/৭ ডেটা এনক্রিপশন সিস্টেমের নিরাপত্তা প্রত্যয়নপত্র।
            </p>
          </div>

          <div className="border-t border-emerald-200/80 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
            <span>ভেরিফিকেশন: সক্রিয়</span>
            <span className="text-emerald-700 font-bold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> সার্টিফাইড
            </span>
          </div>
        </article>

        {/* Certificate 3 */}
        <article className="rounded-2xl p-5 border border-indigo-200 bg-gradient-to-br from-white to-indigo-50/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              QMS: 9001-2026
            </span>
          </div>

          <div className="my-4">
            <div className="text-[10px] font-black tracking-widest text-indigo-700 uppercase">TOP MONEY 24 LTD.</div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">গুণমান ও পারফরম্যান্স সনদ</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              সদস্যদের দ্রুত পেমেন্ট ডিসবার্সমেন্ট ও মানসম্মত ডিজিটাল ওয়ার্কপ্লেস এনভায়রনমেন্ট স্বীকৃতি।
            </p>
          </div>

          <div className="border-t border-indigo-200/80 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
            <span>ভেরিফিকেশন: সক্রিয়</span>
            <span className="text-emerald-700 font-bold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> সার্টিফাইড
            </span>
          </div>
        </article>

      </div>

      {/* Official Member Identification Cards */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              অফিশিয়াল মেম্বার পরিচিতি কার্ড
            </h3>
            <p className="text-xs text-slate-500">
              প্ল্যাটফর্মের নিবন্ধিত সম্মানিত অ্যাক্টিভ সদস্য পরিচিতি ও টিয়ার সুবিধা
            </p>
          </div>
        </div>

        {currentUser ? (
          <div className="max-w-md mx-auto">
            <article className="rounded-2xl border-2 border-blue-400 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50 overflow-hidden shadow-lg card-3d">
              <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-white px-5 py-3 flex justify-between items-center">
                <span className="text-xs font-black tracking-widest">TOP MONEY 24 • OFFICIAL ID</span>
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="p-5 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {currentUser.name.slice(0, 1)}
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">{currentUser.name}</h4>
                  <div className="text-xs text-blue-700 font-bold">ভেরিফাইড মেম্বার ({currentUser.role === 'admin' ? 'সুপার অ্যাডমিন' : 'সদস্য'})</div>
                  <div className="text-[11px] text-slate-500 font-mono font-semibold">মোবাইল: {currentUser.phone}</div>
                  <div className="text-[10px] text-emerald-600 font-mono font-bold">রেফার আইডি: {currentUser.referCode}</div>
                </div>
              </div>
              <div className="px-5 pb-3.5 pt-2 flex justify-between items-center text-[10px] text-slate-500 border-t border-blue-100 bg-blue-50/40">
                <span>যোগদানের তারিখ: {currentUser.joinedAt}</span>
                <span className="text-emerald-700 font-black flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> সক্রিয় ভেরিফাইড সদস্য
                </span>
              </div>
            </article>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <article className="rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-4 space-y-2 card-3d">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-blue-900">সিলভার মেম্বারশিপ</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs text-slate-600">রেজিস্ট্রেশন করলেই সিলভার মেম্বার স্ট্যাটাস সক্রিয় হয় এবং দৈনিক মাইক্রো টাস্কের সুযোগ পাওয়া যায়।</div>
              <div className="text-[10px] text-emerald-600 font-bold pt-1">ভেরিফায়েড অ্যাক্টিভেশন ✓</div>
            </article>

            <article className="rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 p-4 space-y-2 card-3d">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-amber-900">গোল্ড মেম্বারশিপ</span>
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xs text-slate-600">যেকোনো প্রিমিয়াম প্যাকেজ এক্টিভেশন করলে গোল্ড বেনিফিট এবং অগ্রাধিকারভিত্তিতে পে-আউট প্রযোজ্য।</div>
              <div className="text-[10px] text-amber-700 font-bold pt-1">উচ্চ আয়ের সুবিধা ✓</div>
            </article>

            <article className="rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50 p-4 space-y-2 card-3d">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-purple-900">ভিআইপি ডায়মন্ড মেম্বার</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xs text-slate-600">বড় ইনভেস্টমেন্ট ও হাই-রিটার্ন প্যাকেজ গ্রাহকদের জন্য আনলিমিটেড ফাস্ট উইথড্র ও ২৪/৭ ডেডিকেটেড ম্যানেজার।</div>
              <div className="text-[10px] text-purple-700 font-bold pt-1">সর্বোচ্চ প্রায়োরিটি ✓</div>
            </article>

          </div>
        )}
      </div>

    </section>
  );
};
