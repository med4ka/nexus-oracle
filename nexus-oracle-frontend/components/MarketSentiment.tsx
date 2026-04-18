"use client";
import { useState, useEffect } from "react";
import { Gauge, Fuel, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function MarketSentiment() {
  const [score, setScore] = useState(0);
  const [gasFee, setGasFee] = useState(15);

  useEffect(() => {
    const targetScore = 72; 
    
    setTimeout(() => setScore(targetScore), 500);

    const gasInterval = setInterval(() => {
      setGasFee(prev => Math.max(5, prev + Math.floor((Math.random() - 0.5) * 5)));
    }, 4000);

    return () => clearInterval(gasInterval);
  }, []);

  let status = "Neutral";
  let statusColor = "text-slate-400";
  if (score <= 25) { status = "Extreme Fear"; statusColor = "text-red-500"; }
  else if (score <= 45) { status = "Fear"; statusColor = "text-orange-400"; }
  else if (score <= 55) { status = "Neutral"; statusColor = "text-yellow-400"; }
  else if (score <= 75) { status = "Greed"; statusColor = "text-green-400"; }
  else { status = "Extreme Greed"; statusColor = "text-emerald-400"; }

  const needleRotation = (score / 100) * 180 - 90;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
      
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20"><Gauge className="w-4 h-4 text-indigo-400" /></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Fear & Greed Index</h2>
          </div>
          <span className="text-[10px] text-slate-500 font-bold bg-white/5 px-2 py-1 rounded-md">LIVE</span>
        </div>

        <div className="flex flex-col items-center justify-center mt-2 relative">
          
          <svg viewBox="0 0 200 120" className="w-48 h-28 overflow-visible">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />   
                <stop offset="25%" stopColor="#f97316" />  
                <stop offset="50%" stopColor="#eab308" /> 
                <stop offset="75%" stopColor="#4ade80" /> 
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            
            
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" strokeLinecap="round" />
            
            
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="15" strokeLinecap="round" />

            
            <g style={{ transform: `rotate(${needleRotation}deg)`, transformOrigin: '100px 100px', transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)' }}>
              <polygon points="95,100 105,100 100,30" fill="white" className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
              <circle cx="100" cy="100" r="8" fill="white" />
              <circle cx="100" cy="100" r="3" fill="#0a0a0a" />
            </g>
          </svg>

          
          <div className="absolute bottom-0 flex flex-col items-center">
            <span className={`text-3xl font-black ${statusColor} drop-shadow-[0_0_10px_currentColor] transition-colors duration-500`}>{score}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{status}</span>
          </div>
        </div>
      </div>

      
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20"><Fuel className="w-4 h-4 text-cyan-400" /></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Network Gas Status</h2>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-500 font-bold bg-cyan-500/10 px-2 py-1 rounded-md animate-pulse">
            <Zap className="w-3 h-3" /> ETH Mainnet
          </div>
        </div>

        <div className="flex items-end justify-between flex-1 pb-2">
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Base Fee (Gwei)</p>
            <h3 className="text-5xl font-black text-white">{gasFee}<span className="text-xl text-slate-500 font-medium">.4</span></h3>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${gasFee > 30 ? 'bg-red-500/10 text-red-400 border-red-500/30' : gasFee > 15 ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'}`}>
            {gasFee > 30 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {gasFee > 30 ? "HIGH" : gasFee > 15 ? "NORMAL" : "LOW"}
          </div>
        </div>

        
        <div className="w-full bg-slate-900 rounded-full h-1.5 mt-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${gasFee > 30 ? 'bg-red-500' : gasFee > 15 ? 'bg-orange-500' : 'bg-green-500'}`} 
            style={{ width: `${Math.min((gasFee / 50) * 100, 100)}%` }} 
          />
        </div>
      </div>
      
    </div>
  );
}