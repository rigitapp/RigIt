"use client";

import { blockInfo, currentExploration, type BlockType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, Timer } from "lucide-react";

const rotationOrder: BlockType[] = ["SOL", "PUMP", "SKR"];

const getRotationLabel = (
  activeBlock: BlockType,
  target: BlockType
): string => {
  const currentIndex = rotationOrder.indexOf(activeBlock);
  const targetIndex = rotationOrder.indexOf(target);
  const stepsAway =
    (targetIndex - currentIndex + rotationOrder.length) % rotationOrder.length;
  if (stepsAway === 0) return "Active";
  if (stepsAway === 1) return "Next";
  return `+${stepsAway}`;
};

export function BlockRotation() {
  return (
    <Card id="rotation" className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            Block Rotation
          </span>
          <Badge variant="secondary" className="font-mono">
            2h + 40m
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Timer className="w-3.5 h-3.5" />
          Rotates each Exploration. 9 rounds daily.
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {rotationOrder.map((blockType) => {
            const block = blockInfo[blockType];
            const isActive = blockType === currentExploration.activeBlock;
            return (
              <div
                key={blockType}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg border",
                  isActive
                    ? "border-primary/60 bg-primary/10"
                    : "border-border bg-secondary/40"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-md bg-gradient-to-br flex items-center justify-center",
                    isActive ? block.color : "from-muted to-muted/80"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-bold",
                      isActive ? "text-white" : "text-muted-foreground"
                    )}
                  >
                    {block.icon}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{block.symbol}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {getRotationLabel(currentExploration.activeBlock, blockType)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-border text-xs text-muted-foreground">
          If threshold is not met, the pool rolls into the next rotation.
        </div>
      </CardContent>
    </Card>
  );
}
