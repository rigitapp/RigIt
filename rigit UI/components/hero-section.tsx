"use client";

import { CountdownTimer } from "./countdown-timer";
import { useExploration } from "@/lib/solana";

export function HeroSection() {
  const { exploration, loading } = useExploration("SOL");

  // Derive countdown target from on-chain data if available
  const hasActiveExploration = exploration !== null && exploration.status === "active";
  const endsAt = hasActiveExploration
    ? new Date(exploration.activeEndTs * 1000)
    : null;

  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="max-w-[804px] mx-auto px-4">
        {/* RIG IT Logo */}
        <div className="flex flex-col items-center gap-16">
          {/* SVG Logo */}
          <svg width="804" height="432" viewBox="0 0 804 432" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M134 0V33.6591H33.5V100.977H0V0H134Z" fill="#BEFE46"/>
            <path d="M167.496 33.6582H133.996V100.976H167.496V33.6582Z" fill="#BEFE46"/>
            <path d="M770.504 67.3182V100.977H737.004V201.954H703.504V100.977H670.004V67.3182H703.504V0H737.004V67.3182H770.504Z" fill="#BEFE46"/>
            <path d="M804 201.955H737V235.614H804V201.955Z" fill="#BEFE46"/>
            <path d="M603 0H569.5V235.614H603V0Z" fill="#BEFE46"/>
            <path d="M268 0H234.5V33.6591H268V0Z" fill="#BEFE46"/>
            <path d="M469.004 0H368.504V33.6591H469.004V0Z" fill="#BEFE46"/>
            <path d="M268 67.3184H234.5V235.614H268V67.3184Z" fill="#BEFE46"/>
            <path d="M469 100.977H402V134.636H469V100.977Z" fill="#BEFE46"/>
            <path d="M502.504 134.637H469.004V201.955H502.504V134.637Z" fill="#BEFE46"/>
            <path d="M368.5 33.6582H335V201.954H368.5V33.6582Z" fill="#BEFE46"/>
            <path d="M502.504 33.6582H469.004V67.3173H502.504V33.6582Z" fill="#BEFE46"/>
            <path d="M469.004 201.955H368.504V235.614H469.004V201.955Z" fill="#BEFE46"/>
            <path d="M167.496 134.637H133.996V235.614H167.496V134.637Z" fill="#BEFE46"/>
            <path d="M134 100.977H33.5V134.636H134V100.977Z" fill="#BEFE46"/>
            <path d="M33.5 134.637H0V235.614H33.5V134.637Z" fill="#BEFE46"/>
            <text fill="#A7A7A7" style={{ whiteSpace: 'pre' }} fontFamily="IBM Plex Mono" fontSize="40" fontWeight="600" letterSpacing="0em">
              <tspan x="102.195" y="340.614">Ritualized On-Chain Games</tspan>
            </text>
            <text fill="#A7A7A7" style={{ whiteSpace: 'pre' }} fontFamily="IBM Plex Mono" fontSize="20" fontWeight="300" letterSpacing="0em">
              <tspan x="0.261719" y="391.114">Participate in time-based Explorations, Select your Rig and compete</tspan>
              <tspan x="60.2227" y="423.114">for the winner pool. 9 rounds daily, each lasting 2 hours</tspan>
            </text>
          </svg>

          {/* Current Exploration Details */}
          <div className="flex flex-col items-center gap-8 w-full max-w-[590px]">
            {loading ? (
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-[48px] bg-[#1B2802]">
                <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-xl font-normal">
                  Loading...
                </span>
              </div>
            ) : hasActiveExploration && endsAt ? (
              <>
                {/* Exploration Badge */}
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-[48px] bg-[#1B2802]">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="live-pulse"
                    style={{
                      animation: 'pulse-glow 2s ease-in-out infinite',
                      filter: 'drop-shadow(0 0 4px #BEFE46)'
                    }}
                  >
                    <circle cx="6.20905" cy="6.20905" r="6.20905" fill="#BEFE46"/>
                  </svg>
                  <span className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-xl font-normal">
                    EXPLORATION #{exploration.explorationIndex + 1} ENDS IN
                  </span>
                </div>

                {/* Countdown Timer */}
                <CountdownTimer targetDate={endsAt} isActive={true} />
              </>
            ) : (
              /* No active exploration — new/fresh project */
              <div className="flex flex-col items-center gap-4">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[48px] border border-[#595959]">
                  <span className="text-[#595959] font-['IBM_Plex_Mono'] text-xl font-normal">
                    NO ACTIVE EXPLORATION
                  </span>
                </div>
                <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-light text-center">
                  Waiting for the next exploration to begin.
                  <br />
                  Deploy the program and start an exploration to begin.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
