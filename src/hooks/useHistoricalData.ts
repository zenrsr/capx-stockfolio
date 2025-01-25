/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { fetchWithRetry } from "@/hooks/useCurrentPrice";
import { toast } from "sonner"; // For user feedback

type HistoricalData = {
  date: string;
  price: number;
};

type Stock = {
  ticker: string;
  quantity: number;
  isCrypto: boolean;
};

type PortfolioData = {
  date: string;
  value: number;
};

const DEFAULT_HISTORICAL_DATA: HistoricalData[] = [
  { date: "2023-01-01", price: 100 },
  { date: "2023-02-01", price: 105 },
  { date: "2023-03-01", price: 110 },
  { date: "2023-04-01", price: 108 },
  { date: "2023-05-01", price: 115 },
  { date: "2023-06-01", price: 120 },
];

export const useHistoricalData = (stocks: Stock[]) => {
  const [historicalPortfolio, setHistoricalPortfolio] = useState<
    PortfolioData[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate dynamic default data based on the current date and stock quantity
  const generateDefaultData = (stocks: Stock[]): PortfolioData[] => {
    const today = new Date();
    const defaultData: PortfolioData[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      defaultData.push({
        date: date.toISOString().split("T")[0],
        value: 100 * (stocks[0]?.quantity || 1) * (1 + i * 0.05), // Simulate growth
      });
    }

    return defaultData.reverse(); // Sort from oldest to newest
  };

  const fetchStockHistoricalData = async (
    ticker: string
  ): Promise<HistoricalData[]> => {
    const proxyUrl =
      process.env.REACT_APP_PROXY_URL || "https://api.allorigins.win/raw?url=";
    const url = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`;

    try {
      const data = await fetchWithRetry(url);

      if (
        !data.chart?.result?.[0]?.timestamp ||
        !data.chart?.result?.[0]?.indicators?.quote?.[0]?.close
      ) {
        throw new Error(`No historical data available for stock ${ticker}.`);
      }

      const timestamps = data.chart.result[0].timestamp;
      const prices = data.chart.result[0].indicators.quote[0].close;

      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split("T")[0],
        price: prices[index],
      }));
    } catch (err) {
      console.error(`Error fetching stock data for ${ticker}:`, err);
      toast.warning(`Using default data for stock ${ticker}.`); // Notify user
      return DEFAULT_HISTORICAL_DATA;
    }
  };

  const fetchCryptoHistoricalData = async (
    ticker: string
  ): Promise<HistoricalData[]> => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${ticker}USDT&interval=1d&limit=365`;

    try {
      const data = await fetchWithRetry(url);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No historical data available for crypto ${ticker}.`);
      }

      return data.map((entry: any) => ({
        date: new Date(entry[0]).toISOString().split("T")[0],
        price: parseFloat(entry[4]), // Closing price
      }));
    } catch (err) {
      console.error(`Error fetching crypto data for ${ticker}:`, err);
      toast.warning(`Using default data for crypto ${ticker}.`); // Notify user
      return DEFAULT_HISTORICAL_DATA;
    }
  };

  const fetchHistoricalData = async (
    ticker: string,
    isCrypto: boolean
  ): Promise<HistoricalData[]> => {
    return isCrypto
      ? fetchCryptoHistoricalData(ticker)
      : fetchStockHistoricalData(ticker);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (stocks.length === 0) {
        setHistoricalPortfolio([]);
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      setError(null);

      try {
        const results = await Promise.all(
          stocks.map(async (stock) => {
            const fetchKey = `stock-${stock.ticker}`;
            const cache = localStorage.getItem(fetchKey);

            if (cache) {
              const cachedData = JSON.parse(cache);
              if (Array.isArray(cachedData) && cachedData.length > 0) {
                return { ...stock, historical: cachedData };
              }
            }

            const historical = await fetchHistoricalData(
              stock.ticker,
              stock.isCrypto
            );
            localStorage.setItem(fetchKey, JSON.stringify(historical));
            return { ...stock, historical };
          })
        );

        const mergedHistorical: { [date: string]: number } = {};
        results.forEach(({ quantity, historical }) => {
          historical.forEach(({ date, price }: HistoricalData) => {
            if (!mergedHistorical[date]) {
              mergedHistorical[date] = 0;
            }
            mergedHistorical[date] += price * quantity;
          });
        });

        const formattedData = Object.keys(mergedHistorical)
          .map((date) => ({
            date,
            value: mergedHistorical[date],
          }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setHistoricalPortfolio(formattedData);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch portfolio data. Please try again later."
        );
        setHistoricalPortfolio(generateDefaultData(stocks)); // Use dynamic default data
        toast.warning("Using default data for portfolio."); // Notify user
      } finally {
        setIsFetching(false);
      }
    };

    fetchAllData();
  }, [stocks]);

  return { historicalPortfolio, isFetching, error };
};
