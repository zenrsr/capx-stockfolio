"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChartComponent from "./charts/bar-chart";

export function PortfolioDiversification({
  className: classname,
}: {
  className: string;
}) {
  const diversificationData = [
    { sector: "Technology", percentage: 40 },
    { sector: "Healthcare", percentage: 20 },
    { sector: "Finance", percentage: 15 },
    { sector: "Consumer Goods", percentage: -10 },
    { sector: "Energy", percentage: 10 },
    { sector: "Real Estate", percentage: -5 },
    { sector: "Manufacturing", percentage: 7 },
    { sector: "Transportation", percentage: 2 },
    { sector: "Agriculture", percentage: -12 },
    { sector: "Telecommunications", percentage: 1 },
    { sector: "Retail", percentage: 3 },
    { sector: "Energy", percentage: -25 },
    { sector: "Utilities", percentage: 12 },
  ];

  return (
    <Card className={`mt-6 ${classname}`}>
      <CardHeader>
        <CardTitle>Portfolio Diversification</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChartComponent
          data={diversificationData}
          index="sector"
          categories={["percentage"]}
          colors={["blue"]}
          valueFormatter={(value: number) => `${value}%`}
          className="min-h-[300px]"
          chartTitle="Sector Allocation Percentages"
          chartDescription="Distribution of investments across different sectors"
        />
      </CardContent>
    </Card>
  );
}
