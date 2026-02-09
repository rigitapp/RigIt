"use client";

import { WalletProvider } from "@/components/wallet-context";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedBlock } from "@/components/featured-block";
import { AllBlocksSection } from "@/components/all-blocks-section";
import { HowItWorks } from "@/components/how-it-works";
import { UserStats } from "@/components/user-stats";
import { TreasuryPanel } from "@/components/treasury-panel";
import { FooterSection } from "@/components/footer-section";

export default function AppPage() {
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
          <section className="relative overflow-hidden pb-[76vh]">
            <div
              className="absolute left-1/2 top-[20vh] mt-[120px] w-[95vw] aspect-[1837/1661] -translate-x-1/2 pointer-events-none"
              style={{
                backgroundImage: "url('/circular-pattern.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <div className="relative z-10">
              <HeroSection />
            </div>
          </section>

          {/* Featured Block Section */}
          <section className="w-full pt-3 pb-24">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
              <FeaturedBlock />
            </div>
          </section>

          {/* All Blocks Section */}
          <section className="w-full py-24">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
              <AllBlocksSection />
            </div>
          </section>

          {/* How it Works */}
          <section className="w-full py-24">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
              <HowItWorks />
            </div>
          </section>

          {/* Your Stats & Treasury */}
          <section className="w-full pt-24 pb-[196px]">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
              <div className="grid lg:grid-cols-2 gap-6">
                <UserStats />
                <TreasuryPanel />
              </div>
            </div>
          </section>

          </main>
        </div>

        <FooterSection />
      </div>
    </WalletProvider>
  );
}
