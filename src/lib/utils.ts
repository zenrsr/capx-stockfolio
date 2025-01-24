import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const staticCryptoData: Record<
  string,
  { date: string; price: number }[]
> = {
  BTC: [
    { date: "2024-01", price: 42582.61 },
    { date: "2024-02", price: 61198.38 },
    { date: "2024-03", price: 71333.65 },
    { date: "2024-04", price: 60636.86 },
    { date: "2024-05", price: 67491.42 },
    { date: "2024-06", price: 64096.2 },
  ],
  ETH: [
    { date: "2024-01", price: 1800 },
    { date: "2024-02", price: 1900 },
    { date: "2024-03", price: 2000 },
    { date: "2024-04", price: 2100 },
    { date: "2024-05", price: 2200 },
    { date: "2024-06", price: 2300 },
  ],
  DOGE: [
    { date: "2024-01", price: 0.08 },
    { date: "2024-02", price: 0.09 },
    { date: "2024-03", price: 0.1 },
    { date: "2024-04", price: 0.11 },
    { date: "2024-05", price: 0.12 },
    { date: "2024-06", price: 0.13 },
  ],
  SOL: [
    { date: "2024-01", price: 150 },
    { date: "2024-02", price: 160 },
    { date: "2024-03", price: 170 },
    { date: "2024-04", price: 180 },
    { date: "2024-05", price: 190 },
    { date: "2024-06", price: 200 },
  ],
  PEPE: [
    { date: "2024-01", price: 0.00002 },
    { date: "2024-02", price: 0.000025 },
    { date: "2024-03", price: 0.00003 },
    { date: "2024-04", price: 0.000035 },
    { date: "2024-05", price: 0.00004 },
    { date: "2024-06", price: 0.000045 },
  ],
};


export const KNOWN_CRYPTO_SYMBOLS = new Set([
  "BTC",  // Bitcoin
  "ETH",  // Ethereum
  "BNB",  // Binance Coin
  "XRP",  // Ripple
  "SOL",  // Solana
  "ADA",  // Cardano
  "DOGE", // Dogecoin
  "DOT",  // Polkadot
  "AVAX", // Avalanche
  "LTC",  // Litecoin
  "LINK", // Chainlink
  "UNI",  // Uniswap
  "MATIC", // Polygon
  "ATOM",  // Cosmos
  "XLM",   // Stellar
  "TRX",   // TRON
  "SHIB",  // Shiba Inu
  "FIL",   // Filecoin
  "ICP",   // Internet Computer
  "ALGO",  // Algorand
  "VET",   // VeChain
  "APE",   // ApeCoin
  "FTM",   // Fantom
  "NEAR",  // NEAR Protocol
  "HBAR",  // Hedera Hashgraph
]);