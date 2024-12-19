"use client";

import { useState } from "react";
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

type Stock = {
  id: string;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentValue: number;
};

export function StockManagement() {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: "1",
      name: "Apple Inc.",
      ticker: "AAPL",
      quantity: 10,
      buyPrice: 150,
      currentValue: 170,
    },
    {
      id: "2",
      name: "Microsoft Corporation",
      ticker: "MSFT",
      quantity: 5,
      buyPrice: 200,
      currentValue: 220,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  const handleAddStock = (newStock: Omit<Stock, "id" | "currentValue">) => {
    setStocks([
      ...stocks,
      {
        ...newStock,
        id: Date.now().toString(),
        currentValue: newStock.buyPrice,
      },
    ]);
  };

  const handleEditStock = (editedStock: Stock) => {
    setStocks(
      stocks.map((stock) => (stock.id === editedStock.id ? editedStock : stock))
    );
  };

  const handleDeleteStock = (id: string) => {
    setStocks(stocks.filter((stock) => stock.id !== id));
  };

  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Stock Management</h2>
          <Button onClick={() => setIsModalOpen(true)}>Add Stock</Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.ticker}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>${stock.buyPrice.toFixed(2)}</TableCell>
                <TableCell>${stock.currentValue.toFixed(2)}</TableCell>
                <TableCell>
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
                    onClick={() => handleDeleteStock(stock.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                currentValue: editingStock.currentValue,
              });
            } else {
              handleAddStock(stock);
            }
            setIsModalOpen(false);
            setEditingStock(null);
          }}
          stock={editingStock}
        />
      </CardContent>
    </Card>
  );
}
