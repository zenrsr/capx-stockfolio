"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCurrentPrice from "@/hooks/useCurrentPrice";
import { KNOWN_CRYPTO_SYMBOLS } from "@/lib/utils";

export enum StockCategory {
  TECHNOLOGY = "TECHNOLOGY",
  HEALTHCARE = "HEALTHCARE",
  FINANCE = "FINANCE",
  RETAIL = "RETAIL",
  ENERGY = "ENERGY",
  ECOMMERCE = "ECOMMERCE",
}

const formSchema = z.object({
  name: z.string().min(1, "Stock name is required").trim(),
  ticker: z.string().min(1, "Ticker symbol is required").trim(),
  quantity: z.number().min(0.01, "Quantity must be at least 0.01"),
  buyPrice: z.number().min(0.01, "Buy price must be greater than 0"),
  currentPrice: z.number().min(0.01, "Current price must be greater than 0"),
  cat: z.nativeEnum(StockCategory, {
    required_error: "Please select a category",
  }),
  isCrypto: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type AddEditStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  stock?: FormValues | null;
  categories: StockCategory[];
};

export function AddEditStockModal({
  isOpen,
  onClose,
  onSubmit,
  stock,
  categories,
}: AddEditStockModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: stock || {
      name: "",
      ticker: "",
      quantity: 0,
      buyPrice: 0,
      currentPrice: 0,
      cat: StockCategory.TECHNOLOGY,
      isCrypto: false,
    },
  });

  // Reset form values when the stock prop changes
  useEffect(() => {
    if (stock) {
      form.reset(stock);
    } else {
      form.reset({
        name: "",
        ticker: "",
        quantity: 0,
        buyPrice: 0,
        currentPrice: 0,
        cat: StockCategory.TECHNOLOGY,
        isCrypto: false,
      });
    }
  }, [stock, form]);

  const ticker = form.watch("ticker");

  // Determine if the ticker is a crypto symbol
  const isCrypto = KNOWN_CRYPTO_SYMBOLS.has(ticker.toUpperCase());

  // Update the isCrypto field in the form state
  useEffect(() => {
    form.setValue("isCrypto", isCrypto);
  }, [isCrypto, form]);

  const { price, isFetching, error } = useCurrentPrice({
    symbol: ticker,
    defaultPrice: stock?.currentPrice || 0,
    isCrypto: isCrypto,
  });

  // Update the currentPrice field in the form state
  useEffect(() => {
    if (price > 0) {
      form.setValue("currentPrice", price);
    }
  }, [price, form]);

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    onSubmit(values);
    form.reset();
  };

  const isEditMode = !!stock;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="w-full max-w-screen">
        <DrawerHeader>
          <DrawerTitle>{isEditMode ? "Edit Stock" : "Add Stock"}</DrawerTitle>
          <DrawerDescription>
            {isEditMode
              ? "Update the details of the stock below."
              : "Fill in the details of the stock below. All fields are required."}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 p-4"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apple Inc."
                      {...field}
                      disabled={isEditMode}
                      className={isEditMode ? "bg-gray-100/20" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ticker Field */}
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="AAPL"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      disabled={isEditMode}
                      className={isEditMode ? "bg-gray-100/20" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity Field */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buy Price Field */}
            <FormField
              control={form.control}
              name="buyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buy Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="150.00 ( in dollars)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Price Field */}
            <FormField
              control={form.control}
              name="currentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="155.00 ( in dollars)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isEditMode}
                      className={isEditMode ? "bg-gray-100/20" : ""}
                    />
                  </FormControl>
                  {isFetching && (
                    <p className="text-sm text-gray-500">
                      Fetching current price...
                    </p>
                  )}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="cat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden isCrypto field */}
            <FormField
              control={form.control}
              name="isCrypto"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      type="hidden"
                      {...field}
                      value={String(field.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit">{isEditMode ? "Update" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
