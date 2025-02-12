/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";

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

type Props = {
  data: { sector: string; percentage: number }[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  chartTitle?: string;
  chartDescription?: string;
};

const chartConfig = {
  percentage: {
    label: "Percentage : ",
  },
} satisfies ChartConfig;

const BarChartComponent = ({
  data: chartData,
  index,
  categories,
  valueFormatter,
  className: classname,
}: Props) => {
  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Unable to render bar chart</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>StockFolio Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]} barSize={40} minPointSize={10}>
              <LabelList position="top" dataKey="sector" fillOpacity={1} />
              {chartData.map((item) => (
                <Cell
                  key={item.sector}
                  fill={
                    item.percentage > 0
                      ? "hsl(var(--chart-1))"
                      : "hsl(var(--chart-5))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
