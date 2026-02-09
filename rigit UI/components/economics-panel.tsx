"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ArrowRight } from "lucide-react";

const distributionItems = [
  {
    label: "Losers Refund",
    percentage: 50,
    color: "bg-chart-4",
    description: "Returned to non-winning participants",
  },
  {
    label: "Winner Payout",
    percentage: 50,
    color: "bg-primary",
    description: "Split from remaining pool",
    isNested: true,
  },
  {
    label: "$RIG Buybacks",
    percentage: 30,
    color: "bg-accent",
    description: "Burn + LP lock",
    isNested: true,
  },
  {
    label: "Team Ops",
    percentage: 10,
    color: "bg-chart-3",
    description: "Operations & development",
    isNested: true,
  },
  {
    label: "Ecosystem Carry",
    percentage: 10,
    color: "bg-chart-5",
    description: "Forward to next Exploration",
    isNested: true,
  },
];

export function EconomicsPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          How It Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual flow */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Pool Distribution</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            {distributionItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 ${item.isNested ? "ml-4" : ""}`}
              >
                <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual bar */}
        <div className="h-3 rounded-full overflow-hidden flex bg-secondary">
          <div className="bg-chart-4 w-[50%]" title="Losers Refund" />
          <div className="bg-primary w-[25%]" title="Winner Payout" />
          <div className="bg-accent w-[15%]" title="Buybacks" />
          <div className="bg-chart-3 w-[5%]" title="Team" />
          <div className="bg-chart-5 w-[5%]" title="Ecosystem" />
        </div>

        <div className="pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
          <p>
            Each Exploration lasts 2 hours, followed by a 40-minute cooldown.
          </p>
          <p>
            If minimum threshold is not met, the pool rolls over to the next
            round.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
