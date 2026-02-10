"use client";

import { currentExploration, blockInfo } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Zap, TrendingUp, Users } from "lucide-react";
import { PumpLogo } from "./pump-logo";
import { SkrLogo } from "./skr-logo";

export function BlockCard() {
  const block = blockInfo[currentExploration.activeBlock];
  const threshold = currentExploration.minimumThreshold;
  const current = currentExploration.currentTotal;
  const progress = Math.min((current / threshold) * 100, 100);
  const thresholdMet = current >= threshold;

  return (
    <div id="explore" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Featured Block</h2>
        <span className="text-sm text-muted-foreground">
          Rotating daily across SOL, PUMP, SKR
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8">
        {/* Gradient accent */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
            block.color
          )}
        />

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Block icon and name */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center p-3",
                block.color
              )}
            >
              {currentExploration.activeBlock === "PUMP" ? (
                <PumpLogo className="w-full h-full" isActive={true} />
              ) : currentExploration.activeBlock === "SKR" ? (
                <SkrLogo className="w-full h-full" isActive={true} />
              ) : (
                <span className="text-2xl font-bold text-white">{block.icon}</span>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{block.symbol} Block</h3>
              <p className="text-muted-foreground">{block.name}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pool</p>
                <p className="font-semibold font-mono">
                  {current.toFixed(2)} {block.symbol}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Threshold</p>
                <p className="font-semibold font-mono">
                  {threshold} {block.symbol}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Users className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">36 Rigs</p>
                <p className="font-semibold">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Threshold Progress</span>
            <span
              className={cn(
                "font-medium",
                thresholdMet ? "text-primary" : "text-muted-foreground"
              )}
            >
              {progress.toFixed(0)}% {thresholdMet ? "(Draw Enabled)" : "(Needs More)"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                thresholdMet ? "from-primary to-primary/80" : block.color
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
