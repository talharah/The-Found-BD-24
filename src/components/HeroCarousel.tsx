import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Rocket, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Wallet, 
  CheckCircle2, 
  ShieldCheck, 
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';

import heroPayoutImg from '../assets/images/hero_payout_girl_1793563591935.jpg';

export const HeroCarousel: React.FC = () => {
  const { currentUser, setActiveTab, setIsAuthModalOpen, setAuthModalMode, setIsDepositModalOpen } = useApp();

  const slides = [
    {
      title: 'Top Money 24',
      subtitle: 'আয় করুন সহজে, কাজের মাধ্যমে!',
      description: 'সহজ ডিজিটাল মাইক্রো-টাস্ক সম্পন্ন করুন, বিকাশ, নগদ ও রকেটে দ্রুততম ক্যাশআউট নিন।',
      badge: 'ইনস্ট্যান্ট পে-আউট গ্যারান্টি'
    },
    {
      title: 'Top Money 24',
      subtitle: 'টাস্ক সম্পন্ন করুন, নিয়মিত উইথড্রয়াল নিন!',
      description: 'প্রতিটি টাস্ক এবং প্যাকেজ অ্যাক্টিভেশনে আকর্ষণীয় বোনাস ও ২৪/৭ নিরাপদ পেমেন্ট।',
      badge: 'ভেরিফাইড ও ১০০% নিরাপদ'
    },
    {
      title: 'Top Money 24',
      subtitle: 'স্মার্টভাবে কাজ করুন, এগিয়ে যান সফলতায়!',
      description: 'স্বচ্ছ কমিশন সিস্টেম, লাইভ ট্রানজেকশন ট্র্যাকিং এবং সেরা সাপোর্ট সুবিধা।',
      badge: 'সেরা আর্নিং প্ল্যাটফর্ম'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-2xl p-6 sm:p-8 lg:p-10 border border-cyan-500/30">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,210,255,0.2),transparent_55%)] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Copy Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-200 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>TOP MONEY 24 • EARN • TASK • WITHDRAW</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Top Money <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300">24</span>
          </h1>

          <h2 className="text-xl sm:text-3xl font-extrabold text-amber-300 leading-snug">
            {slides[currentSlide].subtitle}
          </h2>

          <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
            {slides[currentSlide].description}
          </p>

          {/* 3D Mobile Financial Badges Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 font-bold text-xs flex items-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-pink-400 mr-1.5" /> বিকাশ (bKash)
            </span>
            <span className="px-3 py-1 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-300 font-bold text-xs flex items-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 mr-1.5" /> নগদ (Nagad)
            </span>
            <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold text-xs flex items-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-purple-400 mr-1.5" /> রকেট (Rocket)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('packages')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-95 transition flex items-center space-x-2"
            >
              <Rocket className="w-4 h-4" />
              <span>প্যাকেজ শুরু করুন</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/20 border border-white/30 text-white font-bold text-sm backdrop-blur-sm transition flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4 text-emerald-300" />
                <span>ডিপোজিট করুন</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/20 border border-white/30 text-white font-bold text-sm backdrop-blur-sm transition flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>রেজিস্ট্রেশন করুন</span>
              </button>
            )}
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center space-x-2 pt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  i === currentSlide ? 'w-7 bg-cyan-400' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
            <span className="text-[11px] text-blue-200 ml-2">অফিশিয়াল প্ল্যাটফর্ম আপডেট</span>
          </div>
        </div>

        {/* Right AI Artwork & Live Visuals */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          
          {/* 3D Generated AI Character Artwork Card */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl group w-full max-w-sm">
            <img 
              src={heroPayoutImg} 
              alt="Top Money 24 মোবাইল উত্তোলন ও ইনকাম" 
              className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Bottom floating banner on artwork */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> সফল ক্যাশআউট সম্পন্ন
                </div>
                <div className="text-xs font-black text-white font-number mt-0.5">
                  ৳ ২৫,০০০ (বিকাশ • নগদ • রকেট)
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ইনস্ট্যান্ট
              </span>
            </div>
          </div>

          {/* Small 3D Stats Counter Pill */}
          <div className="mt-3 w-full max-w-sm flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 text-xs">
            <span className="text-slate-400 flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              সক্রিয় সদস্য:
            </span>
            <span className="font-bold text-white font-number">১,২৮,৭৪০ জন</span>
          </div>

        </div>

      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 border border-white/30 text-white flex items-center justify-center transition"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 border border-white/30 text-white flex items-center justify-center transition"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
};