"use client";

import { useTreasuryStats } from "@/lib/solana";

const TREASURY_TOKEN_SYMBOL = "$RIG";

const formatCompact = (amount: number | null) => {
  if (amount === null) return "—";
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}m`;
  }
  if (abs >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`;
  }
  return amount.toFixed(2);
};

export function TreasuryPanel() {
  const { stats, loading } = useTreasuryStats();
  const buybackBudget = stats?.buybackBudget ?? null;
  const burnVault = stats?.buybackBurnVault ?? null;
  const lpVault = stats?.buybackLpVault ?? null;

  const renderValue = (amount: number | null) => {
    if (loading) return "Loading...";
    return `${formatCompact(amount)} ${TREASURY_TOKEN_SYMBOL}`;
  };

  return (
    <div className="flex flex-col items-start gap-10 border border-[#595959] p-14">
      {/* Header */}
      <div className="flex items-center gap-4">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M39.2411 39.03H0V36.7059H39.2411V39.03ZM7.22635 34.0358H4.9023V16.4738H7.22635V34.0358ZM16.2638 34.0358H13.9398V16.4738H16.2638V34.0358ZM25.3013 34.0358H22.9772V16.4738H25.3013V34.0358ZM34.3388 34.0358H32.0147V16.4738H34.3388V34.0358ZM39.2411 13.8042H0L19.6205 0L39.2411 13.8042ZM7.3421 11.4801H31.899L19.6205 2.84095L7.3421 11.4801Z" fill="#BEFE46"/>
        </svg>
        <h2 className="text-white font-['IBM_Plex_Mono'] text-[35px] font-semibold">
          Treasury
        </h2>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-start gap-5 self-stretch">
        {/* Buyback Budget */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center p-3 bg-[#2B4100]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8 0C13.2243 0 13.6312 0.168749 13.9312 0.468794C14.2313 0.768839 14.4 1.17574 14.4 1.6V3.2C14.8243 3.2 15.2312 3.36875 15.5312 3.66879C15.8313 3.96884 16 4.37574 16 4.8V7.4156C16.1199 7.48494 16.2317 7.56917 16.3312 7.66879C16.6313 7.96884 16.8 8.37574 16.8 8.8V10.4C16.8 10.8243 16.6313 11.2312 16.3312 11.5312C16.2318 11.6307 16.1197 11.7144 16 11.7836V14.4C16 14.8243 15.8313 15.2312 15.5312 15.5312C15.2312 15.8313 14.8243 16 14.4 16H2.4C1.76348 16 1.15303 15.747 0.703045 15.2969C0.253058 14.8468 0 14.2365 0 13.6V2.4C0 2.3718 0.00109375 2.34391 0.00390625 2.31641C0.0250009 1.71027 0.272758 1.13353 0.703045 0.703045C1.15303 0.253058 1.76348 0 2.4 0H12.8ZM1.6 13.6C1.6 13.8122 1.68429 14.0156 1.83431 14.1656C1.98434 14.3157 2.18783 14.4 2.4 14.4H14.4V12H12.8C12.1635 12 11.5532 11.747 11.1031 11.2969C10.653 10.8468 10.4 10.2365 10.4 9.6C10.4 8.96348 10.653 8.35303 11.1031 7.90305C11.5532 7.45306 12.1635 7.2 12.8 7.2H14.4V4.8H2.4C2.12438 4.8 1.85476 4.74967 1.6 4.65938V13.6ZM12.8 8.8C12.5878 8.8 12.3844 8.88429 12.2344 9.03431C12.0843 9.18434 12 9.38783 12 9.6C12 9.81217 12.0843 10.0157 12.2344 10.1656C12.3844 10.3157 12.5878 10.4 12.8 10.4H15.2V8.8H12.8ZM2.4 1.6C2.18783 1.6 1.98434 1.68429 1.83431 1.83431C1.68429 1.98434 1.6 2.18783 1.6 2.4C1.6 2.61217 1.68429 2.81566 1.83431 2.96569C1.98434 3.11571 2.18783 3.2 2.4 3.2H12.8V1.6H2.4Z" fill="#BEFE46"/>
              </svg>
            </div>
            <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-[21px] font-normal">
              Buyback Budget
            </span>
          </div>
          <span className="text-white font-['IBM_Plex_Mono'] text-[57px] font-semibold">
            {renderValue(buybackBudget)}
          </span>
        </div>

        <div className="w-full h-[0.5px] bg-[#A7A7A7]" />

        {/* Total Burned */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center p-3 bg-[#301316]">
              <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5878 0.174717C7.3314 0.422847 10.5353 1.97272 11.4943 4.51622C11.9696 5.77729 11.833 7.06483 11.0879 8.34224C10.8653 8.72394 10.6405 9.09441 10.4225 9.45236C8.7828 12.1454 7.4873 14.2723 9.3186 17.9891L9.7696 18.9048H6.1182C4.5219 18.9081 2.9867 18.2869 1.8424 17.1739C1.2725 16.6261 0.8166 15.9705 0.5006 15.246C0.1846 14.5215 0.015 13.7416 0.0012 12.9513C0.0003 12.9029 0 12.8541 0 12.8051C0 9.2236 2.1491 7.3297 4.0454 5.6598C4.4959 5.2629 4.9214 4.8878 5.3091 4.5001C5.8676 3.9414 6.1393 3.4079 6.1145 2.9141C6.0854 2.3358 5.6481 1.9537 5.6437 1.9502L5.2509 1.6293L6.0649 0L6.5878 0.174717ZM13.3391 8.56152C13.6271 8.80263 16.1609 10.9598 16.6188 12.6379C16.6302 12.68 16.6405 12.7225 16.651 12.7642C16.8341 13.489 16.8488 14.2472 16.6931 14.9783C16.5375 15.7092 16.2162 16.3947 15.754 16.9818C15.2887 17.5823 14.6908 18.0683 14.0082 18.4017C13.3258 18.7349 12.5759 18.9069 11.8164 18.9048H11.3852L11.2155 18.5355C10.338 16.6269 10.0906 14.8486 10.4585 13.0988C10.7811 11.5644 11.5214 10.2116 12.3839 8.72877L12.7618 8.07827L13.3391 8.56152ZM7.0946 1.79658C7.2639 2.12299 7.3616 2.48238 7.3808 2.84973C7.4244 3.71665 7.029 4.57431 6.2062 5.39709C5.7901 5.81317 5.3296 6.219 4.8842 6.61126C3.1067 8.17688 1.2687 9.79666 1.2687 12.8051C1.2688 12.8462 1.2692 12.8871 1.27 12.9278C1.3185 15.5236 3.4935 17.636 6.1182 17.636H7.7748C6.2732 13.8275 7.7651 11.3758 9.3384 8.79198C9.5533 8.43899 9.776 8.0743 9.9926 7.70287C10.5434 6.75857 10.646 5.86213 10.3073 4.96354C9.7717 3.54344 8.1982 2.39963 7.0946 1.79658ZM13.0951 10.0397C11.6852 12.5564 10.9475 14.6082 12.198 17.6174C12.6977 17.5673 13.1824 17.4147 13.6216 17.1714C14.0606 16.9281 14.4455 16.598 14.7528 16.2012C15.0961 15.7657 15.3346 15.2568 15.4504 14.7144C15.5661 14.1722 15.5562 13.6104 15.4207 13.0728C15.4123 13.0395 15.4038 13.006 15.3947 12.9724C15.1755 12.1687 14.0324 10.9117 13.0951 10.0397Z" fill="#D71F23"/>
              </svg>
            </div>
            <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-[21px] font-normal">
              Total Burned
            </span>
          </div>
          <span className="text-white font-['IBM_Plex_Mono'] text-[57px] font-semibold">
            {renderValue(burnVault)}
          </span>
        </div>

        <div className="w-full h-[0.5px] bg-[#A7A7A7]" />

        {/* LP Locked */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center p-3 bg-[#0E2C25]">
              <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.4 0C9.73674 0 11.0183 0.531429 11.9634 1.47655C12.9086 2.42166 13.44 3.70329 13.44 5.04V7.56H14.28C15.6718 7.56 16.8 8.6882 16.8 10.08V15.96C16.8 17.3518 15.6718 18.48 14.28 18.48H2.52C1.1282 18.48 0 17.3518 0 15.96V10.08C0 8.6882 1.1282 7.56 2.52 7.56H3.36V5.04C3.36 3.70329 3.89143 2.42166 4.83655 1.47655C5.78166 0.531429 7.06329 0 8.4 0ZM2.52 9.24C2.05609 9.24 1.68 9.61609 1.68 10.08V15.96C1.68 16.4239 2.05609 16.8 2.52 16.8H14.28C14.7439 16.8 15.12 16.4239 15.12 15.96V10.08C15.12 9.61609 14.7439 9.24 14.28 9.24H2.52ZM8.4 1.68C7.50886 1.68 6.65451 2.03429 6.02441 2.66439C5.39431 3.2945 5.04 4.14886 5.04 5.04V7.56H11.76V5.04C11.76 4.14886 11.4057 3.2945 10.7756 2.66439C10.1455 2.03429 9.29114 1.68 8.4 1.68Z" fill="#19AC77"/>
              </svg>
            </div>
            <span className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-[21px] font-normal">
              LP Locked
            </span>
          </div>
          <span className="text-white font-['IBM_Plex_Mono'] text-[57px] font-semibold">
            {renderValue(lpVault)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-base font-normal leading-normal">
        30% of losing pool goes to $RIG buybacks (burn + LP lock).
        <br />
        10% to team ops. 10% carries forward to next Exploration.
      </p>
    </div>
  );
}
