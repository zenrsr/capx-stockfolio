/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { monthNames } from "@/lib/utils";

type ProRecommendationTrendps = {
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  symbol?: string;
};

interface StackedBarChartProps {
  data: ProRecommendationTrendps[];
}

const chartConfig = {
  strongBuy: {
    label: "Strong Buy",
    color: "hsl(var(--chart-1))",
  },
  buy: {
    label: "buy",
    color: "hsl(var(--chart-2))",
  },
  hold: {
    label: "Hold",
    color: "hsl(var(--chart-3))",
  },
  sell: {
    label: "Sell",
    color: "hsl(var(--chart-4))",
  },
  strongSell: {
    label: "Strong Sell",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export const StackedBarChartComponent = ({
  data: chartData,
}: StackedBarChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tooltip - Custom label</CardTitle>
        <CardDescription>
          Tooltip with custom label from chartConfig.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const monthIndex = parseInt(value.slice(5, 7)) - 1;
                return monthNames[monthIndex];
              }}
            />
            <Bar
              dataKey="hold"
              stackId="a"
              fill="hsl(var(--chart-3))"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="buy"
              stackId="a"
              fill="hsl(var(--chart-1))"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="strongBuy"
              stackId="a"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />

            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
              defaultIndex={1}
              allowEscapeViewBox={{ x: true, y: true }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StackedBarChartComponent;
