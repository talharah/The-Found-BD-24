import React, { useState } from 'react';
import { 
  ListCheck, 
  Youtube, 
  Facebook, 
  Send, 
  Globe, 
  Star, 
  CheckCircle2, 
  Clock, 
  Coins, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';

export const TasksSection: React.FC = () => {
  const { tasks, completeTask, currentUser, userPackages, claimDailyPackageEarning } = useApp();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'telegram': return <Send className="w-5 h-5 text-sky-500" />;
      case 'website': return <Globe className="w-5 h-5 text-emerald-500" />;
      case 'review': return <Star className="w-5 h-5 text-amber-500" />;
      default: return <ListCheck className="w-5 h-5 text-blue-500" />;
    }
  };

  const startTask = (task: Task) => {
    setActiveTask(task);
    setTimer(task.durationSeconds);
    setIsCounting(true);

    // Open target link in new tab if available
    if (task.link && task.link !== '#') {
      window.open(task.link, '_blank');
    }

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClaimReward = () => {
    if (activeTask) {
      completeTask(activeTask.id);
      setCompletedTaskIds(prev => [...prev, activeTask.id]);
      setActiveTask(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Active User Packages Daily Income Claim Section */}
      {currentUser && userPackages.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black flex items-center">
                <Sparkles className="w-5 h-5 text-amber-300 mr-2" />
                আপনার সক্রিয় প্যাকেজের দৈনিক প্রফিট
              </h3>
              <p className="text-xs text-blue-200">
                প্রতিদিন একবার আপনার প্যাকেজের দৈনিক ইনকাম ব্যালেন্সে যোগ করে নিন।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userPackages.map(upkg => (
              <div 
                key={upkg.id} 
                className="rounded-2xl bg-white/10 border border-white/20 p-4 flex items-center justify-between backdrop-blur-xs"
              >
                <div>
                  <div className="text-sm font-extrabold text-white">{upkg.packageName}</div>
                  <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                    দৈনিক আয়: ৳ {upkg.dailyEarning} | মেয়াদ বাকি: {upkg.daysRemaining} দিন
                  </div>
                </div>

                <button
                  disabled={upkg.claimedToday}
                  onClick={() => claimDailyPackageEarning(upkg.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    upkg.claimedToday
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 cursor-not-allowed'
                      : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-md'
                  }`}
                >
                  {upkg.claimedToday ? 'আজ নেওয়া হয়েছে ✓' : 'প্রফিট গ্রহণ করুন'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Tasks List */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center">
              <ListCheck className="w-6 h-6 text-blue-600 mr-2" />
              দৈনিক মাইক্রো টাস্ক
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              সহজ ডিজিটাল কাজগুলো সম্পন্ন করে সরাসরি মেইন ব্যালেন্সে টাকা আয় করুন
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map(task => {
            const isDone = completedTaskIds.includes(task.id);
            return (
              <div
                key={task.id}
                className="rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                    <p className="text-xs text-slate-500">{task.instructions}</p>
                    <div className="flex items-center space-x-3 text-[11px] pt-1">
                      <span className="text-emerald-700 font-bold flex items-center">
                        <Coins className="w-3.5 h-3.5 mr-1" />
                        রিওয়ার্ড: +৳ {task.reward}
                      </span>
                      <span className="text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.durationSeconds} সেকেন্ড
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:self-center">
                  {isDone ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>সম্পন্ন হয়েছে</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => startTask(task)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <span>টাস্ক শুরু করুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Task Modal / Timer */}
      {activeTask && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              {getTaskIcon(activeTask.type)}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">{activeTask.title}</h3>
              <p className="text-xs text-slate-500">{activeTask.instructions}</p>
            </div>

            {/* Countdown Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isCounting ? 'টাস্ক ভেরিফিকেশন চলছে...' : 'টাস্ক সম্পন্ন হয়েছে!'}
              </div>
              
              <div className="text-4xl font-black text-blue-600 font-number">
                {timer} <span className="text-sm font-semibold text-slate-500">সেকেন্ড বাকি</span>
              </div>

              <div className="text-xs text-emerald-600 font-bold">
                রিওয়ার্ড: +৳ {activeTask.reward} টাকা
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                disabled={isCounting}
                onClick={handleClaimReward}
                className={`w-full py-3 rounded-2xl font-black text-sm transition ${
                  isCounting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                }`}
              >
                {isCounting ? 'টাইমার শেষ হওয়া পর্যন্ত অপেক্ষা করুন' : 'টাকা ব্যালেন্সে জমা নিন!'}
              </button>

              <button
                onClick={() => setActiveTask(null)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
              >
                বাতিল করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
