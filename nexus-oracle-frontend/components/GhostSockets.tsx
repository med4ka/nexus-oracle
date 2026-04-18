"use client";
import { useState, useEffect } from "react";
import { RadioTower, Zap, Activity } from "lucide-react";

type GhostAlert = {
  id: number;
  type: "WHALE" | "AI" | "SYSTEM";
  message: string;
  amount?: string;
  asset?: string;
};

export default function GhostSockets() {
  const [alerts, setAlerts] = useState<GhostAlert[]>([]);

  const playSonarBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(850, audioCtx.currentTime); 
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); // Fade out
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch(e) {
    }
  };

  useEffect(() => {
    const eventTemplates = [
      { type: "WHALE", message: "Massive transfer detected to Binance", amount: "$45,000,000", asset: "USDT" },
      { type: "WHALE", message: "Unknown wallet accumulating", amount: "1,200", asset: "BTC" },
      { type: "AI", message: "Unusual selling pressure detected on", asset: "SOL" },
      { type: "AI", message: "Bullish divergence forming on", asset: "ETH" },
      { type: "SYSTEM", message: "Nexus Router re-routing liquidity pools for optimal slippage" }
    ];

    const triggerEvent = () => {
      if (Math.random() > 0.7) {
        const randomEvent = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const newAlert: GhostAlert = {
          id: Date.now(),
          type: randomEvent.type as "WHALE" | "AI" | "SYSTEM",
          message: randomEvent.message,
          amount: randomEvent.amount,
          asset: randomEvent.asset
        };

        setAlerts(prev => [...prev, newAlert]);
        playSonarBeep(); 

        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, 5500);
      }
    };

    const interval = setInterval(triggerEvent, 4000);
    return () => clearInterval(interval);
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[9000] flex flex-col gap-3 pointer-events-none w-[calc(100vw-2rem)] md:w-80">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className="animate-in slide-in-from-left-8 fade-in duration-500 bg-[#050505]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] w-full relative overflow-hidden"
        >
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.type === 'WHALE' ? 'bg-cyan-500' : alert.type === 'AI' ? 'bg-indigo-500' : 'bg-orange-500'}`}></div>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${alert.type === 'WHALE' ? 'bg-cyan-500/10 text-cyan-400' : alert.type === 'AI' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-500/10 text-orange-400'}`}>
              {alert.type === 'WHALE' ? <RadioTower className="w-4 h-4" /> : alert.type === 'AI' ? <Activity className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            </div>
            <div>
              <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${alert.type === 'WHALE' ? 'text-cyan-400' : alert.type === 'AI' ? 'text-indigo-400' : 'text-orange-400'}`}>
                {alert.type} INTERCEPT
              </h4>
              <p className="text-xs text-white leading-relaxed">
                {alert.message} {alert.asset && <span className="font-bold text-slate-300">{alert.asset}</span>}
              </p>
              {alert.amount && (
                <div className="mt-2 text-sm font-black text-white bg-white/5 inline-block px-2 py-1 rounded border border-white/10">
                  {alert.amount}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}