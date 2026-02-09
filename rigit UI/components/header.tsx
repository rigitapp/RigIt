"use client";

import Link from "next/link";
import { useWallet } from "./wallet-context";

function XIcon() {
  return (
    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path fillRule="evenodd" clipRule="evenodd" d="M24.54 24L14.9433 10.0124L14.9597 10.0255L23.6125 0H20.721L13.6721 8.16L8.0745 0H0.491L9.4505 13.0593L9.4494 13.0582L0 24H2.8916L10.7282 14.9215L16.9565 24H24.54ZM6.9288 2.1818L20.3936 21.8182H18.1022L4.6265 2.1818H6.9288Z" fill="currentColor"/>
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12.3 0C5.5104 0 0 5.5104 0 12.3C0 19.0896 5.5104 24.6 12.3 24.6C19.0896 24.6 24.6 19.0896 24.6 12.3C24.6 5.5104 19.0896 0 12.3 0ZM18.0072 8.364C17.8227 10.3074 17.0232 15.0306 16.6173 17.2077C16.4451 18.1302 16.1007 18.4377 15.7809 18.4746C15.0675 18.5361 14.5263 18.0072 13.8375 17.5521C12.7551 16.8387 12.1401 16.3959 11.0946 15.7071C9.8769 14.9076 10.6641 14.4648 11.3652 13.7514C11.5497 13.5669 14.6985 10.701 14.76 10.4427C14.7685 10.4036 14.7674 10.363 14.7567 10.3244C14.746 10.2858 14.726 10.2504 14.6985 10.2213C14.6247 10.1598 14.5263 10.1844 14.4402 10.1967C14.3295 10.2213 12.6075 11.3652 9.2496 13.6284C8.7576 13.9605 8.3148 14.1327 7.9212 14.1204C7.4784 14.1081 6.642 13.8744 6.0147 13.6653C5.2398 13.4193 4.6371 13.284 4.6863 12.8535C4.7109 12.6321 5.0184 12.4107 5.5965 12.177C9.1881 10.6149 11.5743 9.5817 12.7674 9.0897C16.1868 7.6629 16.8879 7.4169 17.3553 7.4169C17.4537 7.4169 17.6874 7.4415 17.835 7.5645C17.958 7.6629 17.9949 7.7982 18.0072 7.8966C17.9949 7.9704 18.0195 8.1918 18.0072 8.364Z" fill="currentColor"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12.2979 0C10.6829 0 9.0838 0.318103 7.5917 0.936121C6.0997 1.55414 4.7439 2.46003 3.602 3.602C1.2957 5.9083 0 9.0363 0 12.2979C0 17.7336 3.5295 22.3453 8.4118 23.981C9.0267 24.0793 9.2234 23.6981 9.2234 23.3661V21.2877C5.8169 22.0256 5.0913 19.6398 5.0913 19.6398C4.5256 18.2132 3.7263 17.832 3.7263 17.832C2.6072 17.0695 3.8124 17.0941 3.8124 17.0941C5.0421 17.1802 5.6939 18.3608 5.6939 18.3608C6.7639 20.2301 8.5717 19.6767 9.2726 19.3815C9.3833 18.5822 9.7031 18.0411 10.0474 17.7336C7.3173 17.4262 4.4518 16.3685 4.4518 11.683C4.4518 10.318 4.9192 9.2234 5.7185 8.3503C5.5956 8.0428 5.1651 6.7639 5.8415 5.1036C5.8415 5.1036 6.8745 4.7716 9.2234 6.358C10.195 6.0875 11.2526 5.9522 12.2979 5.9522C13.3432 5.9522 14.4009 6.0875 15.3724 6.358C17.7213 4.7716 18.7543 5.1036 18.7543 5.1036C19.4307 6.7639 19.0003 8.0428 18.8773 8.3503C19.6767 9.2234 20.144 10.318 20.144 11.683C20.144 16.3808 17.2663 17.4139 14.5238 17.7213C14.9666 18.1025 15.3724 18.8527 15.3724 19.9964V23.3661C15.3724 23.6981 15.5692 24.0916 16.1964 23.981C21.0786 22.333 24.5958 17.7336 24.5958 12.2979C24.5958 10.6829 24.2778 9.0838 23.6597 7.5917C23.0417 6.0997 22.1358 4.7439 20.9939 3.602C19.8519 2.46 18.4962 1.55414 17.0041 0.936121C15.5121 0.318103 13.9129 0 12.2979 0Z" fill="currentColor"/>
    </svg>
  );
}

