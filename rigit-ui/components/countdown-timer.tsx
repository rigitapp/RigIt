"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  isActive: boolean;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, isActive }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-8">
      {/* Hours */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-4 border border-[#595959] w-32">
          <span className="text-white font-['IBM_Plex_Mono'] text-[80px] font-bold leading-none">
            {formatNumber(timeLeft.hours)}
          </span>
        </div>
        <span className="text-[#A7A7A7] text-center font-['IBM_Plex_Mono'] text-xl font-light">
          HOURS
        </span>
      </div>

      {/* Separator */}
      <span className="text-[#595959] font-['IBM_Plex_Mono'] text-[64px] font-bold">
        :
      </span>

      {/* Minutes */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-4 border border-[#595959] w-32">
          <span className="text-white font-['IBM_Plex_Mono'] text-[80px] font-bold leading-none">
            {formatNumber(timeLeft.minutes)}
          </span>
        </div>
        <span className="text-[#A7A7A7] text-center font-['IBM_Plex_Mono'] text-xl font-light">
          MINUTES
        </span>
      </div>

      {/* Separator */}
      <span className="text-[#595959] font-['IBM_Plex_Mono'] text-[64px] font-bold">
        :
      </span>

      {/* Seconds */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-4 border border-[#595959] w-32">
          <span className="text-white font-['IBM_Plex_Mono'] text-[80px] font-bold leading-none">
            {formatNumber(timeLeft.seconds)}
          </span>
        </div>
        <span className="text-[#A7A7A7] text-center font-['IBM_Plex_Mono'] text-xl font-light">
          SECONDS
        </span>
      </div>
    </div>
  );
}
