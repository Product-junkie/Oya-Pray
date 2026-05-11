"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timezone, setTimezone] = useState("");
  const [prayerDate, setPrayerDate] = useState("");
  const [frequency, setFrequency] = useState("Just once");
  const [prayerTimes, setPrayerTimes] = useState<string[]>(['']);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";
    setTimezone(defaultTz);
    setPrayerDate(new Date().toISOString().split('T')[0]);
  }, []);

  const resetForm = () => {
    setPhoneNumber("");
    setPrayerTimes(['']);
    setFrequency("Just once");
    setPrayerDate(new Date().toISOString().split('T')[0]);
    setShowToast(false);
  };

  const handleAddTime = () => {
    if (prayerTimes.length < 3) setPrayerTimes([...prayerTimes, '']);
  };

  const handleRemoveTime = (index: number) => {
    setPrayerTimes(prayerTimes.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...prayerTimes];
    newTimes[index] = value;
    setPrayerTimes(newTimes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#0d0a14] flex items-center justify-center p-4 overflow-hidden">

      {/* --- 🖋️ COMFY FONT & ANIMATION IMPORT --- */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .breath-cta { letter-spacing: 0.1em; }

        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float-rotate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }

        .animate-slow-rotate {
          animation: slow-rotate 60s linear infinite;
        }

        .animate-float-rotate {
          animation: float-rotate 10s ease-in-out infinite;
        }
      `}} />

      {/* --- 🌟 INTERACTIVE GLOWING BACKGROUND 🌟 --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Central Glow Orb */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-white/5 to-transparent blur-[80px]"></div>

        {/* Floating Icons with Rotation Logic */}
        {[
          { icon: "book", top: "12%", left: "10%", delay: "0s", duration: "12s" },
          { icon: "cross", top: "60%", right: "10%", delay: "2s", duration: "15s" },
          { icon: "clock", bottom: "15%", left: "20%", delay: "1s", duration: "10s" },
          { icon: "flame", bottom: "35%", left: "5%", delay: "3s", duration: "14s" },
          { icon: "moon", top: "25%", right: "25%", delay: "4s", duration: "18s" },
          { icon: "bell", top: "5%", right: "40%", delay: "1.5s", duration: "11s" },
          { icon: "sparkle", bottom: "10%", right: "30%", delay: "5s", duration: "13s" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="absolute pointer-events-auto transition-all duration-700 hover:scale-150 hover:opacity-100 opacity-20 group"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              animation: `float-rotate ${item.duration} ease-in-out infinite`,
              animationDelay: item.delay
            }}
          >
            <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(250,187,50,0.8)] group-hover:border-[#fabb32]/60 group-hover:bg-[#fabb32]/15 animate-pulse">
              {item.icon === "book" && <svg className="w-6 h-6 text-[#a8a1b2] group-hover:text-[#fabb32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
              {item.icon === "cross" && <svg className="w-6 h-6 text-[#fabb32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>}
              {item.icon === "clock" && <svg className="w-6 h-6 text-[#a8a1b2] group-hover:text-[#fabb32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
              {item.icon === "flame" && <svg className="w-6 h-6 text-[#fabb32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>}
              {item.icon === "moon" && <svg className="w-6 h-6 text-[#a8a1b2] group-hover:text-[#fabb32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>}
              {item.icon === "bell" && <svg className="w-6 h-6 text-[#fabb32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>}
              {item.icon === "sparkle" && <svg className="w-6 h-6 text-[#a8a1b2] group-hover:text-[#fabb32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>}
            </div>
          </div>
        ))}

        {/* --- 🗣️ DENSE NAIJA WHISPERS WITH SLOW ROTATION --- */}
        <div className="absolute top-[28%] right-[5%] text-[9px] text-[#eae0d5]/30 font-bold uppercase tracking-[0.2em] bg-white/5 px-3 py-1.5 rounded-lg animate-float-rotate opacity-50">No Sleep</div>
        <div className="absolute top-[85%] left-[12%] text-[9px] text-[#fabb32]/30 font-bold uppercase tracking-[0.2em] bg-[#fabb32]/5 px-3 py-1.5 rounded-lg animate-float-rotate" style={{ animationDelay: '2s' }}>Oya, Lock In!</div>
        <div className="absolute top-[55%] right-[2%] text-[8px] text-[#fabb32]/20 font-bold uppercase tracking-[0.2em] bg-[#fabb32]/5 px-2 py-1.5 rounded-lg animate-float-rotate" style={{ animationDelay: '4s' }}>No Press Phone</div>
        <div className="absolute bottom-[8%] left-[25%] text-[9px] text-[#eae0d5]/25 font-bold uppercase tracking-[0.2em] bg-white/5 px-2.5 py-1 rounded-lg animate-float-rotate" style={{ animationDelay: '1s' }}>Talk to your God</div>
        <div className="absolute top-[35%] right-[28%] text-[8px] text-[#eae0d5]/30 font-bold uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded-lg animate-float-rotate" style={{ animationDelay: '3s' }}>Leave Woman, Call God</div>
        <div className="absolute bottom-[40%] left-[8%] text-[8px] text-[#fabb32]/25 font-bold uppercase tracking-[0.2em] bg-[#fabb32]/5 px-2 py-1 rounded-lg animate-float-rotate" style={{ animationDelay: '5s' }}>Leave Man, Call God</div>
      </div>

      {/* --- 🚀 NAIJA LOADING STATE --- */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09070e]/90 backdrop-blur-xl px-4 animate-in fade-in duration-300">
          <div className="relative z-10 w-24 h-24 flex items-center justify-center mb-7">
            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#fabb32]/30 animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-[#e89a1e]/50 animate-[spin_3s_linear_infinite_reverse]"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#fabb32] to-[#e89a1e] rounded-full animate-pulse shadow-[0_0_40px_rgba(250,187,50,0.8)]"></div>
          </div>
          <h2 className="relative z-10 text-xl font-bold text-[#f4ece1] mb-2 tracking-[0.2em] uppercase animate-pulse text-center">Oya, Locking It In!</h2>
          <p className="relative z-10 text-[#a8a1b2] text-sm text-center max-w-xs leading-relaxed">WhatsApp people are coming... You must pray! 🕯️🔥</p>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="relative transform animate-in fade-in zoom-in duration-300 w-full max-w-sm">
            <div className="absolute inset-[-80px] blur-[25px] opacity-20 pointer-events-none z-[-1] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-[150%] h-[150%] text-[#fabb32]"><path stroke="currentColor" strokeWidth="1" d="M12 2v20m8-12H4" /></svg>
            </div>
            <div className="bg-[#18141f] border border-[#fabb32]/40 rounded-[32px] p-10 w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <span className="text-2xl">🔥</span>
              </div>
              <h2 className="text-2xl font-bold text-[#f4ece1] mb-3 tracking-tight text-center uppercase">Locked In!</h2>
              <p className="text-[#a8a1b2] text-[16px] mb-8 leading-relaxed text-center font-medium italic">
                "I'm coming for you, no sleeping on a bicycle. We move! 🚀"
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-[#2a2333] hover:bg-[#fabb32] hover:text-black text-[#f4ece1] font-bold py-4.5 rounded-full transition-all uppercase tracking-widest text-[13px]"
              >
                I hear you (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN FORM --- */}
      <div className="relative z-10 w-full max-w-[520px]">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <span className="text-[#eae0d5] font-light">Oya</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fabb32] to-[#e89a1e] font-extrabold drop-shadow-[0_0_15px_rgba(250,187,50,0.3)]">Pray!</span>
          </h1>
          <p className="text-[#a8a1b2] text-[16px] tracking-[0.05em] font-medium opacity-80">Your Path to Inner Reflection.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full bg-[#14101a]/90 backdrop-blur-md border border-[#262030] rounded-[40px] p-8 md:p-11 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col space-y-2">
              <label className="text-[11px] text-[#c4bccf] ml-2 uppercase tracking-[0.2em] font-bold opacity-70">WhatsApp Number</label>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. +234..." required className="w-full bg-[#1e1926] border border-white/5 rounded-2xl px-5 py-4 text-sm text-[#f4ece1] placeholder-[#6b6475] focus:outline-none focus:border-[#fabb32]/50 transition-all" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[11px] text-[#c4bccf] ml-2 uppercase tracking-[0.2em] font-bold opacity-70">Start Date</label>
              <input type="date" value={prayerDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setPrayerDate(e.target.value)} required className="w-full bg-[#1e1926] border border-white/5 rounded-2xl px-5 py-4 text-sm text-[#a8a1b2] [color-scheme:dark] focus:outline-none focus:border-[#fabb32]/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col space-y-2">
              <label className="text-[11px] text-[#c4bccf] ml-2 uppercase tracking-[0.2em] font-bold opacity-70">Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-[#1e1926] border border-white/5 rounded-2xl px-5 py-4 text-sm text-[#a8a1b2] appearance-none focus:outline-none focus:border-[#fabb32]/50">
                <option value="Africa/Lagos">Lagos (WAT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="America/New_York">New York (EST)</option>
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[11px] text-[#c4bccf] ml-2 uppercase tracking-[0.2em] font-bold opacity-70">Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-[#1e1926] border border-white/5 rounded-2xl px-5 py-4 text-sm text-[#a8a1b2] appearance-none focus:outline-none focus:border-[#fabb32]/50">
                <option value="Just once">Just once</option>
                <option value="Daily">Daily</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <label className="text-[13px] text-[#eae0d5] font-bold ml-2 uppercase tracking-[0.1em]">Prayer Times</label>
            {prayerTimes.map((time, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="relative flex-1 bg-[#1e1926] border border-white/5 rounded-2xl px-5 py-4 focus-within:border-[#fabb32]/50 transition-all">
                  <input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} required className="bg-transparent w-full text-sm text-[#a8a1b2] focus:outline-none [color-scheme:dark]" />
                </div>
                {index === prayerTimes.length - 1 && prayerTimes.length < 3 && (
                  <button type="button" onClick={handleAddTime} className="bg-[#262030] w-[56px] h-[56px] rounded-2xl flex items-center justify-center text-[#c4bccf] hover:text-[#fabb32] border border-white/5 hover:border-[#fabb32]/40 transition-all shadow-lg">+</button>
                )}
                {prayerTimes.length > 1 && (
                  <button type="button" onClick={() => handleRemoveTime(index)} className="bg-[#262030] w-[56px] h-[56px] rounded-2xl flex items-center justify-center text-red-400 border border-white/5 hover:bg-red-500/10 transition-all shadow-lg">-</button>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="breath-cta w-full bg-gradient-to-r from-[#fabb32] to-[#e89a1e] text-[#4a340a] font-extrabold text-[16px] py-5 rounded-full shadow-[0_10px_30px_rgba(250,187,50,0.3)] hover:shadow-[0_15px_40px_rgba(250,187,50,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            SET REMINDER NOW
          </button>
        </form>
      </div>
    </div>
  );
}
