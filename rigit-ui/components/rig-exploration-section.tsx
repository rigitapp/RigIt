"use client";

import { useState } from "react";
import { useWallet } from "@/components/wallet-context";
import {
  useRigs,
  useDeposit,
  useClaimWinnings,
  useClaimRefund,
  useSolBalance,
  RIGS_PER_EXPLORATION,
  type BlockSymbol,
} from "@/lib/solana";

interface RigExplorationSectionProps {
  tokenSymbol: string;
}

interface RigCardProps {
  rigNumber: number;
  amount: string;
  players: number;
  isSelected?: boolean;
  onClick?: () => void;
}

function RigCard({ rigNumber, amount, players, isSelected, onClick }: RigCardProps) {
  return (
    <button
      onClick={onClick}
      className={`button-zoom flex flex-col items-center justify-center gap-6 p-[27px] border-[0.5px] transition-colors ${
        isSelected ? "border-[#BEFE46] bg-[#1B2802]" : "border-[#595959] hover:border-[#A7A7A7]"
      }`}
    >
      <span className={`text-xl font-normal font-['IBM_Plex_Mono'] ${isSelected ? "text-[#BEFE46]" : "text-[#595959]"}`}>
        Rig #{rigNumber}
      </span>
      <span className="text-white text-[32px] font-medium font-['IBM_Plex_Mono']">
        {amount}
      </span>
      <div className="flex items-center gap-[7.3px]">
        <svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.6666 17.3333V20H0V17.3333C0 17.3333 0 12 9.33331 12C18.6666 12 18.6666 17.3333 18.6666 17.3333ZM14 4.6667C14 3.74373 13.7263 2.84148 13.2135 2.07405C12.7007 1.30662 11.9719 0.708485 11.1192 0.355277C10.2664 0.00206919 9.32813 -0.0903462 8.42289 0.0897178C7.51765 0.269782 6.68613 0.714238 6.03349 1.36688C5.38084 2.01952 4.93639 2.85104 4.75632 3.75628C4.57626 4.66153 4.66867 5.59984 5.02188 6.45256C5.37509 7.30527 5.97323 8.03411 6.74065 8.54689C7.50808 9.05966 8.41033 9.33336 9.33331 9.33336C10.571 9.33336 11.758 8.84169 12.6331 7.96653C13.5083 7.09136 14 5.90438 14 4.6667ZM18.5866 12C19.4063 12.6343 20.077 13.4406 20.5515 14.362C21.0261 15.2835 21.2929 16.2977 21.3333 17.3333V20H26.6666V17.3333C26.6666 17.3333 26.6666 12.4934 18.5866 12ZM17.3333 4.90619e-05C16.4157 -0.00421911 15.5183 0.27009 14.76 0.786714C15.5699 1.91836 16.0054 3.27509 16.0054 4.6667C16.0054 6.05832 15.5699 7.41505 14.76 8.54669C15.5183 9.06332 16.4157 9.33763 17.3333 9.33336C18.571 9.33336 19.7579 8.84169 20.6331 7.96653C21.5083 7.09136 21.9999 5.90438 21.9999 4.6667C21.9999 3.42903 21.5083 2.24205 20.6331 1.36688C19.7579 0.491713 18.571 4.90619e-05 17.3333 4.90619e-05Z" fill={isSelected ? "#BEFE46" : "#595959"}/>
        </svg>
        <span className={`text-xl font-normal font-['IBM_Plex_Mono'] ${isSelected ? "text-[#BEFE46]" : "text-[#595959]"}`}>
          {players}
        </span>
      </div>
    </button>
  );
}

