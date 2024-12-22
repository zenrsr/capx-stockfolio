"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StockInsight = {
  name: string;
  ticker: string;
  category: "Low Risk" | "High Growth" | "Popular Picks";
  description: string;
};

const stockInsights: StockInsight[] = [
  {
    name: "Johnson & Johnson",
    ticker: "JNJ",
    category: "Low Risk",
    description: "Stable healthcare giant with consistent dividends.",
  },
  {
    name: "NVIDIA Corporation",
    ticker: "NVDA",
    category: "High Growth",
    description: "Leading AI and graphics processor manufacturer.",
  },
  {
    name: "Walt Disney Co",
    ticker: "DIS",
    category: "Popular Picks",
    description: "Entertainment conglomerate with diverse revenue streams.",
  },
];

export function StockInsights() {
  return (
    <div className="mt-6 col-span-1 md:col-span-2 w-full">
      <h2 className="text-2xl font-bold mb-4">Stock Insights</h2>
      <div className="grid gap-4 md:grid-cols-1">
        {stockInsights.map((insight) => (
          <Card key={insight.ticker}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{insight.name}</span>
                <span className="text-sm text-muted-foreground">
                  {insight.ticker}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold mb-2">{insight.category}</p>
              <p className="text-sm text-muted-foreground">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
