"use client";

import { useState, useMemo } from "react";
import {
  generateRigs,
  blockInfo,
  blockMetrics,
  currentExploration,
  type BlockType,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useWallet } from "./wallet-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  Users,
  ArrowLeft,
  TrendingUp,
  Zap,
  Lock,
  Clock,
  History,
} from "lucide-react";
import { PumpLogo } from "./pump-logo";
import { SkrLogo } from "./skr-logo";

interface RigGridProps {
  selectedBlock: BlockType;
  onBack: () => void;
}

// Rotation schedule
const rotationOrder: BlockType[] = ["SOL", "PUMP", "SKR"];

export function RigGrid({ selectedBlock, onBack }: RigGridProps) {
  const {
    connected,
    connecting,
    connectWallet,
  } = useWallet();
  const [selectedRig, setSelectedRig] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const rigs = useMemo(() => generateRigs(), []);
  const block = blockInfo[selectedBlock];
  const metrics = blockMetrics[selectedBlock];

  // Check if this block is currently active
  const isBlockActive = selectedBlock === currentExploration.activeBlock;
  const poolTotal = isBlockActive ? currentExploration.currentTotal : metrics.lastPool;
  const threshold = metrics.threshold;
  const progress = Math.min((poolTotal / threshold) * 100, 100);
  const thresholdMet = poolTotal >= threshold;

  const getNextRotation = (): string => {
    const currentIndex = rotationOrder.indexOf(currentExploration.activeBlock);
    const blockIndex = rotationOrder.indexOf(selectedBlock);
    const stepsAway =
      (blockIndex - currentIndex + rotationOrder.length) % rotationOrder.length;
    if (stepsAway === 1) return "Next rotation";
    return `In ${stepsAway} rotations`;
  };

  const handleRigClick = (rigId: number) => {
    // Only allow interaction if block is active
    if (!isBlockActive) return;

    if (!connected) {
      if (connecting) return;
      connectWallet();
      return;
    }
    setSelectedRig(rigId);
    setDialogOpen(true);
  };

  const handleDeposit = () => {
    // Mock deposit - in real app would call Solana program
    setDialogOpen(false);
    setDepositAmount("");
  };

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center p-2",
                  isBlockActive ? block.color : "from-muted to-muted/80"
                )}
              >
                {selectedBlock === "PUMP" ? (
                  <PumpLogo className="w-full h-full" isActive={isBlockActive} />
                ) : selectedBlock === "SKR" ? (
                  <SkrLogo className="w-full h-full" isActive={isBlockActive} />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isBlockActive ? "text-white" : "text-muted-foreground"
                    )}
                  >
                    {block.icon}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={cn(
                      "text-xl font-semibold",
                      !isBlockActive && "text-muted-foreground"
                    )}
                  >
                    {block.symbol} Block
                  </h2>
                  {!isBlockActive && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isBlockActive
                    ? "Select 1 of 36 Rigs to deposit into"
                    : "View-only mode. Deposits not available."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inactive block notice */}
        {!isBlockActive && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-secondary/50">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground">
                  This block is not active
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The {block.symbol} Block will be available for deposits{" "}
                  <span className="text-foreground font-medium">
                    {getNextRotation()}
                  </span>
                  . You can view the Rig layout and past exploration history
                  below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Block stats bar */}
        <div
          className={cn(
            "mb-6 p-4 rounded-lg border bg-card",
            isBlockActive ? "border-border" : "border-border/50"
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2">
                {isBlockActive ? (
                  <TrendingUp className="w-4 h-4 text-primary" />
                ) : (
                  <History className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isBlockActive ? "Total Pool:" : "Last Pool:"}
                </span>
                <span
                  className={cn(
                    "font-mono font-semibold",
                    !isBlockActive && "text-muted-foreground"
                  )}
                >
                  {poolTotal.toFixed(2)} {block.symbol}
                </span>
              </div>
              {isBlockActive && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    Threshold:
                  </span>
                  <span className="font-mono font-semibold">
                    {threshold} {block.symbol}
                  </span>
                </div>
              )}
            </div>
            {isBlockActive && (
              <div className="flex items-center gap-3 flex-1 max-w-sm">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                      thresholdMet ? "from-primary to-primary/80" : block.color
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    thresholdMet ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {progress.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rig grid */}
        <div
          className={cn(
            "grid grid-cols-6 gap-2 md:gap-3",
            !isBlockActive && "opacity-60"
          )}
        >
          {rigs.map((rig) => (
            <button
              key={rig.id}
              onClick={() => handleRigClick(rig.id)}
              disabled={!isBlockActive}
              className={cn(
                "button-zoom relative aspect-square rounded-lg border transition-all duration-200",
                "flex flex-col items-center justify-center gap-1 p-2",
                isBlockActive && "hover:scale-105 hover:z-10",
                !isBlockActive && "cursor-not-allowed",
                rig.userContribution > 0
                  ? "border-primary bg-primary/10"
                  : isBlockActive
                    ? "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                    : "border-border/50 bg-card/50"
              )}
            >
              {rig.userContribution > 0 && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}

              <span className="text-[10px] md:text-xs text-muted-foreground font-mono">
                #{rig.id}
              </span>
              <span
                className={cn(
                  "text-sm md:text-base font-semibold font-mono truncate w-full text-center",
                  !isBlockActive && "text-muted-foreground"
                )}
              >
                {rig.totalPooled.toFixed(1)}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Users className="w-2.5 h-2.5" />
                <span>{rig.participantCount}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          {isBlockActive ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-border bg-card" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-primary bg-primary/10 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-muted-foreground">Your Deposit</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Deposits disabled until this block becomes active</span>
            </div>
          )}
        </div>

        {/* Deposit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Deposit to Rig #{selectedRig}</DialogTitle>
              <DialogDescription>
                Enter the amount of {block.symbol} you want to deposit into this
                Rig.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="font-mono"
                />
                <span className="text-muted-foreground font-medium">
                  {block.symbol}
                </span>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>If this Rig wins, you receive a share of the winner pool.</p>
                <p>If not, you receive a 50% refund of your deposit.</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeposit}
                disabled={!depositAmount || Number(depositAmount) <= 0}
              >
                Deposit {block.symbol}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
