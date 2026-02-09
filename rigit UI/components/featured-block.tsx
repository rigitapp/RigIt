"use client";

import Link from "next/link";
import { currentExploration, blockInfo, blockMetrics } from "@/lib/mock-data";

export function FeaturedBlock() {
  const activeBlock = currentExploration.activeBlock;
  const block = blockInfo[activeBlock];
  const metrics = blockMetrics[activeBlock];
  const threshold = currentExploration.minimumThreshold;
  const poolTotal = currentExploration.currentTotal;
  const progressPercentage = Math.min((poolTotal / threshold) * 100, 100);
  const isDrawEnabled = progressPercentage >= 100;

  return (
    <div className="flex flex-col items-start gap-10 md:gap-16 w-full">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 w-full max-w-[520px]">
        <h2 className="text-white font-['IBM_Plex_Mono'] text-[40px] font-semibold leading-normal">
          Featured Block
        </h2>
        <p className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-xl font-light leading-normal self-stretch">
          Rotating daily across $SOL, $PUMP and $SKR
        </p>
      </div>

      {/* Main Block Card */}
      <Link
        href={`/app/block/${activeBlock.toLowerCase()}`}
        className="flex flex-col justify-center items-center gap-10 md:gap-16 self-stretch border border-[#BEFE46] bg-[#010101] p-6 md:p-10 lg:p-14 cursor-pointer transition-all duration-300 group relative hover:shadow-[0_0_60px_8px_rgba(190,254,70,0.4)]"
      >
        {/* Block Round Details */}
        <div className="flex flex-col xl:flex-row xl:items-end gap-10 xl:gap-[127px] w-full">
          {/* Icon/Token */}
          <div className="flex items-center gap-8">
            <svg width="106" height="82" viewBox="0 0 106 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M104.107 61.5312C105.646 61.5312 106.416 63.3692 105.328 64.4434L88.6376 80.9131C87.9901 81.5523 87.1116 81.9111 86.1962 81.9111H1.73036C0.1917 81.9111 -0.578647 80.0742 0.509662 79L17.2001 62.5293C17.8476 61.8903 18.7253 61.5314 19.6405 61.5312H104.107ZM86.1962 30.5703C87.1116 30.5703 87.9901 30.9292 88.6376 31.5684L105.328 48.0381C106.416 49.1122 105.646 50.9502 104.107 50.9502H19.6405C18.7253 50.9501 17.8476 50.5911 17.2001 49.9521L0.509662 33.4814C-0.578641 32.4073 0.191701 30.5703 1.73036 30.5703H86.1962ZM104.107 0C105.646 0 106.416 1.838 105.328 2.91211L88.6376 19.3818C87.9901 20.0209 87.1116 20.3799 86.1962 20.3799H1.73036C0.191649 20.3799 -0.578808 18.5419 0.509662 17.4678L17.2001 0.998047C17.8476 0.359156 18.7253 0.000117162 19.6405 0H104.107Z" fill="url(#paint0_linear_sol)"/>
              <defs>
                <linearGradient id="paint0_linear_sol" x1="71.5527" y1="-22.4684" x2="14.2335" y2="88.7002" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FFA3"/>
                  <stop offset="1" stopColor="#DC1FFF"/>
                </linearGradient>
              </defs>
            </svg>

            {/* Token Block */}
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-white font-['IBM_Plex_Mono'] text-[40px] font-semibold leading-normal self-stretch">
                {activeBlock} BLOCK
              </h3>
              <p className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-xl font-light leading-normal self-stretch">
                {block.name}
              </p>
            </div>
          </div>

          {/* Pool Total */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5714 0C18.9503 0 19.3136 0.150618 19.5815 0.418527C19.8494 0.686436 20 1.04969 20 1.42857V18.5714C20 18.9503 19.8494 19.3136 19.5815 19.5815C19.3136 19.8494 18.9503 20 18.5714 20H1.42857C1.04969 20 0.686436 19.8494 0.418527 19.5815C0.150618 19.3136 0 18.9503 0 18.5714V1.42857C0 1.04969 0.150618 0.686436 0.418527 0.418527C0.686436 0.150618 1.04969 0 1.42857 0H18.5714ZM1.42857 18.5714H18.5714V1.42857H1.42857V18.5714ZM8.44029 12.1903C8.92524 12.0938 9.42879 12.1434 9.8856 12.3326C10.3422 12.5218 10.7326 12.8424 11.0073 13.2533C11.282 13.6645 11.4286 14.1484 11.4286 14.6429C11.4278 15.3057 11.1648 15.9418 10.6961 16.4104C10.2275 16.8791 9.59138 17.1421 8.92857 17.1429C8.43412 17.1429 7.95019 16.9962 7.53906 16.7215C7.12815 16.4469 6.80747 16.0565 6.6183 15.5999C6.42908 15.1431 6.37954 14.6395 6.476 14.1546C6.57252 13.6698 6.81146 13.2248 7.16099 12.8753C7.51052 12.5257 7.9555 12.2868 8.44029 12.1903ZM8.92857 13.5714C8.71666 13.5714 8.50906 13.6337 8.33287 13.7514C8.15669 13.8691 8.01915 14.0369 7.93806 14.2327C7.857 14.4285 7.83674 14.6443 7.87807 14.8521C7.91945 15.0598 8.02127 15.2506 8.17104 15.4004C8.32081 15.5502 8.51159 15.652 8.71931 15.6934C8.92711 15.7347 9.14298 15.7144 9.33873 15.6334C9.53449 15.5523 9.7023 15.4147 9.82003 15.2386C9.93776 15.0624 10 14.8548 10 14.6429C10 14.3587 9.88704 14.0863 9.6861 13.8853C9.48517 13.6844 9.21273 13.5714 8.92857 13.5714ZM14.1546 8.61886C14.6395 8.5224 15.1431 8.57194 15.5999 8.76116C16.0565 8.95032 16.4469 9.27101 16.7215 9.68192C16.9962 10.093 17.1429 10.577 17.1429 11.0714C17.1421 11.7342 16.8791 12.3703 16.4104 12.839C15.9418 13.3077 15.3057 13.5707 14.6429 13.5714C14.1484 13.5714 13.6645 13.4248 13.2533 13.1501C12.8424 12.8754 12.5218 12.4851 12.3326 12.0285C12.1434 11.5716 12.0938 11.0681 12.1903 10.5831C12.2868 10.0984 12.5257 9.65338 12.8753 9.30385C13.2248 8.95432 13.6698 8.71538 14.1546 8.61886ZM14.6429 10C14.4309 10 14.2233 10.0622 14.0472 10.18C13.871 10.2977 13.7334 10.4655 13.6523 10.6613C13.5713 10.857 13.551 11.0729 13.5924 11.2807C13.6337 11.4884 13.7356 11.6792 13.8853 11.829C14.0351 11.9787 14.2259 12.0806 14.4336 12.1219C14.6414 12.1633 14.8573 12.143 15.053 12.0619C15.2488 11.9809 15.4166 11.8433 15.5343 11.6671C15.6521 11.4909 15.7143 11.2833 15.7143 11.0714C15.7143 10.7873 15.6013 10.5148 15.4004 10.3139C15.1995 10.113 14.927 10 14.6429 10ZM4.86886 6.476C5.35381 6.37954 5.85736 6.42908 6.31417 6.6183C6.77081 6.80747 7.16115 7.12815 7.43583 7.53906C7.71053 7.95019 7.85714 8.43412 7.85714 8.92857C7.85639 9.59138 7.5934 10.2275 7.12472 10.6961C6.65604 11.1648 6.01995 11.4278 5.35714 11.4286C4.86269 11.4286 4.37876 11.282 3.96763 11.0073C3.55673 10.7326 3.23604 10.3422 3.04688 9.8856C2.85766 9.42879 2.80811 8.92524 2.90458 8.44029C3.00109 7.9555 3.24003 7.51052 3.58956 7.16099C3.9391 6.81146 4.38407 6.57252 4.86886 6.476ZM5.35714 7.85714C5.14523 7.85714 4.93763 7.91938 4.76144 8.03711C4.58526 8.15484 4.44772 8.32265 4.36663 8.51842C4.28557 8.71416 4.26531 8.93004 4.30664 9.13784C4.34802 9.34556 4.44984 9.53633 4.59961 9.6861C4.74938 9.83588 4.94016 9.93769 5.14788 9.97907C5.35568 10.0204 5.57155 10.0001 5.7673 9.91909C5.96307 9.838 6.13088 9.70045 6.24861 9.52427C6.36633 9.34808 6.42857 9.14048 6.42857 8.92857C6.42857 8.64441 6.31561 8.37197 6.11468 8.17104C5.91374 7.97011 5.6413 7.85714 5.35714 7.85714ZM10.5831 2.90458C11.0681 2.80811 11.5716 2.85766 12.0285 3.04688C12.4851 3.23604 12.8754 3.55673 13.1501 3.96763C13.4248 4.37876 13.5714 4.86269 13.5714 5.35714C13.5707 6.01995 13.3077 6.65604 12.839 7.12472C12.3703 7.5934 11.7342 7.85639 11.0714 7.85714C10.577 7.85714 10.093 7.71053 9.68192 7.43583C9.27101 7.16115 8.95032 6.77081 8.76116 6.31417C8.57194 5.85736 8.5224 5.35381 8.61886 4.86886C8.71538 4.38407 8.95432 3.9391 9.30385 3.58956C9.65338 3.24003 10.0984 3.00109 10.5831 2.90458ZM11.0714 4.28571C10.8595 4.28571 10.6519 4.34795 10.4757 4.46568C10.2995 4.58341 10.162 4.75122 10.0809 4.94699C9.99986 5.14274 9.97959 5.35861 10.0209 5.56641C10.0623 5.77413 10.1641 5.9649 10.3139 6.11468C10.4637 6.26445 10.6544 6.36627 10.8622 6.40765C11.07 6.44898 11.2858 6.42871 11.4816 6.34766C11.6774 6.26657 11.8452 6.12903 11.9629 5.95285C12.0806 5.77665 12.1429 5.56905 12.1429 5.35714C12.1429 5.07298 12.0299 4.80054 11.829 4.59961C11.628 4.39868 11.3556 4.28571 11.0714 4.28571Z" fill="#BEFE46"/>
              </svg>
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-light leading-normal">
                Pool Total
              </span>
            </div>
            <span className="text-white font-['IBM_Plex_Mono'] text-[32px] font-semibold leading-normal">
              {poolTotal.toFixed(2)} {activeBlock}
            </span>
          </div>

          {/* Threshold */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.22222 20C1.61111 20 1.08815 19.7826 0.653333 19.3478C0.218519 18.913 0.000740741 18.3896 0 17.7778V2.22222C0 1.61111 0.217778 1.08815 0.653333 0.653333C1.08889 0.218519 1.61185 0.000740741 2.22222 0H17.7778C18.3889 0 18.9122 0.217778 19.3478 0.653333C19.7833 1.08889 20.0007 1.61185 20 2.22222V17.7778C20 18.3889 19.7826 18.9122 19.3478 19.3478C18.913 19.7833 18.3896 20.0007 17.7778 20H2.22222ZM13.5 17.7778H15.8611L17.7778 15.8611V14.4444H16.8333L13.5 17.7778ZM5.16667 12.2222L8.52778 8.88889L10.75 11.1111L16.3889 5.44444L14.8333 3.88889L10.75 7.97222L8.52778 5.75L3.61111 10.6667L5.16667 12.2222ZM2.22222 17.7778H3.16667L6.5 14.4444H4.13889L2.22222 16.3611V17.7778ZM11.6944 17.7778L15.0278 14.4444H12.6667L9.33333 17.7778H11.6944ZM7.55556 17.7778L10.8889 14.4444H8.52778L5.19444 17.7778H7.55556Z" fill="#BEFE46"/>
              </svg>
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-light leading-normal">
                Threshold
              </span>
            </div>
            <span className="text-white font-['IBM_Plex_Mono'] text-[32px] font-semibold leading-normal">
              {threshold} {activeBlock}
            </span>
          </div>

          {/* Available Rigs */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-start gap-2">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.7832 10.282L14.2112 18.5648H16.3533C17.0673 18.5648 17.0673 19.9929 16.3533 19.9929H4.92882C4.21479 19.9929 4.21479 18.5648 4.92882 18.5648H7.07091L8.49897 10.282C9.92703 11.2531 11.3551 11.2531 12.7832 10.282ZM11.9263 15.7087H9.35581L8.92739 18.5648H12.3547L11.9263 15.7087ZM11.3551 11.7815H9.92703L9.57002 14.2806H11.7121L11.3551 11.7815ZM13.8542 8.03999C13.8256 8.56837 13.5829 9.41092 13.1402 9.85362L18.4954 11.9672V19.4645C18.4954 20.1785 19.9235 20.1785 19.9235 19.4645V12.4955C20.9945 12.8526 21.7085 10.9961 20.6375 10.6391L13.8542 8.03999ZM4.92882 0C-0.0693966 0 -1.49746 12.1385 1.71568 12.1385C2.78673 12.1385 4.55752 6.56908 4.55752 6.56908L7.42793 7.64013C7.42793 7.05462 7.78494 6.25491 8.17052 5.84077L5.22871 4.72688C5.22871 4.72688 6.35688 1.21385 6.35688 0.714031C6.35688 0.357015 5.64285 0 4.92882 0ZM10.6411 9.99643C11.8978 9.99643 12.7832 9.11103 12.7832 7.85434C12.7832 6.61192 11.8978 5.71225 10.6411 5.71225C9.39865 5.71225 8.49897 6.6262 8.49897 7.8829C8.49897 9.12531 9.39865 9.99643 10.6411 9.99643Z" fill="#BEFE46"/>
              </svg>
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-light leading-normal">
                Rigs Available
              </span>
            </div>
            <span className="text-white font-['IBM_Plex_Mono'] text-[32px] font-semibold leading-normal">
              36
            </span>
          </div>
        </div>

        {/* Threshold Progress */}
        <div className="flex flex-col items-start gap-6 w-full">
          <div className="flex items-start gap-4">
            <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-xl font-normal leading-normal">
              Threshold Progress
            </span>
            <span className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-xl font-normal leading-normal">
              [{Math.round(progressPercentage)}% - {isDrawEnabled ? 'Draw enabled' : 'Draw disabled'}]
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-start gap-1 w-full h-7">
            {Array.from({ length: 70 }).map((_, i) => {
              const barPercentage = ((i + 1) / 70) * 100;
              const isActive = barPercentage <= progressPercentage;
              return (
                <div 
                  key={i} 
                  className={`flex-1 h-7 min-w-[6px] transition-colors duration-300 ${
                    isActive ? 'bg-[#BEFE46]' : 'bg-[#2A2A2A]'
                  }`} 
                />
              );
            })}
          </div>
        </div>
      </Link>
    </div>
  );
}
