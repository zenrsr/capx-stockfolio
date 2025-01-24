"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieChartComponent from "./charts/pie-chart";
import LineChartComponent from "./charts/line-chart";
import { useStocks } from "@/app/context/stocks-context";
import { useHistoricalData } from "@/hooks/useHistoricalData";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockPrices } from "@/hooks/useStockPrices";

export function Dashboard() {
    const { stocks } = useStocks();
    const { historicalPortfolio, isFetching: isHistoricalFetching, error } = useHistoricalData(stocks);
    const { stockPrices, isLoading: isPriceLoading } = useStockPrices(stocks);

    const portfolioValue = stockPrices.reduce(
        (acc, stock) => acc + (stock.currentPrice || 0) * (stock.quantity || 0),
        0
    );

    const topPerformingAsset = stockPrices.length
        ? stockPrices.reduce((topAsset, currentAsset) =>
            (currentAsset.currentPrice * currentAsset.quantity) >
            (topAsset.currentPrice * topAsset.quantity) ? currentAsset : topAsset
        ).ticker
        : "N/A";

    const colors = [
        "var(--color-january)",
        "var(--color-february)",
        "var(--color-march)",
        "var(--color-april)",
        "var(--color-may)",
    ];

    const portfolioDistribution = stockPrices.map((stock, idx) => ({
        name: `${stock.ticker} (${stock.isCrypto ? 'Crypto' : 'Stock'})`,
        value: (stock.currentPrice || 0) * (stock.quantity || 0),
        fill: colors[idx % colors.length],
    }));

    const showLoading = isHistoricalFetching || isPriceLoading;

    if (showLoading && stocks.length > 0) {
        return (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-64 sm:col-span-full md:col-span-2" />
            </div>
        );
    }

    if (stocks.length === 0) {
        return (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card className="sm:col-span-full">
                    <CardHeader>
                        <CardTitle>Your Portfolio is Empty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Add stocks or cryptocurrencies to begin tracking your investments.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const priceErrors = stockPrices.filter(stock => stock.error).map(stock => stock.error);
    if (error || priceErrors.length > 0) {
        return (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card className="sm:col-span-full">
                    <CardHeader>
                        <CardTitle>Error Loading Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-red-500">
                            {error || priceErrors[0]}
                            {priceErrors.length > 1 && ` (+${priceErrors.length - 1} more errors)`}
                        </div>
                        <p className="text-muted-foreground mt-2">
                            Please check your internet connection or the ticker symbols and try again.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Portfolio Value
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {portfolioValue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Top Performing Asset
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{topPerformingAsset}</div>
                </CardContent>
            </Card>

            <Card className="md:col-span-1 h-fit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Portfolio Allocation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PieChartComponent
                        data={portfolioDistribution}
                        index="name"
                        category="value"
                        valueFormatter={(value: number) =>
                            value.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD"
                            })
                        }
                    />
                </CardContent>
            </Card>

            <Card className="sm:col-span-full md:col-span-3">
                <CardHeader>
                    <CardTitle>Historical Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <LineChartComponent
                        data={historicalPortfolio}
                        index="date"
                        categories={["value"]}
                        colors={["#3b82f6"]}
                        valueFormatter={(value: number) =>
                            value.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD"
                            })
                        }
                        className="h-auto w-full"
                    />
                </CardContent>
            </Card>
        </div>
    );
}