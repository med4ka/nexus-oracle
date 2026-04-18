"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Layers, Eye, EyeOff, Wallet } from "lucide-react";

const portfolioData = [
  { symbol: "BTC", name: "Bitcoin", allocation: 45, balance: 2.45, value: 178234.50, pnl: 4.2, col: "md:col-span-2", row: "md:row-span-2" },
  { symbol: "ETH", name: "Ethereum", allocation: 25, balance: 18.2, value: 68430.20, pnl: -1.5, col: "md:col-span-1", row: "md:row-span-2" },
  { symbol: "SOL", name: "Solana", allocation: 15, balance: 450.5, value: 64872.00, pnl: 12.4, col: "md:col-span-1", row: "md:row-span-1" },
  { symbol: "USDC", name: "USD Coin", allocation: 10, balance: 24500, value: 24500.00, pnl: 0.01, col: "md:col-span-1", row: "md:row-span-1" },
  { symbol: "PEPE", name: "Pepe", allocation: 5, balance: 1500000, value: 12450.00, pnl: -8.4, col: "md:col-span-2 md:col-start-3", row: "md:row-span-1" },
];

export default function AssetHeatmap() {
  const [showBalance, setShowBalance] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const total = portfolioData.reduce((acc, curr) => acc + curr.value, 0);
    setTotalValue(total);
  }, []);

  const getBlockColor = (pnl: number) => {
    if (pnl > 5) return "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30";
    if (pnl > 0) return "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20";
    if (pnl < -5) return "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30";
    if (pnl < 0) return "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20";
    return "bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20"; 
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Layers className="w-4 h-4" /> Global Allocation
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black text-white tracking-tighter">
              {showBalance ? `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "$******"}
            </h2>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 bg-white/5 hover:bg-cyan-500/20 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
          <Wallet className="w-5 h-5 text-cyan-500" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">24H Performance</p>
            <p className="text-sm font-black text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +$4,240.50 (1.2%)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-3 h-[400px]">
        {portfolioData.map((asset, idx) => (
          <div 
            key={idx} 
            className={`group relative overflow-hidden rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 cursor-crosshair shadow-lg ${getBlockColor(asset.pnl)} ${asset.col} ${asset.row}`}
          >
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-xl md:text-3xl font-black tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">{asset.symbol}</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">{asset.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-lg font-black">{showBalance ? asset.balance.toLocaleString() : "***"}</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{asset.allocation}% Hold</p>
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-end mt-4">
              <div className="text-sm md:text-xl font-black text-white drop-shadow-md">
                {showBalance ? `$${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "$***"}
              </div>
              <div className="flex items-center gap-1 text-xs md:text-sm font-black drop-shadow-md bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                {asset.pnl > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(asset.pnl)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}