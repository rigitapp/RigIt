"use client";

import { useState } from "react";
import { type BlockSymbol, useExplorationHistory } from "@/lib/solana";
import { PumpLogo } from "@/components/pump-logo";
import { SkrLogo } from "@/components/skr-logo";

interface ExplorationHistorySectionProps {
  activeToken: string;
}

interface SolLogoProps {
  isActive: boolean;
}

function SolLogo({ isActive }: SolLogoProps) {
  return (
    <svg
      width="31"
      height="24"
      viewBox="0 0 31 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isActive ? "opacity-100" : "opacity-60"}
    >
      <g clipPath="url(#clip0_solana_history)">
        <path d="M5.0459 18.3141C5.23544 18.127 5.49242 18.022 5.76036 18.022H30.4823C30.9326 18.022 31.158 18.5598 30.8395 18.8742L25.9545 23.6947C25.765 23.8818 25.508 23.9868 25.2401 23.9868H0.518128C0.0677716 23.9868 -0.157675 23.449 0.160901 23.1347L5.0459 18.3141Z" fill="url(#paint0_linear_solana_history)"/>
        <path d="M5.0459 0.304795C5.23544 0.117759 5.49242 0.0126953 5.76036 0.0126953H30.4823C30.9326 0.0126953 31.158 0.550521 30.8395 0.864895L25.9545 5.68545C25.765 5.87248 25.508 5.97755 25.2401 5.97755H0.518128C0.0677716 5.97755 -0.157675 5.43972 0.160901 5.12535L5.0459 0.304795Z" fill="url(#paint1_linear_solana_history)"/>
        <path d="M25.9545 9.25204C25.765 9.06496 25.508 8.95996 25.2401 8.95996H0.518128C0.0677715 8.95996 -0.157675 9.49773 0.160901 9.81211L5.0459 14.6327C5.23544 14.8197 5.49242 14.9248 5.76036 14.9248H30.4823C30.9326 14.9248 31.158 14.387 30.8395 14.0726L25.9545 9.25204Z" fill="url(#paint2_linear_solana_history)"/>
      </g>
      <defs>
        <linearGradient id="paint0_linear_solana_history" x1="20.954" y1="-6.56349" x2="4.17761" y2="25.9737" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="paint1_linear_solana_history" x1="20.954" y1="-6.56354" x2="4.17761" y2="25.9736" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="paint2_linear_solana_history" x1="20.954" y1="-6.56358" x2="4.17761" y2="25.9736" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <clipPath id="clip0_solana_history">
          <rect width="31" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function TokenLogo({ token, isActive }: { token: BlockSymbol; isActive: boolean }) {
  if (token === "PUMP") {
    return <PumpLogo className="w-8 h-8" isActive={isActive} />;
  }
  if (token === "SKR") {
    return <SkrLogo className="w-8 h-8" isActive={isActive} />;
  }
  return <SolLogo isActive={isActive} />;
}

interface ExplorationCardProps {
  explorationNumber: number;
  date: string;
  winningRig: number;
  poolTotal: string;
  winnerPayout: string;
  refundAmount: string;
  tokenSymbol: string;
}

function ExplorationCard({
  explorationNumber,
  date,
  winningRig,
  poolTotal,
  winnerPayout,
  refundAmount,
  tokenSymbol,
}: ExplorationCardProps) {
  return (
    <div className="flex flex-col items-start justify-center gap-8 self-stretch p-14 border-[0.5px] border-[#595959] bg-[#010101]">
      <div className="flex justify-between items-center w-full">
        {/* Exploration Number + Details */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-1 h-[60px] bg-[#595959]">
            <span className="text-white font-['IBM_Plex_Mono'] text-[32px] font-semibold">
              {explorationNumber}
            </span>
          </div>
          <div className="flex flex-col items-start gap-2 w-[210px]">
            <span className="text-white font-['IBM_Plex_Mono'] text-2xl font-semibold self-stretch">
              Exploration #{explorationNumber}
            </span>
            <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal self-stretch">
              {date}
            </span>
          </div>
        </div>

        {/* Winning Rig */}
        <div className="flex items-center justify-end gap-2 px-4 py-4 bg-[#BEFE46]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6165 3.59964e-06C13.434 3.17021e-06 14.1322 -0.00198422 14.6868 0.0881213C15.277 0.18405 15.7976 0.397497 16.2003 0.885723C16.5887 1.35689 16.7225 1.88587 16.7417 2.47184C16.745 2.57399 16.7438 2.68027 16.7408 2.7907H17.165C17.7024 2.7907 18.1791 2.78954 18.554 2.84157C18.8955 2.88899 19.2578 2.99258 19.5487 3.2649L19.6686 3.39299L19.6696 3.3939C19.9801 3.76889 20.023 4.2039 19.9921 4.59666C19.9774 4.78217 19.9433 4.98856 19.8985 5.21167L19.7395 5.92751L19.377 7.50818V7.50909C18.7814 10.0918 16.6653 12.015 14.0882 12.5045C13.5394 13.3815 12.8975 14.1209 12.1714 14.6257C13.0853 15.2294 13.81 16.1889 14.2589 17.3029C14.5018 17.9063 14.4524 18.5448 14.2144 19.0443C13.9846 19.5266 13.5049 19.9999 12.8291 20H7.17047C6.49488 20 6.01578 19.5264 5.78602 19.0443C5.54799 18.5447 5.49875 17.9067 5.74241 17.3029L5.89412 16.9531C6.3461 15.9893 7.00873 15.1634 7.82454 14.6239C7.09919 14.1189 6.45776 13.3798 5.90957 12.5036C3.3339 12.013 1.21878 10.0907 0.623411 7.50909V7.50818L0.260948 5.92751C0.144634 5.4226 0.0376321 4.96781 0.0084043 4.59666C-0.0224985 4.20395 0.020479 3.76886 0.330897 3.3939L0.331805 3.39299C0.638721 3.02361 1.05658 2.89572 1.44645 2.84157C1.82139 2.78954 2.29812 2.7907 2.83544 2.7907H3.25877C3.25576 2.68026 3.25545 2.57398 3.25877 2.47184C3.27779 1.88594 3.41058 1.35711 3.79928 0.885723C4.2019 0.397619 4.72246 0.18405 5.31273 0.0881213C5.86724 -0.00190827 6.56523 3.55116e-06 7.38304 3.59964e-06H12.6165ZM10.0002 15.3488C8.82674 15.3489 7.67181 16.2468 7.03602 17.8243V17.8252C6.94508 18.0509 6.96797 18.2817 7.0451 18.4439C7.10905 18.578 7.16962 18.6015 7.17955 18.6047H12.82C12.8298 18.6015 12.8903 18.5784 12.9544 18.4439C13.022 18.3019 13.049 18.1068 12.9935 17.9088L12.9644 17.8243C12.3287 16.2469 11.1736 15.349 10.0002 15.3488ZM7.38304 1.39535C6.51768 1.39535 5.95317 1.39758 5.5362 1.4653C5.15501 1.52725 4.99406 1.6299 4.87577 1.77326C4.74366 1.93345 4.66582 2.12884 4.65321 2.51726C4.63955 2.93883 4.70373 3.48882 4.80401 4.32686L4.87396 4.86374C5.24701 7.5227 5.96346 9.7892 6.87614 11.4008C7.86942 13.1546 8.98185 13.9535 10.0002 13.9535C11.0184 13.9531 12.1303 13.1544 13.1234 11.4008C14.0969 9.68167 14.8471 7.21717 15.1955 4.32595L15.2637 3.74909C15.3236 3.22145 15.3576 2.83317 15.3472 2.51726C15.3346 2.12927 15.256 1.93363 15.1238 1.77326C15.0056 1.63 14.8446 1.5273 14.4633 1.4653C14.0462 1.39753 13.4815 1.39535 12.6165 1.39535H7.38304ZM16.5809 4.49219V4.4931C16.2941 6.87289 15.7396 9.02922 14.983 10.7794C16.4935 10.1257 17.6433 8.81651 18.0171 7.19568L18.3796 5.61501V5.6141C18.506 5.06546 18.5821 4.73009 18.6012 4.48674C18.6101 4.37413 18.603 4.31734 18.5976 4.29324C18.5964 4.28803 18.5946 4.28496 18.594 4.28325C18.5915 4.28168 18.5852 4.27877 18.5749 4.27417C18.5443 4.26063 18.4819 4.23991 18.3623 4.2233C18.1059 4.18772 17.7445 4.18605 17.165 4.18605H16.6172C16.6053 4.28602 16.5934 4.3881 16.5809 4.49219ZM2.83544 4.18605C2.25609 4.18605 1.89462 4.1877 1.63813 4.2233C1.51796 4.23999 1.45493 4.26069 1.42465 4.27417C1.4129 4.27943 1.40691 4.2823 1.40557 4.28325C1.40499 4.28504 1.40483 4.28847 1.40375 4.29324C1.39836 4.31737 1.39128 4.37418 1.40012 4.48674C1.41927 4.73007 1.49449 5.06551 1.62087 5.6141V5.61501L1.98333 7.19568C2.35688 8.81543 3.50568 10.1243 5.01476 10.7785C4.25839 9.02871 3.70539 6.87279 3.41865 4.49401V4.4931C3.40616 4.3887 3.39418 4.28631 3.38231 4.18605H2.83544Z" fill="#010101"/>
          </svg>
          <span className="text-[#010101] font-['IBM_Plex_Mono'] text-base font-medium">
            Rig #{winningRig}
          </span>
        </div>
      </div>

      {/* Block Round Details */}
      <div className="flex justify-end items-start gap-[127px]">
        <div className="flex flex-col items-start gap-2">
          <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-light">Pool Total</span>
          <span className="text-white font-['IBM_Plex_Mono'] text-2xl font-semibold">{poolTotal}</span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-light">Winner Payout</span>
          <span className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-2xl font-semibold">{winnerPayout}</span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-light">Refund [50%]</span>
          <span className="text-white font-['IBM_Plex_Mono'] text-2xl font-semibold">{refundAmount}</span>
        </div>
      </div>
    </div>
  );
}

export function ExplorationHistorySection({ activeToken }: ExplorationHistorySectionProps) {
  const initialToken = (activeToken?.toUpperCase() || "SOL") as BlockSymbol;
  const [selectedTab, setSelectedTab] = useState<BlockSymbol>(initialToken);
  const { history, loading } = useExplorationHistory(selectedTab);

  return (
    <div className="flex flex-col items-start gap-10 md:gap-16 w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C24.8368 0 32 7.16322 32 16C32 24.8368 24.8368 32 16 32C7.16322 32 0 24.8368 0 16C0 7.16322 7.16322 0 16 0ZM16 2.90909C8.76987 2.90909 2.90909 8.76987 2.90909 16C2.90909 23.2301 8.76987 29.0909 16 29.0909C23.2301 29.0909 29.0909 23.2301 29.0909 16C29.0909 8.76987 23.2301 2.90909 16 2.90909ZM17.4545 15.3977L22.4205 20.3636L20.3636 22.4205L14.5455 16.6023V6.54545H17.4545V15.3977Z" fill="#BEFE46"/>
        </svg>
        <h2 className="text-white font-['IBM_Plex_Mono'] text-[32px] font-semibold">
          Exploration History
        </h2>
      </div>

      {/* History Content */}
      <div className="flex flex-col items-start gap-8 self-stretch">
        {/* Token Tabs */}
        <div className="flex items-center gap-6 md:gap-8 flex-wrap">
          {(["SOL", "PUMP", "SKR"] as BlockSymbol[]).map((token) => (
            <button
              key={token}
              onClick={() => setSelectedTab(token)}
              className={`button-zoom flex items-center gap-4 px-4 py-4 border ${
                selectedTab === token ? "border-[#BEFE46]" : "border-[#595959]"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <TokenLogo token={token} isActive={selectedTab === token} />
              </div>
              <span className={`font-['IBM_Plex_Mono'] text-[40px] font-medium ${
                selectedTab === token ? "text-white" : "text-[#A7A7A7]"
              }`}>
                {token}
              </span>
            </button>
          ))}
        </div>

        {/* History Cards or Empty State */}
        <div className="flex items-center gap-4 self-stretch">
          <div className="flex flex-col items-start gap-7 overflow-y-auto no-scrollbar w-full max-h-[70vh]">
            {loading ? (
              <div className="flex items-center justify-center py-16 self-stretch">
                <span className="text-[#595959] font-['IBM_Plex_Mono'] text-xl font-normal">
                  Loading...
                </span>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 self-stretch border border-dashed border-[#595959]">
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C24.8368 0 32 7.16322 32 16C32 24.8368 24.8368 32 16 32C7.16322 32 0 24.8368 0 16C0 7.16322 7.16322 0 16 0ZM16 2.90909C8.76987 2.90909 2.90909 8.76987 2.90909 16C2.90909 23.2301 8.76987 29.0909 16 29.0909C23.2301 29.0909 29.0909 23.2301 29.0909 16C29.0909 8.76987 23.2301 2.90909 16 2.90909ZM17.4545 15.3977L22.4205 20.3636L20.3636 22.4205L14.5455 16.6023V6.54545H17.4545V15.3977Z" fill="#595959"/>
                </svg>
                <span className="text-[#595959] font-['IBM_Plex_Mono'] text-xl font-normal text-center">
                  No exploration history yet
                </span>
                <span className="text-[#595959] font-['IBM_Plex_Mono'] text-base font-light text-center max-w-md">
                  Completed explorations will appear here once the protocol is live and rounds are settled.
                </span>
              </div>
            ) : (
              history.map((exploration, index) => (
                <ExplorationCard
                  key={index}
                  explorationNumber={exploration.explorationIndex + 1}
                  date={new Date(exploration.startTs * 1000).toLocaleString()}
                  winningRig={exploration.winningRig ?? 0}
                  poolTotal={`${(exploration.totalDeposits / 1e9).toFixed(2)} ${selectedTab}`}
                  winnerPayout={exploration.winningRig !== null ? `${(exploration.totalDeposits / 2 / 1e9).toFixed(2)} ${selectedTab}` : "Rollover"}
                  refundAmount="50%"
                  tokenSymbol={selectedTab}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