export function RigExplorationSection({ tokenSymbol }: RigExplorationSectionProps) {
  const {
    connected,
    connecting,
    connectWallet,
  } = useWallet();
  const block = (tokenSymbol?.toUpperCase() || "SOL") as BlockSymbol;
  const { rigs: onChainRigs, loading: rigsLoading } = useRigs(block);
  const { deposit, loading: depositLoading, error: depositError } = useDeposit();
  const { claim: claimWinnings, loading: claimWinLoading, error: claimWinError } = useClaimWinnings();
  const { claimRefund, loading: claimRefundLoading, error: claimRefundError } = useClaimRefund();
  const { balance: solBalance } = useSolBalance();
  const [selectedRigs, setSelectedRigs] = useState<number[]>([]);
  const [depositAmount, setDepositAmount] = useState("");

  const toggleRig = (rigNumber: number) => {
    setSelectedRigs((prev) =>
      prev.includes(rigNumber) ? prev.filter((r) => r !== rigNumber) : [...prev, rigNumber]
    );
  };

  // Build rig display data — use on-chain data if available, otherwise show empty rigs
  const rigs = onChainRigs.length > 0
    ? onChainRigs.map((rig) => ({
        id: rig.index + 1,
        amount: `${(rig.totalDeposits / 1e9).toFixed(2)} ${tokenSymbol}`,
        players: rig.depositCount,
      }))
    : Array.from({ length: RIGS_PER_EXPLORATION }, (_, i) => ({
        id: i + 1,
        amount: `0.00 ${tokenSymbol}`,
        players: 0,
      }));

  const ensureConnected = () => {
    if (connected) return true;
    if (connecting) return false;
    connectWallet();
    return false;
  };

  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    if (!selectedRigs.length) return;

    if (!ensureConnected()) return;

    // Deposit to each selected rig
    for (const rigIndex of selectedRigs) {
      await deposit({
        block,
        rigIndex: rigIndex - 1, // convert 1-indexed to 0-indexed
        amount: amount / selectedRigs.length,
      });
    }
  };

  const handleClaimWinnings = async () => {
    if (!ensureConnected()) return;
    await claimWinnings();
  };

  const handleClaimRefund = async () => {
    if (!ensureConnected()) return;
    await claimRefund();
  };

  return (
    <div className="flex flex-col items-start gap-16">
      {/* Exploration Details Header */}
      <div className="flex justify-between items-end self-stretch">
        {/* Disclaimer on Depositing */}
        <div className="flex flex-col items-start gap-8 w-[499px]">
          <div className="flex flex-col items-start gap-4 self-stretch">
            <p className="text-[24px] font-normal font-['IBM_Plex_Mono'] self-stretch">
              <span className="text-[#A7A7A7]">Select Rigs to </span>
              <span className="text-[#BEFE46]">Deposit {tokenSymbol}</span>
              <span className="text-[#A7A7A7]"> into</span>
            </p>
            <p className="text-base font-normal font-['IBM_Plex_Mono'] text-[#A7A7A7] self-stretch leading-[161.8%]">
              If this or these Rig(s) wins, you receive a share of the winner pool. If not, you receive a 50% refund of your deposit.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-start gap-4">
            <button
              type="button"
              onClick={handleClaimWinnings}
              disabled={claimWinLoading}
              className="group button-zoom flex items-center justify-center gap-[14.6px] px-[36.5px] py-[21.9px] w-[499px] border-[4px] border-[#BEFE46] bg-[#010101] hover:bg-[#BEFE46] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="text-[#BEFE46] group-hover:text-[#010101] font-['IBM_Plex_Mono'] text-[22px] font-normal transition-colors">
                {claimWinLoading ? "CLAIMING..." : "CLAIM WINNINGS"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleClaimRefund}
              disabled={claimRefundLoading}
              className="button-zoom flex items-center justify-center gap-[14.6px] px-[36.5px] py-[21.9px] w-[499px] bg-[#595959] hover:opacity-80 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="text-[#010101] font-['IBM_Plex_Mono'] text-[22px] font-normal">
                {claimRefundLoading ? "CLAIMING..." : "CLAIM REFUNDS"}
              </span>
            </button>
            {(claimWinError || claimRefundError || depositError) && (
              <span className="text-red-400 font-['IBM_Plex_Mono'] text-sm">
                {claimWinError || claimRefundError || depositError}
              </span>
            )}
          </div>
        </div>

        {/* Input Field + Deposit Details */}
        <div className="flex flex-col items-center gap-8 w-[420px]">
          {/* Input Field + Details */}
          <div className="flex flex-col items-center gap-4 self-stretch">
            {/* Input Field */}
            <div className="flex flex-col items-start gap-2 self-stretch p-4 border border-[#595959] bg-[#010101]">
              {/* Wallet Balance */}
              <div className="flex items-center gap-2">
                <span className="text-[#595959] font-['IBM_Plex_Mono'] text-base font-normal">
                  Balance:
                </span>
                <span className="text-white font-['IBM_Plex_Mono'] text-base font-semibold">
                  {connected && solBalance !== null ? `${solBalance.toFixed(4)} ${tokenSymbol}` : `0 ${tokenSymbol}`}
                </span>
              </div>

              {/* Token + Input Field */}
              <div className="flex justify-between items-center self-stretch">
                <div className="flex items-center gap-2">
                  {/* Solana Icon */}
                  <svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_solana_input)">
                      <path d="M5.0459 18.3141C5.23544 18.127 5.49242 18.022 5.76036 18.022H30.4823C30.9326 18.022 31.158 18.5598 30.8395 18.8742L25.9545 23.6947C25.765 23.8818 25.508 23.9868 25.2401 23.9868H0.518128C0.0677716 23.9868 -0.157675 23.449 0.160901 23.1347L5.0459 18.3141Z" fill="url(#paint0_linear_solana_input)"/>
                      <path d="M5.0459 0.304795C5.23544 0.117759 5.49242 0.0126953 5.76036 0.0126953H30.4823C30.9326 0.0126953 31.158 0.550521 30.8395 0.864895L25.9545 5.68545C25.765 5.87248 25.508 5.97755 25.2401 5.97755H0.518128C0.0677716 5.97755 -0.157675 5.43972 0.160901 5.12535L5.0459 0.304795Z" fill="url(#paint1_linear_solana_input)"/>
                      <path d="M25.9545 9.25204C25.765 9.06496 25.508 8.95996 25.2401 8.95996H0.518128C0.0677715 8.95996 -0.157675 9.49773 0.160901 9.81211L5.0459 14.6327C5.23544 14.8197 5.49242 14.9248 5.76036 14.9248H30.4823C30.9326 14.9248 31.158 14.387 30.8395 14.0726L25.9545 9.25204Z" fill="url(#paint2_linear_solana_input)"/>
                    </g>
                    <defs>
                      <linearGradient id="paint0_linear_solana_input" x1="20.954" y1="-6.56349" x2="4.17761" y2="25.9737" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_solana_input" x1="20.954" y1="-6.56354" x2="4.17761" y2="25.9736" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                      <linearGradient id="paint2_linear_solana_input" x1="20.954" y1="-6.56358" x2="4.17761" y2="25.9736" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                      <clipPath id="clip0_solana_input">
                        <rect width="31" height="24" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-white font-['IBM_Plex_Mono'] text-2xl font-semibold">
                    {tokenSymbol}
                  </span>
                </div>

                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*[.]?[0-9]*$"
                  value={depositAmount}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    if (/^\d*\.?\d*$/.test(nextValue)) {
                      setDepositAmount(nextValue);
                    }
                  }}
                  placeholder="0.0"
                  className={`p-2 pr-1 font-['IBM_Plex_Mono'] text-[40px] font-semibold leading-normal bg-transparent border-none outline-none text-right placeholder:text-right max-w-[200px] ${
                    depositAmount ? "text-white" : "text-[#595959]"
                  }`}
                />
              </div>
            </div>

            {/* Total Deposit + Amount */}
            <div className="flex justify-between items-center self-stretch">
              <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal">
                Total Deposit
              </span>
              <span className="text-white font-['IBM_Plex_Mono'] text-xl font-semibold">
                {depositAmount || "0"} {tokenSymbol}
              </span>
            </div>
          </div>

          {/* Deposit Button */}
          <button
            type="button"
            onClick={handleDeposit}
            disabled={depositLoading}
            className="group button-zoom flex items-center justify-center gap-4 px-10 py-6 bg-[#BEFE46] hover:bg-[#010101] border-[5px] border-transparent hover:border-[#BEFE46] self-stretch transition-all duration-300 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="text-[#010101] group-hover:text-[#BEFE46] font-['IBM_Plex_Mono'] text-2xl font-normal transition-all duration-300 ease-out">
              {depositLoading ? "DEPOSITING..." : "DEPOSIT"}
            </span>
          </button>
        </div>
      </div>

      {/* Rigs Grid */}
      <div className="grid grid-cols-6 gap-[22px] self-stretch">
        {rigs.map((rig) => (
          <RigCard
            key={rig.id}
            rigNumber={rig.id}
            amount={rig.amount}
            players={rig.players}
            isSelected={selectedRigs.includes(rig.id)}
            onClick={() => toggleRig(rig.id)}
          />
        ))}
      </div>
    </div>
  );
}
