"use client";

import {
  blockInfo,
  blockMetrics,
  currentExploration,
  type BlockType,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Trophy, Users, Zap } from "lucide-react";
import { PumpLogo } from "./pump-logo";
import { SkrLogo } from "./skr-logo";

const rotationOrder: BlockType[] = ["SOL", "PUMP", "SKR"];

const getRotationLabel = (
  activeBlock: BlockType,
  target: BlockType
): string => {
  const currentIndex = rotationOrder.indexOf(activeBlock);
  const targetIndex = rotationOrder.indexOf(target);
  const stepsAway =
    (targetIndex - currentIndex + rotationOrder.length) % rotationOrder.length;
  if (stepsAway === 0) return "Active Now";
  if (stepsAway === 1) return "Next Rotation";
  return `In ${stepsAway} Rotations`;
};

interface BlockDetailsProps {
  blockType: BlockType;
}

export function BlockDetails({ blockType }: BlockDetailsProps) {
  const block = blockInfo[blockType];
  const metrics = blockMetrics[blockType];
  const isActive = blockType === currentExploration.activeBlock;
  const poolTotal = isActive ? currentExploration.currentTotal : metrics.lastPool;
  const threshold = metrics.threshold;
  const progress = Math.min((poolTotal / threshold) * 100, 100);
  const thresholdMet = poolTotal >= threshold;

  return (
    <Card id="block-details" className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Block Details
          </span>
          <Badge variant={isActive ? "default" : "secondary"} className="font-mono">
            {getRotationLabel(currentExploration.activeBlock, blockType)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-11 h-11 rounded-lg bg-gradient-to-br flex items-center justify-center p-2",
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
                  "text-base font-bold",
                  isActive ? "text-white" : "text-muted-foreground"
                )}
              >
                {block.icon}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {block.name}
            </p>
            <p className="text-xl font-semibold">{block.symbol} Block</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Pool</p>
            <p className="font-mono font-semibold">
              {poolTotal.toFixed(2)} {block.symbol}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Threshold</p>
            <p className="font-mono font-semibold">
              {threshold} {block.symbol}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Participants</p>
            <p className="font-mono font-semibold">{metrics.participants}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Rigs</p>
            <p className="font-mono font-semibold">36 Open</p>
          </div>
        </div>

        {isActive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
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
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" />
              Last Winner
            </span>
            <span className="font-mono text-foreground">
              Rig #{metrics.lastWinnerRig}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Last Exploration
            </span>
            <span className="font-mono text-foreground">
              #{metrics.lastExploration}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Last Pool
            </span>
            <span className="font-mono text-foreground">
              {metrics.lastPool.toFixed(2)} {block.symbol}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
