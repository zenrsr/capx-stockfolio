"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieChartComponent from "./charts/pie-chart";
import { FinnHubComponent } from "./stocks/AlphaVantage";
import LineChartComponent from "./charts/line-chart";

export function Dashboard() {
  const portfolioValue = 100000;
  const topPerformingStock = "AAPL";
  const portfolioDistribution = [
    { name: "january", value: 186, fill: "var(--color-january)" },
    { name: "february", value: 305, fill: "var(--color-february)" },
    { name: "march", value: 237, fill: "var(--color-march)" },
    { name: "april", value: 173, fill: "var(--color-april)" },
    { name: "may", value: 209, fill: "var(--color-may)" },
  ];

  const historicalValue = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  return (
    <div className="grid gap-4 sm:col-span-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {new Intl.NumberFormat("en-US", {
              style: "decimal",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(portfolioValue)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Performing Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topPerformingStock}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 h-fit">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Portfolio Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PieChartComponent
            data={portfolioDistribution}
            index="name"
            category="value"
            valueFormatter={(value: number) => `${value}%`}
          />
        </CardContent>
      </Card>
      <Card className="sm:col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Historical Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChartComponent
            data={historicalValue}
            index="date"
            categories={["value"]}
            colors={["blue"]}
            valueFormatter={(value: number) => `$${value.toLocaleString()}`}
            className="h-fit"
          />
        </CardContent>
      </Card>
      <FinnHubComponent containerClassName="sm:col-span-full md:col-span-1 w-fit" />
    </div>
  );
}