export function Header() {
  const { connected, connecting, publicKey, connectWallet, disconnect } = useWallet();
  const truncatedAddress = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

  return (
    <header className="w-full bg-[#010101] sticky top-0 z-50 pt-[10px]">
      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="h-[100px] flex items-center justify-between border border-[#BEFE46] px-[clamp(16px,2vw,32px)]">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <svg
              viewBox="0 0 84 68"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[clamp(64px,5vw,84px)] h-auto"
            >
              <path d="M67.2031 0V16.8805H16.8008V50.6416H0V0H67.2031Z" fill="#BEFE46"/>
              <path d="M84 16.8799H67.1992V50.641H84V16.8799Z" fill="#BEFE46"/>
              <path d="M67.1992 50.6416H16.7969V67.5222H67.1992V50.6416Z" fill="#BEFE46"/>
            </svg>
          </Link>

          {/* Navigation & Social */}
          <div className="flex items-center gap-[clamp(16px,2.5vw,32px)]">
            <nav className="flex items-center gap-[clamp(12px,2vw,32px)]">
              <a
                href="#"
                className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-[clamp(16px,1.4vw,24px)] font-normal hover:text-[#71A215] hover:underline transition-colors"
              >
                DEMO
              </a>
              <a
                href="#"
                className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-[clamp(16px,1.4vw,24px)] font-normal hover:text-[#71A215] hover:underline transition-colors"
              >
                LITEPAPER
              </a>
              <a
                href="#"
                className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-[clamp(16px,1.4vw,24px)] font-normal hover:text-[#71A215] hover:underline transition-colors"
              >
                DOCUMENTATION
              </a>
              <a
                href="#"
                className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-[clamp(16px,1.4vw,24px)] font-normal hover:text-[#71A215] hover:underline transition-colors"
              >
                HISTORY
              </a>
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-[clamp(12px,1.6vw,20px)]">
              <a
                href="#"
                className="w-[clamp(36px,2.8vw,48px)] h-[clamp(36px,2.8vw,48px)] border-[0.5px] border-white flex items-center justify-center p-[clamp(8px,1vw,12px)] text-white hover:text-[#838383] hover:border-[#838383] transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                href="#"
                className="w-[clamp(36px,2.8vw,48px)] h-[clamp(36px,2.8vw,48px)] border-[0.5px] border-white flex items-center justify-center p-[clamp(8px,1vw,12px)] text-white hover:text-[#838383] hover:border-[#838383] transition-colors"
                aria-label="Telegram"
              >
                <TelegramIcon />
              </a>
              <a
                href="#"
                className="w-[clamp(36px,2.8vw,48px)] h-[clamp(36px,2.8vw,48px)] border-[0.5px] border-white flex items-center justify-center p-[clamp(8px,1vw,12px)] text-white hover:text-[#838383] hover:border-[#838383] transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
            </div>

            {/* Wallet Connect/Disconnect Button */}
            {!connected ? (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="group flex items-center justify-center gap-2 px-10 py-6 bg-[#BEFE46] border-4 border-[#BEFE46] hover:bg-[#010101] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg
                  className="shrink-0 group-hover:hidden"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 16V0H8V1.77778H1.77778V14.2222H8V16H0ZM11.5556 12.4444L10.3333 11.1556L12.6 8.88889H5.33333V7.11111H12.6L10.3333 4.84444L11.5556 3.55556L16 8L11.5556 12.4444Z"
                    fill="#010101"
                    className="group-hover:fill-[#BEFE46]"
                  />
                </svg>
                <svg
                  className="shrink-0 hidden group-hover:block"
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.22222 8.88889L5 7.6L7.26667 5.33333H0V3.55556H7.26667L5 1.28889L6.22222 0L10.6667 4.44444L6.22222 8.88889Z"
                    fill="#BEFE46"
                  />
                </svg>
                <span className="text-[#010101] group-hover:text-[#BEFE46] font-['IBM_Plex_Mono'] text-base font-normal leading-normal transition-colors">
                  {connecting ? "CONNECTING..." : "CONNECT"}
                </span>
              </button>
            ) : (
              <button
                onClick={disconnect}
                className="group flex items-center justify-center gap-2 px-10 py-6 bg-[#010101] border-4 border-[#BEFE46] transition-all"
              >
                <svg
                  className="shrink-0 group-hover:hidden"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 16V0H8V1.77778H1.77778V14.2222H8V16H0ZM11.5556 12.4444L10.3333 11.1556L12.6 8.88889H5.33333V7.11111H12.6L10.3333 4.84444L11.5556 3.55556L16 8L11.5556 12.4444Z"
                    fill="#BEFE46"
                  />
                </svg>
                <svg
                  className="shrink-0 hidden group-hover:block"
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.22222 8.88889L5 7.6L7.26667 5.33333H0V3.55556H7.26667L5 1.28889L6.22222 0L10.6667 4.44444L6.22222 8.88889Z"
                    fill="#BEFE46"
                  />
                </svg>
                <span className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-base font-normal leading-normal">
                  DISCONNECT{truncatedAddress ? ` ${truncatedAddress}` : ""}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
