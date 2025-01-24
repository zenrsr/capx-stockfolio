"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart2,
  Lock,
  MoonIcon,
  SunIcon,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedChart from "@/components/landing/AnimatedChart";
import HeroStats from "@/components/landing/HeroStats";
import FeatureCard from "@/components/landing/FeatureCard";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme, theme } = useTheme();
  return (
        <div className="min-h-screen bg-background">
          <nav className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl font-bold">StockFolio</h1>
              </motion.div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="flex items-center justify-center rounded-full"
                >
                  <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <Link href="/dashboard">
                  <Button>Launch App</Button>
                </Link>
              </div>
            </div>
          </nav>

          <main>
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-24">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <h1 className="text-5xl font-bold leading-tight">
                    Smart Portfolio Management for Modern Investors
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Track, analyze, and optimize your investments with real-time
                    data and powerful analytics.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/dashboard">
                      <Button size="lg" className="gap-2">
                        Get Started <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <HeroStats />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative"
                >
                  <AnimatedChart />
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold mb-4">
                  Everything you need to succeed
                </h2>
                <p className="text-xl text-muted-foreground">
                  Powerful features to help you make informed investment decisions
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={BarChart2}
                  title="Real-time Analytics"
                  description="Track your portfolio performance with live updates and detailed analytics"
                />
                <FeatureCard
                  icon={Lock}
                  title="Secure & Private"
                  description="Your financial data is encrypted and protected with enterprise-grade security"
                />
                <FeatureCard
                  icon={Wallet}
                  title="Smart Portfolio"
                  description="Get personalized insights and recommendations for your investments"
                />
              </div>
            </section>
          </main>
        </div>
  );
}
