import React from 'react';
import { ShieldCheck, Award, Lock, Headphones, Send, Phone, Mail, HelpCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutSection: React.FC = () => {
  const { settings } = useApp();

  const faqs = [
    {
      q: 'Top Money 24 কী ধরনের প্ল্যাটফর্ম?',
      a: 'Top Money 24 হলো বাংলাদেশের একটি ভেরিফাইড মাইক্রো-টাস্ক ও ইনভেস্টমেন্ট আর্নিং নেটওয়ার্ক। এখানে গ্রাহকরা প্রতিদিন ছোট ছোট ডিজিটাল কাজ সম্পন্ন করে ও আকর্ষণীয় প্যাকেজ এক্টিভ করে ঘরে বসেই নিয়মিত উপার্জন করতে পারেন।'
    },
    {
      q: 'ডিপোজিট করার পর ব্যালেন্স যোগ হতে কতক্ষণ সময় লাগে?',
      a: 'সঠিক ট্রানজেকশন আইডি (TrxID) দিয়ে সাবমিট করার পর আমাদের অটোমেটেড ও ম্যানুয়াল ভেরিফিকেশন সিস্টেম ৫ থেকে ১৫ মিনিটের মধ্যে সরাসরি আপনার অ্যাকাউন্টে টাকা যোগ করে।'
    },
    {
      q: 'উইথড্রয়াল টাকা কীভাবে ও কত দ্রুত পাওয়া যায়?',
      a: 'বিকাশ, নগদ বা রকেট অ্যাকাউন্টে সর্বনিম্ন ৳৩০০ টাকা থেকে উইথড্র দেওয়া যায়। সাধারণত ৩০ মিনিট থেকে ২ ঘণ্টার মধ্যে পেমেন্ট প্রসেসিং সফলভাবে সম্পন্ন হয়।'
    },
    {
      q: 'রেফারেল কমিশন সিস্টেম কীভাবে কাজ করে?',
      a: 'আপনার নিজস্ব রেফারেল লিংক শেয়ার করে বন্ধুদের যুক্ত করলে, বন্ধু যেকোনো প্যাকেজ এক্টিভ করার সাথে সাথে আপনি পাবেন তার মূল্যমানের ১০% ইনস্ট্যান্ট কমিশন।'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Platform Intro Card */}
      <div className="rounded-3xl card-3d p-6 sm:p-10 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>টপ মানি ২৪ সম্পর্কে</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          বিশ্বস্ততা ও নিরাপত্তার সাথে গড়ে তুলুন আপনার স্বাধীন আয়ের পথ
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          Top Money 24 একটি বিশ্বস্ত প্ল্যাটফর্ম হিসেবে গ্রাহকদের সর্বোচ্চ স্বচ্ছতা, দ্রুততম অটোমেটেড পে-আউট এবং ১০০% ডেটা নিরাপত্তা নিশ্চিত করে। আমাদের লক্ষ্য বাংলাদেশের তরুণ ও পেশাজীবীদের জন্য একটি নিরাপদ ডিজিটাল আয়ের পরিবেশ নিশ্চিত করা।
        </p>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">নিরাপদ পেমেন্ট গেটওয়ে</h4>
            <p className="text-xs text-slate-500">বিকাশ, নগদ ও রকেটের মাধ্যমে শতভাগ নিরাপদ ও স্বচ্ছ লেনদেন ব্যবস্থা।</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">২৪/৭ লাইভ কাস্টমার সাপোর্ট</h4>
            <p className="text-xs text-slate-500">যেকোনো প্রশ্ন বা সমস্যায় টেলিগ্রাম ও হোয়াটসঅ্যাপে দ্রুততম হেল্পলাইন।</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">নিয়মিত দৈনিক ইনকাম</h4>
            <p className="text-xs text-slate-500">প্রতিটি প্যাকেজে নির্দিষ্ট দৈনিক রিটার্ন এবং আকর্ষনীয় বোনাস পয়েন্ট।</p>
          </div>
        </div>
      </div>

      {/* Official Help & Contacts Card */}
      <div className="rounded-3xl card-3d p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center">
          <Headphones className="w-5 h-5 text-blue-600 mr-2" />
          সরাসরি হেল্পলাইন ও কাস্টমার কেয়ার
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={settings.supportTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-sky-50 border border-sky-200 hover:bg-sky-100/80 transition flex items-center space-x-3 text-sky-900"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">টেলিগ্রাম চ্যানেল ও সাপোর্ট</div>
              <div className="text-[11px] text-sky-700 font-mono mt-0.5">@TopMoney24Support</div>
            </div>
          </a>

          <a
            href={`https://wa.me/${settings.supportWhatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/80 transition flex items-center space-x-3 text-emerald-900"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">হোয়াটসঅ্যাপ অফিসিয়াল হেল্প</div>
              <div className="text-[11px] text-emerald-700 font-mono mt-0.5">{settings.supportWhatsapp}</div>
            </div>
          </a>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center space-x-3 text-purple-900">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">অফিশিয়াল সাপোর্ট ইমেইল</div>
              <div className="text-[11px] text-purple-700 font-mono mt-0.5">{settings.officialEmail}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-3xl card-3d p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center">
          <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
          সচরাচর জিজ্ঞাসিত প্রশ্নাবলি (FAQ)
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
