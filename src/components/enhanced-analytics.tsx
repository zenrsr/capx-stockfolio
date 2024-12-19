"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  className?: string;
};

export function EnhancedAnalytics({ className: classname }: Props) {
  const stockAnalytics = [
    {
      name: "Apple Inc.",
      ticker: "AAPL",
      gainLoss: 15.5,
      risk: "Low",
      diversification: "Tech-heavy",
    },
    {
      name: "Microsoft Corporation",
      ticker: "MSFT",
      gainLoss: 10.2,
      risk: "Low",
      diversification: "Tech-heavy",
    },
    {
      name: "Tesla, Inc.",
      ticker: "TSLA",
      gainLoss: -5.8,
      risk: "High",
      diversification: "Auto-sector",
    },
    {
      name: "Amazon.com, Inc.",
      ticker: "AMZN",
      gainLoss: 8.7,
      risk: "Medium",
      diversification: "E-commerce",
    },
  ];

  return (
    <Card className={`w-full ${classname}`}>
      <CardHeader>
        <CardTitle>Enhanced Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stock</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Gain/Loss %</TableHead>
              <TableHead>Risk Assessment</TableHead>
              <TableHead>Diversification Insight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockAnalytics.map((stock) => (
              <TableRow key={stock.ticker}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.ticker}</TableCell>
                <TableCell
                  className={
                    stock.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {stock.gainLoss.toFixed(2)}%
                </TableCell>
                <TableCell>{stock.risk}</TableCell>
                <TableCell>{stock.diversification}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
