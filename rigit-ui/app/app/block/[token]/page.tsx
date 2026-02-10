"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { WalletProvider } from "@/components/wallet-context";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import { TokenDetailsHero } from "@/components/token-details-hero";
import { RigExplorationSection } from "@/components/rig-exploration-section";
import { ExplorationHistorySection } from "@/components/exploration-history-section";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function TokenDetailPage({ params }: PageProps) {
  const { token } = use(params);
  const tokenSymbol = token.toUpperCase();
  const router = useRouter();

  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col bg-[#010101] relative">
        <Header />

        <div className="flex-1 relative overflow-x-hidden">
          {/* Background elements */}
          <div
            className="absolute top-[-700px] left-[-654px] w-[2594px] h-[1548px] pointer-events-none"
            style={{
              backgroundImage: "url('/bg-lines.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />

          <main className="flex-1 relative w-full">
            {/* Back Button */}
            <div className="w-full px-16 pt-16">
              <button
                type="button"
                onClick={() => router.back()}
                className="button-zoom inline-flex items-center gap-2 text-[#BEFE46] font-['IBM_Plex_Mono'] text-lg hover:opacity-80 transition-opacity"
              >
                <span aria-hidden>←</span>
                <span>Back</span>
              </button>
            </div>

            {/* Token Details Hero */}
            <section className="w-full pt-12 pb-12">
              <div className="w-full px-16">
                <TokenDetailsHero tokenSymbol={tokenSymbol} />
              </div>
            </section>

            {/* Rig Exploration Section */}
            <section className="w-full py-12">
              <div className="w-full px-16">
                <RigExplorationSection tokenSymbol={tokenSymbol} />
              </div>
            </section>

            {/* Exploration History Section */}
            <section className="w-full py-16 pb-[150px]">
              <div className="w-full px-16">
                <ExplorationHistorySection activeToken={tokenSymbol} />
              </div>
            </section>
          </main>
        </div>

        <FooterSection />
      </div>
    </WalletProvider>
  );
}
