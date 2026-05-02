"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timezone, setTimezone] = useState("");
  const [prayerTimes, setPrayerTimes] = useState<string[]>(['']);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || prayerTimes.some(time => !time)) return;
    
    setTimeout(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-oya-dark overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-oya-red opacity-20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-oya-yellow opacity-10 blur-[100px] pointer-events-none"></div>

      <div className="z-10 max-w-lg w-full bg-[#1e1e1e] border border-gray-800 p-8 rounded-2xl shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-oya-yellow via-oya-red to-oya-yellow rounded-t-2xl"></div>

        <div className="text-center mb-10 mt-4">
          <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tight">
            Oya <span className="text-oya-red">Pray!</span>
          </h1>
          <p className="text-oya-yellow font-semibold text-lg uppercase tracking-wider mb-2">
            Don't let me catch you ignoring this.
          </p>
          <p className="text-gray-400 text-sm">
            Oya, time is going! I will call your WhatsApp and shout at you until you pray. Try me.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="+234 800 000 0000"
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all placeholder-gray-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">
              Your Timezone
            </label>
            <select
              id="timezone"
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all"
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide">
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
                    className="flex-1 px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-oya-red focus:border-transparent transition-all"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required
                  />
                  {prayerTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(index)}
                      className="p-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400 hover:text-oya-red hover:border-oya-red transition-all"
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-8 bg-oya-red hover:bg-red-700 text-white font-black text-xl uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] transform hover:-translate-y-1 transition-all duration-200"
          >
            Set Reminder NOW
          </button>
        </form>

        {showToast && (
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-[110%] bg-oya-yellow text-oya-dark px-6 py-4 rounded-lg shadow-2xl animate-bounce z-20 border-4 border-oya-red">
            <p className="font-black text-center uppercase tracking-wide text-lg">
              I have heard you! Don't be late or else! 😡🔪
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
