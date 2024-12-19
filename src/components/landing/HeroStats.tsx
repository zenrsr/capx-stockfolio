"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Active Users", value: "10K+" },
  { label: "Portfolios Tracked", value: "$2B+" },
  { label: "Success Rate", value: "94%" },
];

export default function HeroStats() {
  return (
    <div className="grid grid-cols-3 gap-8 py-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
