"use client";
import { useEffect, useState } from "react";
import { Box, Activity, Cpu } from "lucide-react";

interface TransactionNode {
  id: string;
  hash: string;
  amount: string;
  asset: string;
  speed: number;
  top: number;
  color: string;
}

export default function MempoolVisualizer() {
  const [transactions, setTransactions] = useState<TransactionNode[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
    
    const assets = ["ETH", "USDT", "USDC", "PEPE", "LINK", "SOL", "WBTC"];
    const colors = ["text-cyan-400", "text-emerald-400", "text-purple-400", "text-orange-400", "text-pink-400"];

    const generateTx = () => {
      const newTx: TransactionNode = {
        id: Math.random().toString(36).substring(2, 9),
        hash: "0x" + Math.random().toString(16).substring(2, 8) + "..." + Math.random().toString(16).substring(2, 6),
        amount: (Math.random() * 50).toFixed(2),
        asset: assets[Math.floor(Math.random() * assets.length)],
        speed: 4 + Math.random() * 8, 
        top: 10 + Math.random() * 75, 
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setTransactions((prev) => [...prev, newTx]);

      
      setTimeout(() => {
        setTransactions((prev) => prev.filter((t) => t.id !== newTx.id));
      }, newTx.speed * 1000);
    };

    
    const interval = setInterval(generateTx, 600);
    return () => clearInterval(interval);
  }, []);

 
  if (!isMounted) return <div className="w-full h-64 bg-[#030303] border border-white/5 rounded-[2rem] mb-8"></div>;

  return (
    <div className="w-full h-64 bg-[#030303] border border-white/5 rounded-[2rem] relative overflow-hidden flex items-center justify-center group shadow-inner mb-8">
      
      
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      ></div>

      
      <style>{`
        @keyframes flowRight {
          0% { transform: translateX(-10vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(110vw); opacity: 0; }
        }
      `}</style>

     
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className={`absolute flex items-center gap-2 bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-0 ${tx.color}`}
          style={{
            top: `${tx.top}%`,
            left: '0',
            animation: `flowRight ${tx.speed}s linear forwards`
          }}
        >
           <Box className="w-3 h-3 opacity-50" />
           <span className="font-mono text-[10px] opacity-70 hidden md:inline">{tx.hash}</span>
           <span className="text-xs font-black">{tx.amount} {tx.asset}</span>
        </div>
      ))}

      
      <div className="relative z-10 bg-[#050505]/80 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl flex flex-col items-center shadow-[0_0_50px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/60 transition-all duration-500">
         <div className="relative flex items-center justify-center mb-3">
            <div className="absolute w-12 h-12 bg-cyan-500/20 rounded-full animate-ping"></div>
            <Cpu className="w-8 h-8 text-cyan-400 relative z-10" />
         </div>
         <h3 className="font-black text-white tracking-widest uppercase text-sm">Nexus Core Validator</h3>
         <div className="flex items-center gap-2 mt-2">
            <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
            <p className="text-[10px] text-cyan-500/80 tracking-widest uppercase font-bold">Scanning Mempool</p>
         </div>
      </div>

    </div>
  );
}