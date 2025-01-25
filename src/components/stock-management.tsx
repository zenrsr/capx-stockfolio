"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddEditStockModal } from "@/components/add-edit-stock-modal";
import { Card, CardContent, CardHeader } from "./ui/card";
import { toast } from "sonner";
import { useStocks } from "@/app/context/stocks-context";
import { KNOWN_CRYPTO_SYMBOLS } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

enum StockCategory {
  TECHNOLOGY = "TECHNOLOGY",
  HEALTHCARE = "HEALTHCARE",
  FINANCE = "FINANCE",
  RETAIL = "RETAIL",
  ENERGY = "ENERGY",
  ECOMMERCE = "ECOMMERCE",
}

export type Stock = {
  id?: number;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  profitLoss?: number;
  cat: StockCategory;
  isCrypto: boolean;
};

type NewStock = Omit<Stock, "id" | "profitLoss">;

export function StockManagement() {
  const { stocks, fetchStocks } = useStocks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    console.log("[StockManagement] Fetching stocks on initial mount...");

    const fetchData = async () => {
      await fetchStocks();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const isCrypto = (ticker: string): boolean => {
    return KNOWN_CRYPTO_SYMBOLS.has(ticker.toUpperCase().trim());
  };

  const handleAddStock = async (newStock: NewStock) => {
    try {
      const isCryptoStock = isCrypto(newStock.ticker);
      const payload = {
        name: newStock.name.trim(),
        ticker: newStock.ticker.toUpperCase().trim(),
        quantity: Number(newStock.quantity),
        buyPrice: Number(newStock.buyPrice),
        currentPrice: Number(newStock.currentPrice),
        cat: newStock.cat,
        profitLoss: 0,
        isCrypto: isCryptoStock,
      };

      if (
        !payload.name ||
        payload.buyPrice <= 0 ||
        payload.currentPrice <= 0 ||
        payload.quantity < 1
      ) {
        throw new Error("Invalid stock data");
      }

      const response = await fetch("/api/stocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add stock");
      }

      toast.success("Stock added successfully");
      await fetchStocks();
    } catch (error) {
      toast.error(
        `Error adding stock: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      console.error(error);
    }
  };

  const handleEditStock = async (editedStock: Stock) => {
    try {
      if (!editedStock.id) {
        throw new Error("Stock ID is required for editing");
      }

      const response = await fetch(`/api/stocks/${editedStock.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedStock,
          ticker: editedStock.ticker.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update stock");
      }

      toast.success("Stock updated successfully");
      fetchStocks();
    } catch (error) {
      toast.error(
        `Error updating stock: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      console.error(error);
    }
  };

  const handleDeleteStock = async (id: number) => {
    try {
      const response = await fetch(`/api/stocks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete stock");
      }

      toast.success("Stock deleted successfully");
      fetchStocks();
    } catch (error) {
      toast.error(
        `Error deleting stock: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      console.error(error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(stocks.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="my-4 w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Stock Management</h2>
          <Button
            onClick={() => {
              setEditingStock(null);
              setIsModalOpen(true);
            }}
          >
            Add Stock
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div>Loading stocks...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Buy Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.ticker}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>${stock.buyPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      ${stock.currentPrice?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell className="flex justify-evenly">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => {
                          setEditingStock(stock);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => stock.id && handleDeleteStock(stock.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination className="mt-4">
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || stocks.length === 0} // Disable if on the first page or no stocks
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || stocks.length === 0} // Disable if on the last page or no stocks
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
        <AddEditStockModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStock(null);
          }}
          onSubmit={(stock) => {
            if (editingStock) {
              handleEditStock({
                ...stock,
                id: editingStock.id,
                profitLoss: editingStock.profitLoss,
                cat: stock.cat,
                isCrypto: isCrypto(stock.ticker),
              });
            } else {
              handleAddStock({
                ...stock,
                isCrypto: isCrypto(stock.ticker),
              });
            }
            setIsModalOpen(false);
          }}
          stock={
            editingStock
              ? {
                  name: editingStock.name,
                  ticker: editingStock.ticker,
                  quantity: editingStock.quantity,
                  buyPrice: editingStock.buyPrice,
                  currentPrice: editingStock.currentPrice,
                  cat: editingStock.cat || StockCategory.TECHNOLOGY,
                  isCrypto: editingStock.isCrypto,
                }
              : null
          }
          categories={Object.values(StockCategory)}
        />
      </CardContent>
    </Card>
  );
}
