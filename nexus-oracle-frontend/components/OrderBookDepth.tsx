"use client";
import { useState, useEffect } from "react";
import { Layers, TrendingDown, TrendingUp } from "lucide-react";

export default function OrderBookDepth() {
  const [bids, setBids] = useState("");
  const [asks, setAsks] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const generateDepth = () => {
      let currentBidVol = 100;
      const bidData = [];
      for (let i = 0; i <= 25; i++) {
        bidData.push(currentBidVol);
        currentBidVol = currentBidVol - (Math.random() * 8) - (i * 0.5);
        if (currentBidVol < 0) currentBidVol = 0;
      }
      bidData[25] = 0; 

      let currentAskVol = 0;
      const askData = [0];
      for (let i = 1; i <= 25; i++) {
         currentAskVol = currentAskVol + (Math.random() * 8) + (i * 0.5);
          askData.push(currentAskVol);
      }

      const maxVol = Math.max(...bidData, ...askData);
      const range = maxVol || 1;

        const bidPoints = bidData.map((vol, index) => {
        const x = (index / 25) * 400; 
        const y = 200 - (vol / range) * 180; 
        return `${x},${y}`;
      }).join(" L ");
      setBids(`M 0,200 L ${bidPoints} L 400,200 Z`);

      // Draw Ask Polygon
      const askPoints = askData.map((vol, index) => {
        const x = 400 + (index / 25) * 400; 
        const y = 200 - (vol / range) * 180;
        return `${x},${y}`;
      }).join(" L ");
      setAsks(`M 400,200 L ${askPoints} L 800,200 Z`);
    };

    generateDepth();
    const interval = setInterval(generateDepth, 2000); 
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return <div className="w-full h-64 bg-[#0a0a0a] border border-white/5 rounded-[2rem] mb-6"></div>;

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 shadow-2xl mb-6 relative overflow-hidden group">
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Quantum Depth Chart</h2>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Live Order Book</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <span className="text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Bids (Buy Wall)</span>
          <span className="text-slate-600">|</span>
          <span className="text-red-400 flex items-center gap-1"><TrendingDown className="w-3 h-3"/> Asks (Sell Wall)</span>
        </div>
      </div>

      <div className="w-full h-40 relative z-10">
         <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
           <defs>
              <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
          </defs>

            <line x1="400" y1="0" x2="400" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
          
            <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 2" />


            {bids && (
              <path 
                d={bids} 
                fill="url(#bidGradient)" 
                stroke="#10b981" 
                strokeWidth="2" 
                strokeLinejoin="round"
              className="transition-all duration-[1500ms] ease-in-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />
          )}

           
           {asks && (
             <path 
               d={asks} 
               fill="url(#askGradient)" 
               stroke="#ef4444" 
               strokeWidth="2" 
               strokeLinejoin="round"
               className="transition-all duration-[1500ms] ease-in-out drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
             />
           )}
         </svg>
      </div>

      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-slate-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center gap-2">
         <span>Current Spread:</span>
         <span className="text-cyan-400 animate-pulse">0.01%</span>
      </div>
    </div>
  );
}