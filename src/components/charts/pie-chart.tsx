/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import {Label, Pie, PieChart, ResponsiveContainer, Sector} from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: { name: string; value: number; fill: string }[];
  index: string;
  category: string;
  valueFormatter?: (value: number) => string;
  className?: string;
};

const chartConfig = {
  Stocks: {
    label: "Quantity",
  },

  january: {
    label: "january",
    color: "hsl(var(--chart-1))",
  },
  february: {
    label: "february",
    color: "hsl(var(--chart-2))",
  },
  march: {
    label: "march",
    color: "hsl(var(--chart-3))",
  },
  april: {
    label: "april",
    color: "hsl(var(--chart-4))",
  },
  may: {
    label: "may",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const PieChartComponent = ({
  data,
  index,
  category,
  valueFormatter,
  className: classname,
}: Props) => {
  const id = "pie-interactive";
  // State for selected stock ticker
  const [activeTicker, setActiveTicker] = React.useState(data[0]?.name || "");

  const activeIndex = React.useMemo(
      () => data.findIndex((item) => item.name === activeTicker),
      [activeTicker, data]
  );

  const tickers = React.useMemo(() => data.map((item) => item.name), [data]);

  return (
    <Card data-chart={id} className={`flex flex-col ${classname}`}>
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Stock Quantities</CardTitle>

        </div>
        <Select value={activeTicker} onValueChange={(value) => setActiveTicker(value)}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"          >
            <SelectValue placeholder="Select name" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {tickers.map((ticker) => (
                <SelectItem
                    key={ticker}
                    value={ticker}
                    className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    {ticker}
                  </div>
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({
                                  outerRadius = 0,
                                  ...props
                                }: PieSectorDataItem) => (
                      <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector
                            {...props}
                            outerRadius={outerRadius + 25}
                            innerRadius={outerRadius + 15}
                        />
                      </g>
                  )}
              >
                <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const currentData = data[activeIndex];
                        return (
                            <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                              <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                              >
                                {currentData?.value?.toLocaleString() || "N/A"}
                              </tspan>
                              <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                              >
                                Quantity
                              </tspan>
                            </text>
                        );
                      }
                    }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartComponent;
