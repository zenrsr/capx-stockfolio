"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "./ui/card";

const formSchema = z.object({
  stockTicker: z.string().min(1, "Stock ticker is required"),
  upperThreshold: z
    .number()
    .min(0, "Upper threshold must be a positive number"),
  lowerThreshold: z
    .number()
    .min(0, "Lower threshold must be a positive number"),
});

export function CustomizableAlerts({
  className: classname,
}: {
  className: string;
}) {
  const [alerts, setAlerts] = useState<z.infer<typeof formSchema>[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stockTicker: "",
      upperThreshold: 0,
      lowerThreshold: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAlerts([...alerts, values]);
    toast({
      title: "Alert Created",
      description: `Alert set for ${values.stockTicker}`,
    });
    form.reset();
  }

  return (
    <Card className={`mt-6 w-full h-full ${classname}`}>
      <CardHeader className="text-2xl font-bold mb-4">
        Customizable Alerts
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="stockTicker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="AAPL" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the stock ticker symbol
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="upperThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upper Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="150"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the upper price threshold for alerts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lowerThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lower Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the lower price threshold for alerts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Alert</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
