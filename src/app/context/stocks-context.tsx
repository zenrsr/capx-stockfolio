import { createContext, useContext, useState, useEffect } from "react";
import {Stock} from "@/components/stock-management";

type StocksContextType = {
    stocks: Stock[];
    stockDiversification: { sector: string; percentage: number }[];
    fetchStocks: () => Promise<void>;
    addStock: (newStock: Omit<Stock, "id" | "profitLoss">) => Promise<void>;
    editStock: (updatedStock: Stock) => Promise<void>;
    deleteStock: (id: number) => Promise<void>;
};

const StocksContext = createContext<StocksContextType | undefined>(undefined);

export const StocksProvider = ({ children }: { children: React.ReactNode }) => {
    const [stocks, setStocks] = useState<Stock[]>([]);

    // Calculate stock diversification dynamically
    const stockDiversification = Object.values(
        stocks.reduce((acc, stock) => {
            const sector = stock.cat;
            const profitLoss =
                stock.profitLoss ??
                stock.currentPrice * stock.quantity - stock.buyPrice * stock.quantity;

            // If the sector already exists, accumulate profitLoss
            if (acc[sector]) {
                acc[sector].percentage += profitLoss;
            } else {
                // Create a new entry for the sector
                acc[sector] = { sector, percentage: profitLoss };
            }
            return acc;
        }, {} as Record<string, { sector: string; percentage: number }>)
    );

    // Fetch stocks from backend (mocked in this code)
    const fetchStocks = async () => {
        // Mock API call here
        const response = await fetch("/api/stocks");
        const data: Stock[] = await response.json();
        setStocks(data);
    };

    // Add a stock
    const addStock = async (newStock: Omit<Stock, "id" | "profitLoss">) => {
        const response = await fetch("/api/stocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newStock),
        });
        if (response.ok) {
            await fetchStocks(); // Refresh stocks list
        }
    };

    // Edit a stock
    const editStock = async (updatedStock: Stock) => {
        if (!updatedStock.id) return;

        const response = await fetch(`/api/stocks/${updatedStock.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedStock),
        });
        if (response.ok) {
            await fetchStocks(); // Refresh stocks list
        }
    };

    // Delete a stock
    const deleteStock = async (id: number) => {
        const response = await fetch(`/api/stocks/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            await fetchStocks(); // Refresh stocks list
        }
    };

    return (
        <StocksContext.Provider
            value={{ stocks, stockDiversification, fetchStocks, addStock, editStock, deleteStock }}
        >
            {children}
        </StocksContext.Provider>
    );
};

// Custom hook to consume StocksContext
export const useStocks = () => {
    const context = useContext(StocksContext);
    if (!context) {
        throw new Error("useStocks must be used within a StocksProvider");
    }
    return context;
};