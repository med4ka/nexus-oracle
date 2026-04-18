"use client";
import { useState, useEffect, useCallback } from "react";
import { Activity, Clock, Loader2, Maximize2, Minimize2, Target } from "lucide-react";

interface AdvancedChartProps {
  labels: string[];
  values: number[];
  coin: string;
}

type ChartNode = {
  price: number;
  label: string; 
};

export default function AdvancedChart({ labels, values, coin }: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState("LIVE");
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedNodes, setSimulatedNodes] = useState<ChartNode[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeframesList = ["LIVE", "15M", "1H", "1D", "1W", "1M", "6M", "1Y", "5Y", "ALL"];

  const generateSimulatedData = (tf: string, basePrice: number) => {
    const nodes: ChartNode[] = [];
    const now = new Date();
    let pointsCount = 30; 
    let stepMs = 0; 
    let volatility = 0.05;

    switch(tf) {
      case "15M": pointsCount = 15; stepMs = 60 * 1000; volatility = 0.002; break; 
      case "1H": pointsCount = 60; stepMs = 60 * 1000; volatility = 0.005; break; 
      case "1D": pointsCount = 24; stepMs = 60 * 60 * 1000; volatility = 0.02; break; 
      case "1W": pointsCount = 7; stepMs = 24 * 60 * 60 * 1000; volatility = 0.08; break; 
      case "1M": pointsCount = 30; stepMs = 24 * 60 * 60 * 1000; volatility = 0.15; break; 
      case "6M": pointsCount = 24; stepMs = 7 * 24 * 60 * 60 * 1000; volatility = 0.25; break; 
      case "1Y": pointsCount = 12; stepMs = 30 * 24 * 60 * 60 * 1000; volatility = 0.4; break; 
      case "5Y": pointsCount = 60; stepMs = 30 * 24 * 60 * 60 * 1000; volatility = 0.8; break; 
      case "ALL": pointsCount = 120; stepMs = 30 * 24 * 60 * 60 * 1000; volatility = 1.2; break; 
    }

    let currentPrice = basePrice;
    const startTime = now.getTime() - (pointsCount * stepMs);

    for (let i = 0; i < pointsCount; i++) {
      currentPrice = currentPrice * (1 + (Math.random() - 0.5) * volatility);
      const nodeDate = new Date(startTime + (i * stepMs));
      let labelText = "";
      if (["15M", "1H", "1D"].includes(tf)) {
        labelText = nodeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (tf === "1D") labelText = nodeDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " • " + labelText;
      } else if (["1W", "1M"].includes(tf)) {
        labelText = nodeDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      } else {
        labelText = nodeDate.toLocaleDateString([], { month: 'short', year: 'numeric' });
      }
      nodes.push({ price: Math.max(currentPrice, 0.01), label: labelText }); 
    }
    return nodes;
  };

  const changeTimeframe = (tf: string) => {
    setTimeframe(tf);
    setHoverIdx(null); 
    if (tf !== "LIVE") {
      setIsLoading(true);
      setTimeout(() => {
        const basePrice = values[values.length - 1] || 60000;
        setSimulatedNodes(generateSimulatedData(tf, basePrice));
        setIsLoading(false);
      }, 800);
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && isFullscreen) setIsFullscreen(false);
  }, [isFullscreen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isFullscreen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isFullscreen]);

  const activeNodes: ChartNode[] = timeframe === "LIVE" 
    ? values.map((v, i) => ({ price: v, label: labels[i] || "Live Data" }))
    : simulatedNodes;
  
  const displayNodes = activeNodes.length > 0 ? activeNodes : [{ price: 0, label: "" }, { price: 0, label: "" }];
  const prices = displayNodes.map(n => n.price);

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const padding = range * 0.15; 
  const adjustedMin = min - padding;
  const adjustedMax = max + padding;
  const adjustedRange = adjustedMax - adjustedMin;

  const width = 1000;
  const height = 400; 
  
  const points = displayNodes.map((node, i) => {
    const x = (i / (displayNodes.length - 1 || 1)) * width;
    const y = height - ((node.price - adjustedMin) / adjustedRange) * height;
    return `${x},${y}`;
  }).join(" L ");

  const pathD = `M 0,${height} L 0,${height - ((displayNodes[0]?.price - adjustedMin) / adjustedRange) * height} L ${points} L ${width},${height} Z`;

  const hoveredNode = hoverIdx !== null && hoverIdx < displayNodes.length ? displayNodes[hoverIdx] : null;

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${
        isFullscreen ? "fixed inset-0 z-[9900] bg-[#050505] p-8 md:p-12 flex flex-col" : "w-full flex flex-col h-full relative"
      }`}
    >
      {isFullscreen && <style>{`nav { display: none !important; }`}</style>}

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 z-20 shrink-0 gap-4">
        <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 p-2 rounded-xl shadow-lg w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {timeframesList.map((tf) => (
            <button
              key={tf}
              onClick={() => changeTimeframe(tf)}
              className={`px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-black tracking-wider transition-all shrink-0 ${
                timeframe === tf ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]" : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {tf === "LIVE" && <Activity className="w-4 h-4 inline-block mr-1 mb-0.5" />}
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4" /> <span className="hidden md:inline">Data Sync</span>
          </div>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-3 border rounded-xl font-bold transition-all duration-300 group flex items-center gap-2 ${
              isFullscreen ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'bg-white/5 text-slate-300 border-white/10 hover:text-cyan-400 hover:border-cyan-500/50'
            }`}
          >
            {isFullscreen ? (<><Minimize2 className="w-5 h-5 group-hover:scale-90 transition-transform" /> <span className="hidden md:inline text-xs">EXIT</span></>) : (<><Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> <span className="hidden md:inline text-xs">FOCUS</span></>)}
          </button>
        </div>
      </div>

      <div 
        className="flex-1 w-full relative group cursor-crosshair border border-white/5 rounded-3xl overflow-hidden bg-[#030303] shadow-inner"
        onMouseLeave={() => setHoverIdx(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, x / rect.width));
          const idx = Math.floor(percentage * (displayNodes.length - 1));
          setHoverIdx(idx);
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500/50 bg-black/60 backdrop-blur-md z-50">
             <Loader2 className="w-12 h-12 animate-spin mb-4" />
             <p className="text-xs font-bold tracking-widest uppercase animate-pulse">Compiling Historical Nodes...</p>
          </div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1="0" y1={(height / 5) * i} x2={width} y2={(height / 5) * i} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5 5" />
            ))}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {displayNodes.length > 1 && <path d={pathD} fill="url(#chartGradient)" className="transition-all duration-300 ease-linear" />}
            {displayNodes.length > 1 && <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" className="transition-all duration-300 ease-linear drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}

            {hoveredNode && !isLoading && displayNodes.length > 1 && hoverIdx !== null && (
              <g className="transition-all duration-75">
                <line x1={(hoverIdx / (displayNodes.length - 1)) * width} y1="0" x2={(hoverIdx / (displayNodes.length - 1)) * width} y2={height} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1={height - ((hoveredNode.price - adjustedMin) / adjustedRange) * height} x2={width} y2={height - ((hoveredNode.price - adjustedMin) / adjustedRange) * height} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx={(hoverIdx / (displayNodes.length - 1)) * width} cy={height - ((hoveredNode.price - adjustedMin) / adjustedRange) * height} r="6" fill="#000" stroke="#22d3ee" strokeWidth="3" className="shadow-[0_0_15px_#22d3ee]" />
              </g>
            )}
          </svg>
        )}

        {hoveredNode && !isLoading && displayNodes.length > 1 && hoverIdx !== null && (
          <div 
            className="absolute bg-[#050505]/95 border border-cyan-500/50 p-3 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.25)] backdrop-blur-md pointer-events-none z-30 transition-all duration-75 flex flex-col items-center min-w-[120px]"
            style={{ left: `max(20px, min(calc(${(hoverIdx / (displayNodes.length - 1)) * 100}% - 60px), calc(100% - 140px)))`, top: '20px' }}
          >
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> {hoveredNode.label}</div>
            <div className="text-lg font-black text-cyan-400 tracking-wider">${hoveredNode.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</div>
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="mt-8 flex items-center justify-between animate-in fade-in duration-500 border-t border-white/10 pt-6">
           <div className="flex items-center gap-3">
             <Activity className="w-6 h-6 text-cyan-500" />
             <div>
               <h3 className="text-white font-black tracking-widest text-lg">NEXUS PRO TERMINAL</h3>
               <p className="text-slate-500 text-[10px] uppercase tracking-widest">Encrypted Data Stream</p>
             </div>
           </div>
           <div className="bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-xl">
             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mr-3">Tracking Asset</span>
             <span className="text-xl font-black text-white">{coin}</span>
           </div>
        </div>
      )}
    </div>
  );
}