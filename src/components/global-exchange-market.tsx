"use client";

import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { monthNames, staticCryptoData } from "@/lib/utils";

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function GlobalExchangeMarket() {
  const [selectedCrypto, setSelectedCrypto] = useState<"BTC" | "ETH" | "DOGE">(
    "BTC"
  );
  const [chartData, setChartData] = useState(staticCryptoData["BTC"]);
  const [todayPrice, setTodayPrice] = useState<number | null>(null);
  const [storedPrices, setStoredPrices] = useLocalStorage<
    Record<string, { price: number; timestamp: number }>
  >("cryptoPrices", {});

  useEffect(() => {
    async function fetchTodayPrice() {
      const currentTime = Date.now();
      const storedData = storedPrices[selectedCrypto];

      if (
        storedData &&
        currentTime - storedData.timestamp < 23 * 60 * 60 * 1000
      ) {
        setTodayPrice(storedData.price);
        return;
      }

      try {
        const url = `https://api.binance.com/api/v3/ticker/price`;
        const response = await axios.get(url, {
          params: {
            symbol: `${selectedCrypto}USDT`,
          },
        });

        const data = response.data;
        const price = parseFloat(data.price); // Ensure price is parsed as a number
        console.log("Fetched Price:", price);

        if (!isNaN(price)) {
          setTodayPrice(price);
          setStoredPrices((prev) => ({
            ...prev,
            [selectedCrypto]: { price, timestamp: currentTime },
          }));
        } else {
          setTodayPrice(null);
        }
      } catch (error) {
        console.error("Error fetching today's price:", error);
        setTodayPrice(null);
      }
    }

    fetchTodayPrice();
  }, [selectedCrypto, storedPrices, setStoredPrices]);

  useEffect(() => {
    setChartData(staticCryptoData[selectedCrypto]);
  }, [selectedCrypto]);

  return (
    <Card className="mt-6 w-full h-full">
      <CardHeader>
        <CardTitle>Global Crypto Market</CardTitle>
        <CardDescription>Past 6 Months with Today&apos;s Price</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Select Cryptocurrency:</h2>
          <Select
            defaultValue="BTC"
            onValueChange={(value) =>
              setSelectedCrypto(value as "BTC" | "ETH" | "DOGE")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="BTC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="DOGE">DOGE</SelectItem>
                <SelectItem value="PEPE">PEPE</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const idx = parseInt(value.split("-")[1]) - 1;
                return monthNames[idx];
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="line" />}
            />
            <Line
              dataKey="price"
              type="natural"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24;
                return (
                  <GitCommitVertical
                    key={payload.date}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke="var(--color-price)"
                  />
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 text-2xl font-semibold leading-none">
          Today&apos;s Price: {todayPrice ? `$${todayPrice.toFixed(5)}` : "N/A"}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing data from the first two quarters of 2024
        </div>
      </CardFooter>
    </Card>
  );
}
