"use client";
import { useState, useRef, MouseEvent } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import MiniSparkline from "./MiniSparkline";

interface DegenTiltCardProps {
  coin: {
    symbol: string;
    name: string;
    price: number;
    change: string;
    isUp: boolean;
    color: string;
    bg: string;
    border: string;
  };
}

export default function DegenTiltCard({ coin }: DegenTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Posisi X mouse di dalam kotak
    const y = e.clientY - rect.top;  // Posisi Y mouse di dalam kotak
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.1s ease-out" }}
      className={`group relative bg-[#0a0a0a] border ${coin.border} rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg cursor-crosshair overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"></div>

      <div className="relative z-10 flex items-center justify-between mb-2 md:mb-3">
        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs ${coin.bg} ${coin.color}`}>{coin.symbol[0]}</div>
        <span className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{coin.symbol}</span>
      </div>
      <div className="relative z-10 space-y-1">
        <p className="text-[8px] md:text-[10px] text-slate-400">{coin.name}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-sm md:text-lg font-black text-white group-hover:text-cyan-400 transition-colors">${coin.price < 0.01 ? coin.price.toFixed(7) : coin.price.toFixed(2)}</h4>
        </div>
        <p className={`text-[8px] md:text-[10px] font-bold flex items-center gap-1 ${coin.isUp ? 'text-green-500' : 'text-red-500'}`}>{coin.isUp ? <TrendingUp className="w-2 h-2 md:w-3 md:h-3" /> : <TrendingDown className="w-2 h-2 md:w-3 md:h-3" />} {coin.change}%</p>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <MiniSparkline isUp={coin.isUp} />
      </div>
    </div>
  );
}