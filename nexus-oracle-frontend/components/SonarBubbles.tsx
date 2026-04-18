"use client";
import { useEffect, useState } from "react";

interface Bubble {
  id: string;
  symbol: string;
  name: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  isUp: boolean;
  delay: number;
  change: string;
}

export default function SonarBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  
  useEffect(() => {
    setIsMounted(true);
    
    
    const coins = [
      { sym: "BTC", name: "bitcoin", s: 150, up: true, change: "+5.4%" },
      { sym: "ETH", name: "ethereum", s: 120, up: false, change: "-1.2%" },
      { sym: "SOL", name: "solana", s: 105, up: true, change: "+8.7%" },
      { sym: "DOGE", name: "dogecoin", s: 85, up: true, change: "+12.1%" },
      { sym: "BNB", name: "bnb", s: 95, up: false, change: "-0.5%" },
      { sym: "SHIB", name: "shiba-inu", s: 80, up: true, change: "+4.2%" },
      { sym: "LINK", name: "chainlink", s: 90, up: false, change: "-2.1%" },
      { sym: "AVAX", name: "avalanche", s: 95, up: false, change: "-3.4%" },
      { sym: "ADA", name: "cardano", s: 85, up: true, change: "+1.1%" },
      { sym: "XRP", name: "xrp", s: 100, up: true, change: "+0.8%" },
    ];

    const generated = coins.map((c) => ({
      id: c.sym,
      symbol: c.sym,
      name: c.name,
      size: c.s,
      x: 10 + Math.floor(Math.random() * 70), 
      y: 10 + Math.floor(Math.random() * 60), 
      duration: 15 + Math.random() * 20, 
      delay: Math.random() * 5,
      isUp: c.up,
      change: c.change
    }));

    setBubbles(generated);
  }, []);

  if (!isMounted) return <div className="w-full h-[400px] bg-[#0a0a0a] rounded-[2rem] mb-8 border border-white/5"></div>;

  return (
    <div className="w-full h-[400px] bg-[#030303] border border-white/5 rounded-[2rem] relative overflow-hidden mb-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
      
      
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[500px] h-[500px] border border-cyan-500/30 rounded-full animate-[ping_5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-[300px] h-[300px] border border-cyan-500/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-[100px] h-[100px] border border-cyan-500/40 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
      </div>

      
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
         <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
           <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
           Nexus Sonar Map
         </h2>
         <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1 ml-6 uppercase">Live Market Cap Clusters</p>
      </div>

      
      <style>{`
        @keyframes floatBubble {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -40px) rotate(10deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>

      
      <div className="absolute inset-0 w-full h-full p-4">
        {bubbles.map((b) => (
          <div
            key={b.id}
            
            className={`absolute flex flex-col items-center justify-center rounded-full backdrop-blur-md cursor-crosshair transition-all duration-300 ease-out hover:scale-[1.35] hover:z-50 hover:[animation-play-state:paused] border ${
              b.isUp 
                ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-900/40 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3),inset_0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:border-emerald-300' 
                : 'bg-gradient-to-b from-red-500/20 to-red-900/40 border-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.3),inset_0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] hover:border-red-300'
            }`}
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.x}%`,
              top: `${b.y}%`,
              animation: `floatBubble ${b.duration}s ease-in-out infinite`,
              animationDelay: `${b.delay}s`,
            }}
          >
            
            <div className="flex-1 flex items-end justify-center pb-1">
              <img 
                src={`https://assets.coincap.io/assets/icons/${b.symbol.toLowerCase()}@2x.png`} 
                alt={b.symbol}
                className="w-1/2 h-1/2 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform duration-300 hover:scale-110"
                onError={(e) => { 
                  e.currentTarget.src = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${b.symbol.toLowerCase()}.png`; 
                }}
              />
            </div>
            
            
            <div className="flex-1 flex flex-col items-center justify-start pt-0.5">
              <span className="font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-[11px] tracking-widest leading-none mb-1">
                {b.symbol}
              </span>
              
              <span className={`text-[9px] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none px-2 py-0.5 rounded-sm bg-black/50 border border-white/5 ${b.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {b.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}