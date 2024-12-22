import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";
import { StockManagement } from "@/components/stock-management";
import { EnhancedAnalytics } from "@/components/enhanced-analytics";
import { StockInsights } from "@/components/stock-insights";
import { PortfolioDiversification } from "@/components/portfolio-diversification";
import { CustomizableAlerts } from "@/components/customizable-alerts";
import { GlobalExchangeMarket } from "@/components/global-exchange-market";

export default function Home() {
  return (
    <div className="min-h-screen bg-background w-screen overflow-x-hidden">
      <Header />
      <main className="w-full p-8">
        <Dashboard />
        <div className="grid lg:grid-flow-col sm:grid-flow-row justify-between">
          <div className="w-fit gap-4 grid grid-cols-1 lg:col-span-full">
            <StockManagement />
            <EnhancedAnalytics />
          </div>
          <StockInsights />
        </div>
        <PortfolioDiversification className="col-span-2" />
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-3">
          <CustomizableAlerts className="col-span-1" />
          <div className="sm:col-span-full md:col-span-2">
            <GlobalExchangeMarket />
          </div>
        </div>
      </main>
    </div>
  );
}
