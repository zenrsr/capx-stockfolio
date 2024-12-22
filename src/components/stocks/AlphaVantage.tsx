"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import StackedBarChartComponent from "./StackedBarChartComponent";
import { TfiMicrosoftAlt } from "react-icons/tfi";
import { FaApple, FaGoogle, FaAmazon } from "react-icons/fa";
import { BsNvidia } from "react-icons/bs";
import { DNA, RotatingLines } from "react-loader-spinner";

interface StockData {
  c: number; // Current price
  h: number; // High price
  l: number; // Low price
  o: number; // Open price
  pc: number; // Previous close price
}

interface RecommendationTrend {
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

interface CachedData<T> {
  data: T;
  timestamp: number; // Time when the data was cached
}

const stockCache: Record<string, CachedData<StockData>> = {};
const recommendationCache: Record<
  string,
  CachedData<RecommendationTrend[]>
> = {};

const data = [
  {
    name: "Microsoft Corp.",
    value: "MSFT",
    icon: TfiMicrosoftAlt,
  },
  {
    name: "Alphabet Inc.",
    value: "GOOGL",
    icon: FaGoogle,
  },
  {
    name: "Apple Inc.",
    value: "AAPL",
    icon: FaApple,
  },
  {
    name: "Nvidia Corp.",
    value: "NVDA",
    icon: BsNvidia,
  },
  {
    name: "Amazon Inc.",
    value: "AMZN",
    icon: FaAmazon,
  },
];

export const FinnHubComponent = ({
  containerClassName,
}: {
  containerClassName: string;
}) => {
  const [stock, setStock] = useState("GOOGL");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [recommendationTrends, setRecommendationTrends] = useState<
    RecommendationTrend[]
  >([]);

  const { toast } = useToast();
  const isMounted = useRef(true);

  const finnhubApiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  const CACHE_EXPIRY_MS = 5 * 60 * 1000;

  const isCacheValid = useCallback(
    (timestamp: number): boolean => {
      return Date.now() - timestamp < CACHE_EXPIRY_MS;
    },
    [CACHE_EXPIRY_MS]
  );

  const fetchStockData = useCallback(
    async (symbol: string) => {
      const cached = stockCache[symbol];
      if (cached && isCacheValid(cached.timestamp)) {
        setStockData(cached.data);
        return;
      }

      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
      try {
        const response = await fetch(url);
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description:
              "You have exceeded the API rate limit. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Invalid stock data response");
        }
        stockCache[symbol] = { data, timestamp: Date.now() };
        if (isMounted.current) {
          setStockData(data);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        if (isMounted.current) {
          setStockData(null);
        }
      }
    },
    [finnhubApiKey, toast, isCacheValid]
  );

  const fetchRecommendationTrends = useCallback(
    async (symbol: string) => {
      const cached = recommendationCache[symbol];
      if (cached && isCacheValid(cached.timestamp)) {
        setRecommendationTrends(cached.data);
        return;
      }

      const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${finnhubApiKey}`;
      try {
        const response = await fetch(url);
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description:
              "You have exceeded the API rate limit. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Invalid recommendation trends response");
        }

        const trends = data.slice(0, 6).reverse();
        recommendationCache[symbol] = { data: trends, timestamp: Date.now() };
        if (isMounted.current) {
          setRecommendationTrends(trends);
        }
      } catch (error) {
        console.error("Error fetching recommendation trends:", error);
        if (isMounted.current) {
          setRecommendationTrends([]);
        }
      }
    },
    [finnhubApiKey, toast, isCacheValid]
  );

  useEffect(() => {
    isMounted.current = true;
    fetchStockData(stock);
    fetchRecommendationTrends(stock);
    return () => {
      isMounted.current = false;
    };
  }, [stock, fetchStockData, fetchRecommendationTrends]);

  return (
    <Card className={containerClassName}>
      <CardHeader>
        <CardTitle>Finnhub Stock Data</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex justify-between items-center px-3">
          <>
            {data.map((item) => {
              if (item.value === stock) {
                return (
                  <div
                    key={item.value}
                    className="flex flex-1 gap-4 items-center"
                  >
                    <item.icon />
                    <span className="capitalize font-mono font-semibold text-ellipsis">
                      {item.name}
                    </span>
                  </div>
                );
              }
            })}
          </>
          <Select onValueChange={(value) => setStock(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={stock} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="AAPL">AAPL</SelectItem>
                <SelectItem value="MSFT">MSFT</SelectItem>
                <SelectItem value="NVDA">NVDA</SelectItem>
                <SelectItem value="AMZN">AMZN</SelectItem>
                <SelectItem value="GOOGL">GOOGL</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Card>
          {stockData ? (
            <>
              <CardHeader>
                <CardTitle>Current Price: ${stockData.c}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Open: ${stockData.o}</p>
                <p className="text-muted-foreground">High: ${stockData.h}</p>
                <p className="text-muted-foreground">Low: ${stockData.l}</p>
                <p className="text-muted-foreground">
                  Previous Close: ${stockData.pc}
                </p>
              </CardContent>
            </>
          ) : (
            <div className="flex p-4 justify-center">
              <RotatingLines
                visible={true}
                strokeColor="gray"
                width="56"
                strokeWidth="2.5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          )}
        </Card>

        {recommendationTrends && recommendationTrends.length > 0 ? (
          <StackedBarChartComponent data={recommendationTrends} />
        ) : (
          <div className="flex p-4 justify-center">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
