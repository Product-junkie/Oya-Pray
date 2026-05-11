"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timezone, setTimezone] = useState("");
  const [prayerDate, setPrayerDate] = useState("");
  const [frequency, setFrequency] = useState("Just once");
  const [prayerTimes, setPrayerTimes] = useState<string[]>(['']);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setPrayerDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleAddTime = () => {
    if (prayerTimes.length < 3) {
      setPrayerTimes([...prayerTimes, '']);
    }
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = prayerTimes.filter((_, i) => i !== index);
    setPrayerTimes(newTimes);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...prayerTimes];
    newTimes[index] = value;
    setPrayerTimes(newTimes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validPrayerTimes = prayerTimes.filter(time => time.trim() !== "");

    if (!phoneNumber || !prayerDate || validPrayerTimes.length === 0) return;

    setIsLoading(true);

    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

    // Format date string explicitly to YYYY-MM-DD
    const formattedDate = new Date(prayerDate).toISOString().split('T')[0];

    // Check if the number is already registered
    const { data: existingData, error: checkError } = await supabase
      .from('reminders')
      .select('phone')
      .eq('phone', formattedPhone)
      .limit(1);

    if (checkError) {
      console.error("Error checking existing number:", checkError);
      setIsLoading(false);
      alert(`Error verifying number: ${checkError.message}`);
      return;
    }

    if (existingData && existingData.length > 0) {
      setIsLoading(false);
      alert("Omo! This number is already registered for prayers. Use another number!");
      return;
    }

    const { data, error } = await supabase
      .from('reminders')
      .insert([
        {
          phone: formattedPhone,
          timezone: timezone,
          prayer_date: formattedDate,
          frequency: frequency,
          prayer_times: validPrayerTimes
        },
      ]);

    setIsLoading(false);

    if (error) {
      console.error("Error inserting data:", error);
      alert(`Failed to set reminder: ${error.message}`);
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      setPhoneNumber("");
      setPrayerTimes(['']);
      setFrequency("Just once");
      setPrayerDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09050e] overflow-hidden font-sans text-white p-4">

      {/* --- 🌟 PURE CSS ANIMATION ENGINE 🌟 --- */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          33% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
          66% { transform: translateY(-10px) translateX(-15px); opacity: 0.5; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1) translate(-50%, -50%); }
          50% { opacity: 0.6; transform: scale(1.05) translate(-48%, -48%); }
        }
        .particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4);
          animation: float 10s infinite ease-in-out;
        }
      `}} />

      {/* --- BACKGROUND EFFECTS --- */}
      {/* The Giant Glowing Celestial Orb */}
      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full mix-blend-screen pointer-events-none origin-top-left"
        style={{
          background: 'radial-gradient(circle, rgba(255,230,150,0.15) 0%, rgba(255,200,100,0.05) 40%, transparent 70%)',
          animation: 'pulse-glow 8s infinite ease-in-out'
        }}
      ></div>
      {/* Subtle Arc Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      {/* Floating Space Dust (Particles) */}
      <div className="particle w-1.5 h-1.5 top-[20%] left-[15%]" style={{ animationDelay: '0s', animationDuration: '8s' }}></div>
      <div className="particle w-2 h-2 top-[70%] left-[85%] bg-amber-200" style={{ animationDelay: '2s', animationDuration: '12s' }}></div>
      <div className="particle w-1 h-1 top-[80%] left-[25%]" style={{ animationDelay: '4s', animationDuration: '9s' }}></div>
      <div className="particle w-2 h-2 top-[15%] left-[75%]" style={{ animationDelay: '1s', animationDuration: '15s' }}></div>
      <div className="particle w-3 h-3 top-[40%] left-[5%]" style={{ animationDelay: '3s', animationDuration: '11s', background: '#fef3c7', boxShadow: '0 0 15px 4px rgba(251, 191, 36, 0.3)' }}></div>

      {/* --- MAIN GLASSMORPHISM CARD --- */}
      <div className="relative z-10 w-full max-w-[550px] flex flex-col items-center">

        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
            <span className="text-gray-200">Oya </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffe177] to-[#e49c18] drop-shadow-[0_0_15px_rgba(228,156,24,0.4)]">
              Pray!
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base tracking-wide">Your Path to Inner Reflection.</p>
        </div>

        {/* The Form Wrapper */}
        {/* NOTE: Wrap this inside a <form onSubmit={handleSubmit}> if that's how your logic is setup! */}
        <div className="w-full bg-[#151118]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-[0_10_40px_rgba(0,0,0,0.5)]">

          {/* Top Row: WhatsApp & Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[11px] text-gray-300 font-medium tracking-wide ml-1">WhatsApp Number</label>
              <input
                type="tel"
                placeholder="WhatsApp Number"
                // onChange={(e) => setPhone(e.target.value)} <-- CONNECT YOUR STATE HERE
                className="w-full bg-[#201c24]/80 border border-white/[0.05] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[11px] text-gray-300 font-medium tracking-wide ml-1">Select Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-[#201c24]/80 border border-white/[0.05] rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Middle Row: Timezone & Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[11px] text-gray-300 font-medium tracking-wide ml-1">Your Timezone</label>
              <select className="w-full bg-[#201c24]/80 border border-white/[0.05] rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none">
                <option>Your Timezone</option>
                <option>Lagos (WAT)</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[11px] text-gray-300 font-medium tracking-wide ml-1">Frequency</label>
              <select className="w-full bg-[#201c24]/80 border border-white/[0.05] rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none">
                <option>Once</option>
                <option>Daily</option>
              </select>
            </div>
          </div>

          {/* Prayer Times Section */}
          <div className="space-y-3 mb-8">
            <label className="text-[13px] text-white font-medium ml-1">Prayer Times</label>

            {/* Time Slot 1 */}
            <div className="flex items-center gap-2">
              <input
                type="time"
                // onChange={(e) => setTime(e.target.value)} <-- CONNECT YOUR STATE HERE
                className="flex-1 bg-[#201c24]/80 border border-white/[0.05] rounded-lg px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
              <button className="bg-[#201c24]/80 border border-white/[0.05] p-3 rounded-lg hover:bg-white/[0.05] transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </button>
            </div>

            {/* Time Slot 2 (Visual Mockup only - duplicate logic if you need multiple times) */}
            <div className="flex items-center gap-2">
              <input type="time" className="flex-1 bg-[#201c24]/80 border border-white/[0.05] rounded-lg px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
              <button className="bg-[#201c24]/80 border border-white/[0.05] p-3 rounded-lg hover:bg-white/[0.05] transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </button>
            </div>

            {/* Time Slot 3 */}
            <div className="flex items-center gap-2">
              <input type="time" className="flex-1 bg-[#201c24]/80 border border-white/[0.05] rounded-lg px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
              <button className="bg-[#201c24]/80 border border-white/[0.05] p-3 rounded-lg hover:bg-white/[0.05] transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            // onClick={handleSubmit} <-- CONNECT YOUR SUBMIT FUNCTION HERE
            className="w-full bg-gradient-to-r from-[#ffd452] to-[#e69b12] text-black font-extrabold text-[15px] tracking-wide py-3.5 rounded-full shadow-[0_0_20px_rgba(230,155,18,0.4)] hover:shadow-[0_0_30px_rgba(230,155,18,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            SET REMINDER NOW
          </button>

        </div>
      </div>
    </div>
  );