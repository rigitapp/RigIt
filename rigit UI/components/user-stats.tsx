"use client";

import { useWallet } from "./wallet-context";
import { useSolBalance } from "@/lib/solana";

export function UserStats() {
  const {
    connected,
    connecting,
    publicKey,
    connectWallet,
    disconnect,
  } = useWallet();
  const { balance: solBalance } = useSolBalance();
  const truncatedAddress = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

  return (
    <div className="flex flex-col justify-center items-center gap-8 border border-[#595959] p-14">
      {/* Header */}
      <div className="flex items-center gap-8 self-stretch">
        {/* Icon */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35.3382 0H4.41728C3.24575 0 2.12219 0.456929 1.29379 1.27027C0.465391 2.08361 0 3.18673 0 4.33697V34.6957C0 35.846 0.465391 36.9491 1.29379 37.7624C2.12219 38.5758 3.24575 39.0327 4.41728 39.0327H35.3382C36.5098 39.0327 37.6333 38.5758 38.4617 37.7624C39.2901 36.9491 39.7555 35.846 39.7555 34.6957V4.33697C39.7555 3.18673 39.2901 2.08361 38.4617 1.27027C37.6333 0.456929 36.5098 0 35.3382 0ZM35.3382 34.6957H4.41728V4.33697H35.3382V34.6957ZM13.2518 30.3588H8.83456V19.5164H13.2518V30.3588ZM22.0864 30.3588H17.6691V15.1794H22.0864V30.3588ZM30.921 30.3588H26.5037V8.67393H30.921V30.3588Z" fill={connected ? "#BEFE46" : "#595959"}/>
        </svg>

        <h2 className="text-white font-['IBM_Plex_Mono'] text-[35px] font-semibold">
          Your Stats
        </h2>

        {!connected ? (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="group button-zoom flex items-center justify-center gap-2 px-10 py-6 bg-[#BEFE46] border-[5px] border-transparent hover:bg-[#010101] hover:border-[#BEFE46] ml-auto transition-all duration-300 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              width="19"
              height="16"
              viewBox="0 0 19 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#010101] group-hover:text-[#BEFE46] transition-colors duration-300 ease-out"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.4627 4.57524C17.4109 4.57219 17.3558 4.57097 17.2973 4.57158H14.9887C13.0979 4.57158 11.4806 6.06004 11.4806 8.00015C11.4806 9.94027 13.0989 11.4287 14.9887 11.4287H17.2973C17.3558 11.4293 17.4112 11.4281 17.4637 11.4251C17.8523 11.4016 18.2191 11.2377 18.4958 10.9639C18.7725 10.69 18.9402 10.3249 18.9677 9.93661C18.9713 9.88175 18.9713 9.82232 18.9713 9.76747V6.23284C18.9713 6.17798 18.9713 6.11855 18.9677 6.0637C18.9402 5.67536 18.7725 5.31026 18.4958 5.03642C18.2191 4.76258 17.8513 4.59867 17.4627 4.57524ZM14.7866 8.91444C15.273 8.91444 15.6671 8.50484 15.6671 8.00015C15.6671 7.49547 15.273 7.08587 14.7866 7.08587C14.2993 7.08587 13.9053 7.49547 13.9053 8.00015C13.9053 8.50484 14.2993 8.91444 14.7866 8.91444Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.2965 12.8C17.3281 12.7987 17.3595 12.8049 17.3883 12.8181C17.417 12.8313 17.4423 12.851 17.462 12.8758C17.4817 12.9006 17.4952 12.9296 17.5016 12.9606C17.5079 12.9916 17.5069 13.0237 17.4985 13.0542C17.3157 13.7051 17.024 14.261 16.5568 14.7273C15.872 15.413 15.0043 15.7157 13.9328 15.8601C12.8905 16 11.5602 16 9.87977 16H7.9488C6.26834 16 4.93714 16 3.89577 15.8601C2.82423 15.7157 1.95657 15.4121 1.27177 14.7282C0.587886 14.0434 0.284343 13.1758 0.139886 12.1042C1.04308e-07 11.0619 0 9.73166 0 8.0512V7.9488C0 6.26834 1.04308e-07 4.93714 0.139886 3.89486C0.284343 2.82331 0.587886 1.95566 1.27177 1.27086C1.95657 0.586971 2.82423 0.283429 3.89577 0.138971C4.93806 -2.98023e-08 6.26834 0 7.9488 0H9.87977C11.5602 0 12.8914 1.19209e-07 13.9328 0.139886C15.0043 0.284343 15.872 0.587885 16.5568 1.27177C17.024 1.73989 17.3157 2.29486 17.4985 2.94583C17.5069 2.97634 17.5079 3.00839 17.5016 3.03938C17.4952 3.07037 17.4817 3.09943 17.462 3.12419C17.4423 3.14895 17.417 3.16872 17.3883 3.18189C17.3595 3.19507 17.3281 3.20127 17.2965 3.2H14.9888C12.395 3.2 10.1093 5.248 10.1093 8C10.1093 10.752 12.395 12.8 14.9888 12.8H17.2965ZM3.42857 3.65714C3.24671 3.65714 3.07229 3.72939 2.9437 3.85798C2.8151 3.98658 2.74286 4.16099 2.74286 4.34286C2.74286 4.52472 2.8151 4.69913 2.9437 4.82773C3.07229 4.95633 3.24671 5.02857 3.42857 5.02857H7.08571C7.26758 5.02857 7.44199 4.95633 7.57059 4.82773C7.69918 4.69913 7.77143 4.52472 7.77143 4.34286C7.77143 4.16099 7.69918 3.98658 7.57059 3.85798C7.44199 3.72939 7.26758 3.65714 7.08571 3.65714H3.42857Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-[#010101] group-hover:text-[#BEFE46] font-['IBM_Plex_Mono'] text-base font-normal transition-colors duration-300 ease-out">
              {connecting ? "CONNECTING..." : "CONNECT WALLET"}
            </span>
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="group flex items-center justify-center gap-2 px-10 py-6 bg-[#010101] border-4 border-[#BEFE46] ml-auto transition-all"
          >
            {/* Default Icon - logout icon with door */}
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
            {/* Hover Icon - simple arrow */}
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

      {/* Content */}
      <div className="flex flex-col items-start gap-8 self-stretch">
        <div className="w-full h-[0.5px] bg-[#A7A7A7]" />

        {!connected ? (
          <div className="flex flex-col items-start gap-4 self-stretch">
            <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal">
              Connect wallet to view your stats
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4 self-stretch">
            {/* SOL Balance */}
            <div className="flex items-center justify-between self-stretch">
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal">
                SOL Balance
              </span>
              <span className="text-white font-['IBM_Plex_Mono'] text-base font-medium">
                {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : "—"}
              </span>
            </div>

            {/* $RIG Holdings — reads from SPL token account once mint is deployed */}
            <div className="flex items-center justify-between self-stretch">
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal">
                $RIG Holdings
              </span>
              <span className="text-white font-['IBM_Plex_Mono'] text-base font-medium">
                0 $RIG
              </span>
            </div>

            {/* Total Deposited — reads from on-chain UserStats PDA once deployed */}
            <div className="flex items-center justify-between self-stretch">
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal">
                Total Deposited
              </span>
              <span className="text-white font-['IBM_Plex_Mono'] text-base font-medium">
                0.00 SOL
              </span>
            </div>

            {/* Ticket Multiplier — computed from $RIG balance once available */}
            <div className="flex items-center justify-between self-stretch">
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal">
                Ticket Multiplier
              </span>
              <span className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-base font-medium">
                1.0x
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
