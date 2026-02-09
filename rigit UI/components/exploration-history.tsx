"use client";

import { useState } from "react";
import {
  explorationHistoryByBlock,
  blockInfo,
  type BlockType,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { History, Trophy, RotateCcw } from "lucide-react";

const BLOCKS: BlockType[] = ["SOL", "PUMP", "SKR"];
const HISTORY_LOCALE = "en-US";

export function ExplorationHistory() {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>("SOL");
  const history = explorationHistoryByBlock[selectedBlock];
  const block = blockInfo[selectedBlock];

  return (
    <Card id="history">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Exploration History
        </CardTitle>
        <div className="flex gap-2 mt-3">
          {BLOCKS.map((blockType) => {
            const info = blockInfo[blockType];
            const isSelected = selectedBlock === blockType;
            return (
              <button
                key={blockType}
                onClick={() => setSelectedBlock(blockType)}
                className={cn(
                  "button-zoom flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center",
                    info.color
                  )}
                >
                  <span className="text-[10px] font-bold text-white">
                    {info.icon}
                  </span>
                </div>
                {info.symbol}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
          {history.map((exploration) => {
            const isRollover = exploration.status === "rollover";

            return (
              <div
                key={exploration.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  isRollover
                    ? "border-dashed border-muted-foreground/30 bg-secondary/30"
                    : "border-border bg-secondary/50"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <span className="text-lg font-bold font-mono text-foreground">
                        {exploration.explorationNumber}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        Exploration #{exploration.explorationNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {exploration.timestamp.toLocaleDateString(HISTORY_LOCALE, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {exploration.timestamp.toLocaleTimeString(HISTORY_LOCALE, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={isRollover ? "outline" : "default"}
                    className={cn(
                      "gap-1",
                      !isRollover && "bg-primary text-primary-foreground"
                    )}
                  >
                    {isRollover ? (
                      <>
                        <RotateCcw className="w-3 h-3" />
                        Rollover
                      </>
                    ) : (
                      <>
                        <Trophy className="w-3 h-3" />
                        Rig #{exploration.winningRig}
                      </>
                    )}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Total Pool</p>
                    <p className="font-mono font-medium">
                      {exploration.totalPool.toFixed(2)} {block.symbol}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Winner Payout
                    </p>
                    <p
                      className={cn(
                        "font-mono font-medium",
                        isRollover ? "text-muted-foreground" : "text-primary"
                      )}
                    >
                      {isRollover
                        ? "—"
                        : `${exploration.winnerPayout.toFixed(2)} ${block.symbol}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Refund</p>
                    <p className="font-mono font-medium">
                      {exploration.refundPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Showing {history.length} Explorations for {block.name} Block
        </p>
      </CardContent>
    </Card>
  );
}
