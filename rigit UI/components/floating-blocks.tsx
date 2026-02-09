"use client";

import { useEffect, useState } from "react";

export function FloatingBlocks() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const vw = (px: number) => `${(px / 1440) * 100}vw`;
  const vh = (px: number) => `${(px / 1024) * 100}vh`;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top Left Corner - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(64), top: vh(54), width: vw(111), height: vw(84) }}
        viewBox="0 0 111 84" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M110.333 0V27.7143H27.5833V83.1429H0V0H110.333Z" stroke="#BEFE46"/>
      </svg>

      {/* Top Right Corner - Filled White */}
      <svg 
        className="absolute" 
        style={{ left: vw(1266), top: vh(54), width: vw(111), height: vw(84) }}
        viewBox="0 0 111 84" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0V27.7143H82.75V83.1429H110.333V0H0Z" fill="white"/>
      </svg>

      {/* Top Center - Rectangle Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(671), top: vh(220), width: vw(56), height: vw(28) }}
        viewBox="0 0 56 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M55.1667 0H0V27.7143H55.1667V0Z" stroke="#BEFE46"/>
      </svg>

      {/* Top Left Small Square - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(257), top: vh(54), width: vw(28), height: vw(28) }}
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M27.5833 0H0V27.7143H27.5833V0Z" stroke="#BEFE46"/>
      </svg>

      {/* Center Left Rectangle - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(395), top: vh(137), width: vw(56), height: vw(28) }}
        viewBox="0 0 56 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M55.1667 0H0V27.7143H55.1667V0Z" stroke="#BEFE46"/>
      </svg>

      {/* Center Small Square - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(450), top: vh(82), width: vw(28), height: vw(28) }}
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M27.5833 0H0V27.7143H27.5833V0Z" stroke="#BEFE46"/>
      </svg>

      {/* Bottom Right Corner - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(1266), top: vh(887), width: vw(111), height: vw(84) }}
        viewBox="0 0 111 84" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.26858e-06 83.1429L4.84572e-06 55.4286L82.75 55.4286L82.75 5.04063e-07L110.333 -1.90735e-06L110.333 83.1429L7.26858e-06 83.1429Z" stroke="#BEFE46"/>
      </svg>

      {/* Bottom Left Corner - Filled White */}
      <svg 
        className="absolute" 
        style={{ left: vw(64), top: vh(887), width: vw(111), height: vw(84) }}
        viewBox="0 0 111 84" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M110.333 83.1429L110.333 55.4286L27.5833 55.4286L27.5833 2.41141e-06L7.26858e-06 0L0 83.1429L110.333 83.1429Z" fill="white"/>
      </svg>

      {/* Bottom Center Rectangle - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(714), top: vh(776), width: vw(56), height: vw(28) }}
        viewBox="0 0 56 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2.42286e-06 27.7143L55.1667 27.7143L55.1667 0L0 4.82282e-06L2.42286e-06 27.7143Z" stroke="#BEFE46"/>
      </svg>

      {/* Bottom Right Small Square - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(1155), top: vh(942), width: vw(28), height: vw(28) }}
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2.42286e-06 27.7143L27.5833 27.7143L27.5833 0L0 2.41141e-06L2.42286e-06 27.7143Z" stroke="#BEFE46"/>
      </svg>

      {/* Bottom Right Rectangle - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(990), top: vh(859), width: vw(56), height: vw(28) }}
        viewBox="0 0 56 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2.42286e-06 27.7143L55.1667 27.7143L55.1667 0L0 4.82282e-06L2.42286e-06 27.7143Z" stroke="#BEFE46"/>
      </svg>

      {/* Bottom Right Small Square 2 - Outlined */}
      <svg 
        className="absolute stroke-[#BEFE46]" 
        style={{ left: vw(962), top: vh(914), width: vw(28), height: vw(28) }}
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2.42286e-06 27.7143L27.5833 27.7143L27.5833 0L0 2.41141e-06L2.42286e-06 27.7143Z" stroke="#BEFE46"/>
      </svg>
    </div>
  );
}
