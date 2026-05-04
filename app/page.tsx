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
    <main className="flex min-h-screen w-full max-w-[100vw] overflow-x-hidden flex-col items-center justify-center p-4 sm:p-6 md:p-24 bg-[#121212] bg-ankara-pattern relative">
      <div className="absolute top-[-5%] left-[-10%] w-64 h-64 md:w-[40%] md:h-[40%] rounded-full bg-oya-red opacity-20 blur-[80px] md:blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-10%] w-64 h-64 md:w-[40%] md:h-[40%] rounded-full bg-oya-yellow opacity-10 blur-[80px] md:blur-[100px] pointer-events-none"></div>

      <div className="z-10 w-[95%] sm:w-[90%] md:max-w-md bg-[#1e1e1e] border border-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl relative mx-auto">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ea580c] to-[#991b1b] rounded-t-2xl"></div>

        <div className="text-center mb-8 md:mb-10 mt-2 md:mt-4">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">
            Oya <span className="text-oya-red">Pray!</span>
          </h1>
          <p className="text-oya-yellow font-semibold text-base md:text-lg uppercase tracking-wider mb-2">
            Don't let me catch you ignoring this.
          </p>
          <p className="text-gray-400 text-xs md:text-sm">
            Oya, time is going! I will call your WhatsApp and shout at you until you pray. Try me.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div>
            <label htmlFor="phone" className="block text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="+234 800 000 0000"
              className="w-full px-4 py-3.5 md:py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all placeholder-gray-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">
              Select Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="date"
                id="date"
                className="w-full pl-10 pr-4 py-3.5 md:py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all [color-scheme:dark]"
                value={prayerDate}
                onChange={(e) => setPrayerDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="timezone" className="block text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">
              Your Timezone
            </label>
            <select
              id="timezone"
              className="w-full px-4 py-3.5 md:py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
            >
              <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              {timezone && !["Africa/Lagos", "Europe/London", "America/New_York"].includes(timezone) && (
                <option value={timezone}>{timezone} (Local)</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="frequency" className="block text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">
              How often?
            </label>
            <select
              id="frequency"
              className="w-full px-4 py-3.5 md:py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            >
              <option value="Just once">Just once</option>
              <option value="Every Day (Morning Devotion)">Every Day (Morning Devotion)</option>
              <option value="Weekly (Friday Vigil)">Weekly (Friday Vigil)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wide">
                Prayer Times (Max 3)
              </label>
              {prayerTimes.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddTime}
                  className="text-xs text-oya-yellow hover:text-white transition-colors font-bold uppercase tracking-wider"
                >
                  + Add Time
                </button>
              )}
            </div>
            <div className="space-y-3">
              {prayerTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="time"
                    className="flex-1 px-4 py-3.5 md:py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all [color-scheme:dark]"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required
                  />
                  {prayerTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(index)}
                      className="p-3.5 md:p-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400 hover:text-oya-red hover:border-oya-red transition-all"
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 md:pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 md:py-4 bg-gradient-to-r from-[#ea580c] to-[#991b1b] hover:from-[#d04e0a] hover:to-[#7f1616] text-white font-black text-lg md:text-xl uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                "Set Reminder NOW"
              )}
            </button>
          </div>
        </form>

        {showToast && (
          <div className="absolute top-[-10px] md:top-[-20px] left-1/2 transform -translate-x-1/2 w-[95%] md:w-[110%] bg-oya-yellow text-oya-dark px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-2xl animate-bounce z-20 border-2 md:border-4 border-oya-red">
            <p className="font-black text-center uppercase tracking-wide text-sm md:text-lg leading-tight">
              I have heard you! Don't be late or else! 😡🔪
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
