"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChartComponent from "./charts/bar-chart";
import { useStocks } from "@/app/context/stocks-context";
import {useEffect} from "react";

export function PortfolioDiversification({
  className: classname,
}: {
  className: string;
}) {

  const {stocks, fetchStocks} = useStocks();

console.log("Stocks:", stocks);


  const stockDiversification = Object.values(
      stocks.reduce((acc, stock) => {
        const sector = stock.cat;
        const profitLoss =  (stock.currentPrice - stock.buyPrice) * stock.quantity;

          if (sector) { // Ensure sector exists
              if (acc[sector]) {
                  acc[sector].percentage += profitLoss;
              } else {
                  acc[sector] = { sector, percentage: profitLoss };
              }
          } else {
              console.warn("Stock missing category:", stock); // Log unexpected cases
          }

          return acc;
      }, {} as Record<string, { sector: string; percentage: number }>)
  );

  console.log("Resulting Diversification Data:", stockDiversification);

  return (
    <Card className={`mt-6 ${classname}`}>
      <CardHeader>
        <CardTitle>Portfolio Diversification</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChartComponent
          data={stockDiversification}
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
