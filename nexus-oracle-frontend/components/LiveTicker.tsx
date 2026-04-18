"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

const globalCoins = [
  { pair: "BTC/USD", price: "72,450.20", change: "+2.4%", up: true },
  { pair: "ETH/USD", price: "3,920.15", change: "+1.2%", up: true },
  { pair: "SOL/USD", price: "145.80", change: "-0.5%", up: false },
  { pair: "BNB/USD", price: "590.40", change: "+0.8%", up: true },
  { pair: "XRP/USD", price: "1.22", change: "-1.1%", up: false },
  { pair: "ADA/USD", price: "0.65", change: "+0.1%", up: true },
  { pair: "AVAX/USD", price: "45.30", change: "-2.3%", up: false },
  { pair: "DOGE/USD", price: "0.15", change: "+5.6%", up: true },
];

export default function LiveTicker() {
  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-black border-b border-white/10 z-[100] flex items-center overflow-hidden">
      
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: ticker 25s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
      `}</style>

      <div className="flex whitespace-nowrap animate-ticker cursor-crosshair">
        {[...globalCoins, ...globalCoins].map((coin, idx) => (
          <div key={idx} className="flex items-center gap-3 px-8 border-r border-white/5">
            <span className="text-slate-400 text-[10px] font-bold tracking-widest">{coin.pair}</span>
            <span className="text-white text-xs font-black">${coin.price}</span>
            <span className={`text-[10px] font-bold flex items-center gap-1 ${coin.up ? 'text-green-500' : 'text-red-500'}`}>
              {coin.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {coin.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}