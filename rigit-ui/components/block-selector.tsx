"use client";

import {
  blockInfo,
  blockMetrics,
  currentExploration,
  type BlockType,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Star,
  TrendingUp,
  Users,
  Lock,
  Clock,
} from "lucide-react";
import { PumpLogo } from "./pump-logo";
import { SkrLogo } from "./skr-logo";

interface BlockSelectorProps {
  selectedBlock: BlockType | null;
  onSelectBlock: (block: BlockType) => void;
}

// Rotation schedule - which block comes next
const rotationOrder: BlockType[] = ["SOL", "PUMP", "SKR"];

export function BlockSelector({
  selectedBlock,
  onSelectBlock,
}: BlockSelectorProps) {
  const featuredBlock = currentExploration.activeBlock;
  const blocks: BlockType[] = ["SOL", "PUMP", "SKR"];

  const getNextRotation = (blockType: BlockType): string => {
    const currentIndex = rotationOrder.indexOf(featuredBlock);
    const blockIndex = rotationOrder.indexOf(blockType);
    const stepsAway =
      (blockIndex - currentIndex + rotationOrder.length) % rotationOrder.length;
    if (stepsAway === 0) return "Active Now";
    if (stepsAway === 1) return "Next Rotation";
    return `In ${stepsAway} Rotations`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">All Blocks</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Only the featured block is active for deposits. View others to check
            history.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {blocks.map((blockType) => {
          const block = blockInfo[blockType];
          const stats = blockMetrics[blockType];
          const isActive = blockType === featuredBlock;
          const isSelected = blockType === selectedBlock;
          const totalPool = isActive ? stats.totalPool : stats.lastPool;

          return (
            <button
              key={blockType}
              onClick={() => onSelectBlock(blockType)}
              className={cn(
                "button-zoom relative text-left rounded-xl border transition-all duration-200",
                "p-5",
                isActive && "hover:scale-[1.02]",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : isActive
                    ? "border-primary/50 bg-card hover:border-primary"
                    : "border-border bg-card/50 hover:border-border/80"
              )}
            >
              {/* Active / Inactive badge */}
              {isActive ? (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Active Now
                </div>
              ) : (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getNextRotation(blockType)}
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center p-2",
                      isActive ? block.color : "from-muted to-muted/80"
                    )}
                  >
                    {blockType === "PUMP" ? (
                  <PumpLogo className="w-full h-full" isActive={isActive} />
                ) : blockType === "SKR" ? (
                  <SkrLogo className="w-full h-full" isActive={isActive} />
                ) : (
                  <span
                    className={cn(
                      "text-lg font-bold",
                      isActive ? "text-white" : "text-muted-foreground"
                    )}
                  >
                    {block.icon}
                  </span>
                )}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-semibold text-lg",
                        !isActive && "text-muted-foreground"
                      )}
                    >
                      {block.symbol} Block
                    </h3>
                    <p className="text-sm text-muted-foreground">{block.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isActive && (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isSelected
                        ? "text-primary rotate-90"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              </div>

              {/* Block stats */}
              <div
                className={cn(
                  "mt-4 pt-4 border-t grid grid-cols-2 gap-4",
                  isActive ? "border-border" : "border-border/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {isActive ? "Current Pool" : "Last Pool"}
                    </p>
                    <p
                      className={cn(
                        "font-mono font-medium text-sm",
                        !isActive && "text-muted-foreground"
                      )}
                    >
                      {totalPool.toFixed(1)} {block.symbol}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-chart-3" : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {isActive ? "Players" : "Last Players"}
                    </p>
                    <p
                      className={cn(
                        "font-mono font-medium text-sm",
                        !isActive && "text-muted-foreground"
                      )}
                    >
                      {stats.participants}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div
                className={cn(
                  "mt-3 text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive
                  ? "36 Rigs open for deposits"
                  : "View history & past explorations"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
