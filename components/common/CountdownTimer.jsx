"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ dStr: "00", hStr: "00", mStr: "00", sStr: "00" });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        dStr: String(days).padStart(2, "0"),
        hStr: String(hours).padStart(2, "0"),
        mStr: String(minutes).padStart(2, "0"),
        sStr: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-4">
      {/* Subtle overlay to increase contrast for the timer */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Glassmorphic Circle */}
      <div className="relative w-[120px] h-[120px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-1.5 transition-all duration-300">
        
        {/* Top Label */}
        <div className="flex items-center gap-1 text-white/80 mb-0.5">
          <Clock size={12} className="text-white/60" />
          <span className="text-[9px] uppercase tracking-widest font-semibold">Scheduled</span>
        </div>
        
        {/* Time Format Stacked */}
        <div className="flex flex-col items-center justify-center leading-none text-white font-bold text-lg tracking-tight">
          <div className="flex items-baseline gap-2">
            <span>{timeLeft.dStr}<span className="text-white/50 text-[10px] ml-px font-medium uppercase tracking-wide">d</span></span>
            <span>{timeLeft.hStr}<span className="text-white/50 text-[10px] ml-px font-medium uppercase tracking-wide">h</span></span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span>{timeLeft.mStr}<span className="text-white/50 text-[10px] ml-px font-medium uppercase tracking-wide">m</span></span>
            <span>{timeLeft.sStr}<span className="text-white/50 text-[10px] ml-px font-medium uppercase tracking-wide">s</span></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CountdownTimer;
