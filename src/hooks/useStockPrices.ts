"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Stock } from "@/components/stock-management";

type StockWithPrice = Stock & {
    isFetching: boolean;
    error: string | null;
};

export const useStockPrices = (stocks: Stock[]) => {
    const [stockPrices, setStockPrices] = useState<StockWithPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            if (stocks.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const updatedStocks = await Promise.all(
                    stocks.map(async (stock) => {
                        try {
                            const proxyUrl = process.env.REACT_APP_PROXY_URL || "https://api.allorigins.win/raw?url=";
                            const url = stock.isCrypto
                                ? `https://api.diadata.org/v1/quotation/${stock.ticker}`
                                : `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/${stock.ticker}?interval=1d`;

                            const response = await axios.get(url);

                            const price = stock.isCrypto
                                ? response.data.Price
                                : response.data.chart?.result?.[0]?.meta?.regularMarketPrice;

                            return {
                                ...stock,
                                currentPrice: price || stock.currentPrice,
                                isFetching: false,
                                error: null,
                            };
                        } catch (err) {
                            console.error(`Failed to fetch price for ${stock.ticker}:`, err);
                            return {
                                ...stock,
                                currentPrice: stock.currentPrice,
                                isFetching: false,
                                error: "Failed to fetch price",
                            };
                        }
                    })
                );
                setStockPrices(updatedStocks);
            } catch (error) {
                console.error("Error fetching prices:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrices();
    }, [stocks]);

    return { stockPrices, isLoading };
};