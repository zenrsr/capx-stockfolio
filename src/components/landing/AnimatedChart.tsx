/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = Array.from({ length: 20 }, (_, i) => ({
  value: Math.random() * 100 + 50,
}));

export default function AnimatedChart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full h-[400px] bg-card rounded-lg p-6 shadow-xl"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <motion.g
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </motion.g>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
