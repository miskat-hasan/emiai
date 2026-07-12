"use client";

import React, { useState, useEffect } from "react";


const PrizeWindowCountdown = ({ windowEndsAt }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!windowEndsAt) return;
    const target = new Date(windowEndsAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [windowEndsAt]);

  if (!timeLeft) return null;

  // Format: "M:SS" when < 1h, "H:MM:SS" when ≥ 1h
  const display =
    timeLeft.hours > 0
      ? `${timeLeft.hours}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`
      : `${timeLeft.minutes}:${String(timeLeft.seconds).padStart(2, "0")}`;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="w-[130px] h-[130px] rounded-full bg-white/15 backdrop-blur-xl border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.25)] flex items-center justify-center">
        <span className="text-white font-bold text-2xl leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          {display}
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrizeWindowCountdown);
