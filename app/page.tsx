"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  // --- STATE SYSTEM ---
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [timezone, setTimezone] = useState("Lagos, Nigeria (GMT+1)");
  const [frequency, setFrequency] = useState("Daily");
  const [prayerTimes, setPrayerTimes] = useState<string[]>(["05:30"]);
  const [isLoading, setIsLoading] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    setTodayDate(new Date().toISOString().split("T")[0]);
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handlePhoneChange = (val: string) => {
    const numericOnly = val.replace(/[^\d+]/g, "");
    if (numericOnly.startsWith("0") && numericOnly.length > 11) {
      return;
    }
    setPhoneNumber(numericOnly);
  };

  const handleAddTime = () => {
    if (prayerTimes.length < 3) setPrayerTimes([...prayerTimes, "12:00"]);
  };
  const handleRemoveTime = (index: number) => {
    setPrayerTimes(prayerTimes.filter((_, i) => i !== index));
  };
  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...prayerTimes];
    newTimes[index] = value;
    setPrayerTimes(newTimes);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Format phone number to E.164 (ensure it starts with +)
    const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${cleanPhone}`;
    const validPrayerTimes = prayerTimes.filter(t => t.trim() !== "");

    try {
      const { error } = await supabase
        .from('reminders')
        .upsert([
          {
            phone: formattedPhone,
            start_date: startDate,
            timezone: timezone,
            frequency: frequency,
            prayer_times: validPrayerTimes,
          },
        ]);

      if (error) {
        console.error("Supabase Error:", error);
        alert(`Failed to save reminder: ${error.message}`);
      } else {
        setStep(4);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPhoneNumber("");
    setStartDate("");
    setPrayerTimes(["05:30"]);
    setStep(0);
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#120E0B] text-[#e7e0ef] flex flex-col items-center justify-center p-0 md:p-6 overflow-hidden select-none">
      
      {/* --- CUSTOM FONTS & ANIMATIONS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;700&display=swap');
        
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* The Cosmic Gradient from your code */
        .cosmic-gradient {
          background: radial-gradient(circle at center, rgba(251, 191, 36, 0.08) 0%, rgba(18, 14, 11, 1) 70%);
        }
        
        /* The specific text glow you provided */
        .text-glow-gold {
          background: linear-gradient(to right, #fbbf24, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.4));
        }

        .glass-container {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* ==================== CELESTIAL BACKGROUND LAYER ==================== */}
      <div className="absolute inset-0 z-0 pointer-events-none cosmic-gradient overflow-hidden">
        {/* Subtle stars/particles from your code */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-1.5 h-1.5 bg-[#fbbf24]/10 rounded-full blur-[1px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-1/3 left-15 w-1 h-1 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#fbbf24]/20 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      </div>

      {/* ==================== RESPONSIVE CARD ENGINE ==================== */}
      <main className="relative z-10 w-full h-[100dvh] md:h-auto md:min-h-[660px] md:max-w-[440px] md:glass-container md:bg-[#15121c]/80 rounded-none md:rounded-[40px] flex flex-col p-8 md:p-10 transition-all duration-500 overflow-y-auto md:overflow-visible font-body">
        
        {/* --- NAVIGATION ANCHOR BAR (Only on inner steps) --- */}
        {step > 0 && step < 4 && (
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <button onClick={prevStep} className="text-[#a09ca6] hover:text-[#fbbf24] transition-colors p-2 -ml-2 rounded-full active:bg-white/5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className={`h-1.5 rounded-full transition-all duration-500 ${step === num ? "bg-gradient-to-r from-[#fbbf24] to-[#d97706] w-8 shadow-[0_0_8px_#fbbf2466]" : "bg-white/10 w-4"}`}></div>
              ))}
            </div>
            <div className="w-10"></div>
          </div>
        )}

        {/* --- CONTEXT STEP COMPONENT SWITCHER --- */}
        <div key={step} className="animate-fade-up flex flex-col flex-grow h-full justify-center">
          
          {/* --- STEP 0: YOUR BEAUTIFUL CUSTOM SPLASH SCREEN --- */}
          {step === 0 && (
            <div className="flex flex-col items-center justify-center flex-grow w-full relative">
              
              {/* Centerpiece Branding */}
              <div className="flex flex-col items-center gap-[24px] text-center my-auto">
                
                {/* Logo Section with Aura (Replaced img with perfectly styled SVG) */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-[#fbbf24]/20 blur-[40px] rounded-full transform scale-110"></div>
                  <svg className="relative w-[120px] h-[120px] text-[#fbbf24] mix-blend-screen" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="50" y1="16" x2="50" y2="84" strokeLinecap="round"/>
                    <circle cx="50" cy="46" r="19"/>
                    <path d="M50 33 Q50 46 37 46 Q50 46 50 59 Q50 46 63 46 Q50 46 50 33 Z" fill="currentColor"/>
                    <circle cx="50" cy="74" r="2" fill="currentColor"/>
                  </svg>
                </div>
                
                {/* Typography */}
                <div className="space-y-[8px]">
                  <h1 className="font-display tracking-tight flex items-center justify-center gap-2 text-[40px] md:text-[44px]">
                    <span className="text-[#e7e0ef] font-black">Oya</span>
                    <span className="text-glow-gold font-black">Pray</span>
                  </h1>
                  <p className="font-body text-[#e7e0ef] tracking-[0.15em] uppercase text-[10px] md:text-[11px] font-medium">
                    Your path to inner reflection
                  </p>
                </div>
              </div>

              {/* Call to Action (Anchored Bottom) */}
              <div className="absolute bottom-8 md:bottom-2 left-0 right-0 flex flex-col items-center w-full">
                <button onClick={nextStep} className="group flex items-center gap-2 px-6 py-3 rounded-full glass-container hover:bg-white/5 transition-all duration-300">
                  <span className="text-[#ffe1a7] font-body tracking-[0.15em] uppercase text-xs font-bold">Tap to begin</span>
                  <svg className="w-5 h-5 text-[#fbbf24] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
                
                {/* Nigerian professional touch: subtle location/status indicator */}
                <div className="mt-[24px] flex items-center gap-2 opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></div>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-[#e7e0ef]">Connect with your maker</span>
                </div>
              </div>
              
            </div>
          )}

          {/* --- STEP 1: WHATSAPP LINK --- */}
          {step === 1 && (
            <div className="flex flex-col flex-grow justify-start">
              <h2 className="text-3xl font-display font-bold mb-3 tracking-tight">Link WhatsApp</h2>
              <p className="text-[#d3c5ac] mb-8 text-sm leading-relaxed">Connect your primary number to receive gentle, automated reminders to pause and pray.</p>
              
              <div className="bg-[#15121c] border border-white/5 rounded-2xl p-6 mb-6 transition-colors focus-within:border-[#fbbf24]/40">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#d3c5ac] font-bold mb-3">WhatsApp Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+234 800 000 0000" 
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-2xl font-display focus:border-[#fbbf24] outline-none transition-colors text-white placeholder-white/20 font-light" 
                />
              </div>

              <div className="flex items-start gap-4 bg-[#fbbf24]/5 border border-[#fbbf24]/10 p-5 rounded-2xl mb-auto">
                <svg className="w-5 h-5 text-[#fbbf24] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                <p className="text-xs text-[#d3c5ac] leading-relaxed">Your privacy is divine. We never share your number with third parties.</p>
              </div>

              <button onClick={nextStep} disabled={phoneNumber.length < 7} className={`w-full bg-[#fbbf24] text-[#261a00] font-display font-bold py-[18px] rounded-2xl mt-8 uppercase tracking-widest text-xs active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100 mb-2 md:mb-0`}>
                Continue
              </button>
            </div>
          )}

          {/* --- STEP 2: CHRONO PREFS --- */}
          {step === 2 && (
            <div className="flex flex-col flex-grow justify-start">
              <h2 className="text-3xl font-display font-bold mb-3 tracking-tight">Journey's start</h2>
              <div className="bg-[#15121c] border border-white/5 rounded-2xl p-5 mb-8 text-[#d3c5ac] text-xs md:text-sm leading-relaxed">
                Choose a date and time that aligns with your devotions across your local timezone.
              </div>

              <div className="space-y-4 mb-auto">
                <div className="bg-[#15121c] border border-white/5 rounded-2xl p-4 focus-within:border-[#fbbf24]/40 transition-colors">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#d3c5ac] font-bold mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    min={todayDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-white font-display text-lg focus:outline-none [color-scheme:dark] cursor-pointer" 
                  />
                </div>

                <div className="bg-[#15121c] border border-white/5 rounded-2xl p-4 focus-within:border-[#fbbf24]/40 transition-colors">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#d3c5ac] font-bold mb-2">Your Timezone</label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-transparent text-white font-display text-lg focus:outline-none appearance-none cursor-pointer"
                  >
                    <option className="bg-[#15121c]">Lagos, Nigeria (GMT+1)</option>
                    <option className="bg-[#15121c]">London, UK (GMT)</option>
                    <option className="bg-[#15121c]">New York, USA (EST)</option>
                  </select>
                </div>
              </div>

              <button onClick={nextStep} disabled={!startDate} className={`w-full bg-[#fbbf24] text-[#261a00] font-display font-bold py-[18px] rounded-2xl mt-8 uppercase tracking-widest text-xs active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100 mb-2 md:mb-0`}>
                Continue
              </button>
            </div>
          )}

          {/* --- STEP 3: FREQUENCY & ALARM CLOCKS --- */}
          {step === 3 && (
            <div className="flex flex-col flex-grow justify-start">
              <h2 className="text-3xl font-display font-bold mb-6 tracking-tight">Frequency</h2>
              
              <div className="flex bg-[#15121c] border border-white/5 rounded-xl p-1 mb-6">
                <button onClick={() => setFrequency("Once")} className={`flex-1 py-3.5 transition-all duration-300 rounded-lg text-xs font-bold ${frequency === "Once" ? "bg-[#37333e] text-[#fbbf24] shadow-md" : "text-[#d3c5ac] hover:text-white"}`}>Once</button>
                <button onClick={() => setFrequency("Daily")} className={`flex-1 py-3.5 transition-all duration-300 rounded-lg text-xs font-bold ${frequency === "Daily" ? "bg-[#37333e] text-[#fbbf24] shadow-md" : "text-[#d3c5ac] hover:text-white"}`}>Daily</button>
              </div>

              <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-xs uppercase tracking-wider text-[#fbbf24] font-bold">Prayer Times</label>
                <span className="text-[10px] uppercase tracking-widest text-[#d3c5ac] opacity-80">Max 3 reminders</span>
              </div>

              <div className="space-y-3 mb-auto">
                {prayerTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#15121c] border border-white/5 rounded-2xl px-5 py-4 focus-within:border-[#fbbf24]/40 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <svg className="w-5 h-5 text-[#fbbf24]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} className="bg-transparent text-white font-display font-bold text-lg outline-none w-full [color-scheme:dark] cursor-pointer" />
                    </div>
                    {prayerTimes.length > 1 && (
                      <button onClick={() => handleRemoveTime(index)} className="text-[#d3c5ac] hover:text-red-400 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    )}
                  </div>
                ))}

                {prayerTimes.length < 3 && (
                  <button onClick={handleAddTime} className="w-full border border-dashed border-white/10 hover:border-white/20 text-[#d3c5ac] transition-colors rounded-2xl py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Prayer Time
                  </button>
                )}
              </div>

              <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-[#fbbf24] text-[#261a00] font-display font-bold py-[18px] rounded-2xl mt-8 uppercase tracking-widest text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 mb-2 md:mb-0">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#261a00]/30 border-t-[#261a00] rounded-full animate-spin"></div>
                ) : (
                  <>
                    Set Reminder Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* --- STEP 4: CELESTIAL SUCCESS CONSOLE --- */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center flex-grow text-center h-full pt-8">
              
              <div className="w-24 h-24 bg-[#fbbf24] rounded-full flex items-center justify-center mb-8 shadow-[0_15px_35px_rgba(251,191,36,0.25)]">
                <svg className="w-10 h-10 text-[#261a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              
              <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">Your reminder is set!</h2>
              <p className="text-[#d3c5ac] mb-12 text-sm px-4">You will receive your divine notifications on WhatsApp.</p>
              
              <button onClick={handleReset} className={`w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-display font-bold py-[18px] rounded-2xl uppercase tracking-widest text-xs active:scale-[0.98] transition-all mt-auto md:mt-0 mb-4 md:mb-0`}>
                I Hear You (Close)
              </button>
              
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
