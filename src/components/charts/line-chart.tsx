"use client";

import React from "react";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Type definitions
type LineChartData = {
    date: string;
    value: number;
};

type Props = {
    data: LineChartData[]; // Adjusted for portfolio value over time
    index: string;
    categories: string[];
    colors: string[];
    valueFormatter?: (value: number) => string;
    className?: string;
    margin?: { top: number; left: number; right: number; bottom: number };
    accessibilityLayer?: boolean;
};

const LineChartComponent = ({
                                data,
                                index,
                                categories,
                                colors,
                                valueFormatter,
                                className: classNameOverride,
                                margin = { top: 20, left: 12, right: 12, bottom: 12 },
                                accessibilityLayer = true,
                            }: Props) => {
    // Handle empty or invalid data
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Historical Data</CardTitle>
                    <CardDescription>Unable to render line chart</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Format date for X-axis
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Format value for Y-axis and tooltips
    const formatValue = (value: number) => {
        return valueFormatter ? valueFormatter(value) : value.toLocaleString();
    };

    return (
        <Card className={classNameOverride}>
            <CardHeader>
                <CardTitle>Portfolio Value Over Time</CardTitle>
                <CardDescription>
                    Visualizing historical portfolio trends
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={data}
                            margin={margin}
                            accessibilityLayer={accessibilityLayer}
                            role="img"
                            aria-label="Line chart showing portfolio value over time"
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey={index}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={formatDate}
                                aria-label="Date"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatValue}
                                aria-label="Portfolio Value"
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: "3 3" }}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            {/*<Legend*/}
                            {/*    wrapperStyle={{ paddingTop: "12px" }}*/}
                            {/*    formatter={(value) => (*/}
                            {/*        <span style={{ color: "var(--foreground)" }}>{value}</span>*/}
                            {/*    )}*/}
                            {/*/>*/}

                            {/* Render dynamic lines for each category */}
                            {categories.map((category, idx) => (
                                <Line
                                    key={category}
                                    dataKey={category}
                                    type="monotone"
                                    stroke={colors[idx % colors.length]}
                                    strokeWidth={2}
                                    dot={{
                                        fill: colors[idx % colors.length],
                                        r: 4,
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                    name="Portfolio Value"
                                    aria-label={`Line for ${category}`}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default LineChartComponent;

// Dynamic Chart Configuration
const chartConfig = {
    value: {
        label: "Portfolio Value",
        color: "hsl(var(--chart-1))", // Primary chart color
    },
} satisfies ChartConfig;