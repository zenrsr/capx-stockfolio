"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type UseCurrentPriceProps = {
    symbol: string;
    defaultPrice: number;
    isCrypto?: boolean;
};

export const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<any> => {
    try {
        const response = await axios.get(url);
        console.log("response:", response);
        return response.data;
    } catch (err) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2);
        }
        throw err;
    }
};

const useCurrentPrice = ({ symbol, defaultPrice, isCrypto = false }: UseCurrentPriceProps) => {
    const [price, setPrice] = useState<number>(defaultPrice);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentPrice = async (): Promise<number> => {
        if (!symbol) return defaultPrice;

        // Use a proxy for Yahoo Finance to bypass CORS
        const proxyUrl = process.env.REACT_APP_PROXY_URL || "https://api.allorigins.win/raw?url=";
        const url = isCrypto
            ? `https://api.diadata.org/v1/quotation/${symbol}`
            : `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;

        console.log("url:", url);

        try {
            const data = await fetchWithRetry(url);

            if (isCrypto) {
                const cryptoPrice = data.Price;
                if (typeof cryptoPrice !== "number") throw new Error("Invalid DIA API response");
                return cryptoPrice;
            } else {
                const stockPrice = data.chart?.result?.[0]?.meta?.regularMarketPrice;
                console.log("stockPrice:", stockPrice);
                if (typeof stockPrice !== "number") throw new Error("Invalid Yahoo Finance response");
                return stockPrice;
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.status === 429
                    ? "API rate limit exceeded"
                    : `API error: ${err.message}`;
                throw new Error(message);
            }
            throw new Error("Failed to fetch price data");
        }
    };

    useEffect(() => {
        if (!symbol) return;

        const cacheKey = `currentPrice-${symbol}`;
        const cachedData = localStorage.getItem(cacheKey);

        const fetchData = async () => {
            try {
                setIsFetching(true);
                const currentPrice = await fetchCurrentPrice();
                setPrice(currentPrice);
                localStorage.setItem(cacheKey, JSON.stringify({
                    price: currentPrice,
                    timestamp: Date.now()
                }));
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                setPrice(defaultPrice);
            } finally {
                setIsFetching(false);
            }
        };

        if (cachedData) {
            const { price, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < 300000) { // 5-minute cache
                setPrice(price);
                return;
            }
        }

        fetchData();
    }, [symbol, defaultPrice, isCrypto]);

    return { price, isFetching, error };
};

export default useCurrentPrice;