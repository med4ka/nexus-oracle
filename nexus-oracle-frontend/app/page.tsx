"use client";
import { useState, useEffect, useRef } from "react";
import { 
  Flame, Zap, Terminal, TrendingUp, TrendingDown, Globe, LayoutDashboard, Radar, 
  Wallet, Fingerprint, CheckCircle2, Crosshair, RadioTower, ArrowRightLeft, 
  BrainCircuit, Trash2, ShieldAlert, MessageSquare, X, Send, Bot, Info, ArrowDownUp, Coins, Clock, Rocket
} from "lucide-react";

import DegenTiltCard from "../components/DegenTilCard";
import HackerTerminal from "../components/HackerTerminal";
import OrderBookDepth from "../components/OrderBookDepth";
import AssetHeatmap from "../components/AssetHeatmap";
import AdvancedChart from "../components/AdvancedChart";
import IntelFeed from "../components/IntelFeed"; 
import MagicCursor from "../components/MagicCursor";
import LiveTicker from "../components/LiveTicker";
import MarketSentiment from "../components/MarketSentiment";
import GhostSockets from "../components/GhostSockets";
import CommandPalette from "../components/CommandPalette";
import MiniSparkline from "../components/MiniSparkline"; 
import MempoolVisualizer from "../components/MempoolVisualizer"; 
import SonarBubbles from "../components/SonarBubbles";

const dict = {
  en: { subtitle: "Web3 Predictive Engine", sysLive: "System Live", emergency: "EMERGENCY", peak: "Peak Detected", market: "Market Status", stable: "Stable", volatile: "VOLATILE", chartTitle: "Live Market Chart", logs: "Live Logs", override: "System Override", spike: "Spike", purge: "Purge", navDash: "Dashboard", navRadar: "Whale Radar", navWallet: "Identity", navNews: "Intel Feed" },
  id: { subtitle: "Mesin Prediksi Web3", sysLive: "Sistem Aktif", emergency: "DARURAT", peak: "Puncak Terdeteksi", market: "Status Pasar", stable: "Stabil", volatile: "BERGOLAK", chartTitle: "Grafik Pasar Live", logs: "Log Sistem", override: "Protokol Paksa", spike: "Kejut", purge: "Hapus Data", navDash: "Dasbor", navRadar: "Radar Paus", navWallet: "Identitas", navNews: "Berita Pasar" },
  zh: { subtitle: "Web3 预测引擎", sysLive: "系统在线", emergency: "紧急情况", peak: "检测到峰值", market: "市场状态", stable: "稳定", volatile: "剧烈波动", chartTitle: "实时市场图表", logs: "系统日志", override: "系统覆盖", spike: "激增", purge: "清除", navDash: "仪表板", navRadar: "巨鲸雷达", navWallet: "身份验证", navNews: "市场新闻" }
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "id" | "zh">("en");
  const [activeMenu, setActiveMenu] = useState("dash"); 
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeCoin, setActiveCoin] = useState("BTC");
  
  const [currentVal, setCurrentVal] = useState(0);
  const [peakVal, setPeakVal] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [logs, setLogs] = useState(["[SYSTEM] Initializing Web3 Predictive Engine..."]);
  const [isAlert, setIsAlert] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState("Awaiting market data to generate predictive analysis...");
  const [whales, setWhales] = useState<any[]>([]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "Oracle AI is online. Ask me about entry points for BTC, ETH, or SOL." }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [swapAmount, setSwapAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  const [altcoins, setAltcoins] = useState([
    { symbol: "DOGE", name: "Dogecoin", price: 0.1542, change: "+5.2", isUp: true, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
    { symbol: "PEPE", name: "Pepe Coin", price: 0.0000078, change: "-2.1", isUp: false, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
    { symbol: "SHIB", name: "Shiba Inu", price: 0.0000281, change: "+1.8", isUp: true, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    { symbol: "WIF", name: "Dogwifhat", price: 2.85, change: "+12.4", isUp: true, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/30" },
    { symbol: "LINK", name: "Chainlink", price: 14.20, change: "+0.5", isUp: true, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30" },
    { symbol: "AVAX", name: "Avalanche", price: 35.60, change: "-1.2", isUp: false, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" }
  ]);

  const t = dict[lang];
  const cycleLanguage = () => { if (lang === "en") setLang("id"); else if (lang === "id") setLang("zh"); else setLang("en"); };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
      try {
        setIsConnecting(true);
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setLogs((prev) => [`> [AUTH] Wallet Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`, ...prev].slice(0, 50));
      } catch (err: any) { setLogs((prev) => [`> [ERROR] Wallet Connection Rejected!`, ...prev].slice(0, 50)); } 
      finally { setIsConnecting(false); }
    } else { alert("Install Extension MetaMask!"); }
  };
  const disconnectWallet = () => { setWalletAddress(""); setLogs((prev) => [`> [AUTH] Wallet Disconnected.`, ...prev].slice(0, 50)); };

  const handleSwap = () => {
    if(!swapAmount || isNaN(Number(swapAmount))) return alert("Masukkan angka yang bener Bos!");
    setIsSwapping(true);
    setTimeout(() => {
      setLogs((prev) => [`> [SWAP] Tx Confirmed: Swapped ${swapAmount} ETH to BTC via Nexus Router.`, ...prev].slice(0, 50));
      alert(`✅ SWAP SUCCESS! ${swapAmount} ETH has been converted.`);
      setSwapAmount(""); setIsSwapping(false);
    }, 2000);
  };

  const changeCoinTarget = async (coin: string) => {
    setActiveCoin(coin); setPeakVal(0);
    setLogs((prev) => [`> [TARGET] Retargeting radar to ${coin}...`, ...prev].slice(0, 50));
    setAiAnalysis(`Calibrating AI prediction models for ${coin} network...`);
    try { await fetch("http://localhost:9000/api/set-coin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coin: coin }) }); } catch (err) {}
  };

  
  useEffect(() => {
    const generateMockPrice = () => {
      const basePrices = { BTC: 64000, ETH: 3500, SOL: 145 };
      const base = basePrices[activeCoin as keyof typeof basePrices];
      const volatility = activeCoin === "BTC" ? 150 : activeCoin === "SOL" ? 2 : 10;
      const newPrice = base + (Math.random() - 0.5) * volatility;
      
      setCurrentVal(newPrice);
      setPeakVal(prev => newPrice > prev ? newPrice : prev);
      
      const now = new Date().toLocaleTimeString();
      setLabels(prev => [...prev.slice(-19), now]);
      setValues(prev => [...prev.slice(-19), newPrice]);
    };
    const interval = setInterval(generateMockPrice, 2500); return () => clearInterval(interval);
  }, [activeCoin]);

  useEffect(() => {
    if (activeMenu !== 'dash') return;
    const fluctuateAltcoins = () => {
      setAltcoins(prev => prev.map(coin => {
        const fluctuate = (Math.random() - 0.5) * (coin.price * 0.01);
        const newPrice = coin.price + fluctuate;
        const newChange = (parseFloat(coin.change) + (Math.random() - 0.5)).toFixed(1);
        return { ...coin, price: newPrice, change: newChange, isUp: parseFloat(newChange) > 0 };
      }));
    };
    const interval = setInterval(fluctuateAltcoins, 3000); return () => clearInterval(interval);
  }, [activeMenu]);

  useEffect(() => {
    if (activeMenu !== 'radar') return;
    const generateWhale = () => {
      const coins = ["BTC", "ETH", "SOL", "USDT"]; const coin = coins[Math.floor(Math.random() * coins.length)];
      const amounts = { BTC: 50 + Math.random()*400, ETH: 1000 + Math.random()*8000, SOL: 15000 + Math.random()*50000, USDT: 1000000 + Math.random()*50000000 };
      const amt = amounts[coin as keyof typeof amounts];
      const from = "0x" + Math.random().toString(16).substr(2, 6).toUpperCase();
      const targets = ["Binance", "Coinbase", "Unknown Wallet", "Kraken"]; const to = targets[Math.floor(Math.random() * targets.length)];
      setWhales(prev => [{ id: Math.random(), time: new Date().toLocaleTimeString(), coin, amt, from, to }, ...prev].slice(0, 6));
    };
    const interval = setInterval(generateWhale, 3500); return () => clearInterval(interval);
  }, [activeMenu]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let aiResponse = "Analyzing the data... Market sentiment is neutral. Please specify an asset like BTC, ETH, or SOL.";
      const msgLower = userMsg.toLowerCase();
      if (msgLower.includes("buy") || msgLower.includes("beli")) {
        if (msgLower.includes("btc")) aiResponse = `BTC is currently $${currentVal.toFixed(2)}. Good entry point for DCA. Set stop-loss at 5%.`;
        else if (msgLower.includes("sol")) aiResponse = `Solana is holding support. Prime buy zone if it stays above the 50-day average.`;
        else if (msgLower.includes("eth")) aiResponse = `Entering ETH at current levels is statistically a high-probability trade.`;
      } else if (msgLower.includes("sell") || msgLower.includes("jual")) {
        aiResponse = "Consider taking partial profits (20-30%) when technical indicators show overbought conditions.";
      }
      setChatHistory(prev => [...prev, { sender: "ai", text: aiResponse }]);
    }, 1000);
  };
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isChatOpen]);

  const triggerSpike = async () => { try { await fetch("http://localhost:9000/api/spike", { method: "POST" }); } catch (err) {} };
  const purgeSystem = async () => { if(!confirm("Are you sure?")) return; try { await fetch("http://localhost:9000/api/purge", { method: "DELETE" }); setPeakVal(0); } catch (err) {} };

  return (
    
    <main className={`min-h-screen pt-28 md:pt-24 pb-12 px-4 md:px-8 font-mono transition-colors duration-500 ${isAlert ? 'bg-red-950/20' : 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]'} text-white relative overflow-x-hidden`}>
      
      <LiveTicker />
      <MagicCursor />
      <GhostSockets />
      <HackerTerminal /> 
      <CommandPalette setActiveMenu={setActiveMenu} triggerSpike={triggerSpike} purgeSystem={purgeSystem} toggleChat={() => setIsChatOpen(prev => !prev)} />

      
      <nav className="fixed top-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-full opacity-90 hover:opacity-100 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] w-[95%] md:w-auto overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 bg-black/60 p-1.5 md:p-2 rounded-full border border-white/5 whitespace-nowrap">
          <button onClick={() => setActiveMenu('dash')} className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs font-bold transition-all ${activeMenu === 'dash' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><LayoutDashboard className="w-4 h-4 hidden md:block" /> {t.navDash}</button>
          <button onClick={() => setActiveMenu('radar')} className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs font-bold transition-all ${activeMenu === 'radar' ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Radar className="w-4 h-4 hidden md:block" /> {t.navRadar}</button>
          <button onClick={() => setActiveMenu('news')} className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs font-bold transition-all ${activeMenu === 'news' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Globe className="w-4 h-4 hidden md:block" /> {t.navNews}</button>
          <button onClick={() => setActiveMenu('wallet')} className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs font-bold transition-all ${activeMenu === 'wallet' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Wallet className="w-4 h-4 hidden md:block" /> {t.navWallet}</button>
        </div>
        <div className="hidden md:block w-px h-8 bg-white/10 mx-2 shrink-0"></div>
        <button onClick={cycleLanguage} className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/5 text-xs md:text-sm font-bold text-slate-300 transition-all shrink-0"><Globe className="w-4 h-4" /> {lang.toUpperCase()}</button>
      </nav>


      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 mb-6 border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">NEXUS <span className="text-cyan-400">ORACLE</span></h1>
            
            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md animate-pulse">
              Prototype v0.9
            </span>
          </div>
          <p className="text-slate-500 text-[9px] md:text-[10px] tracking-[0.4em] uppercase mt-1.5">{t.subtitle}</p>
        </div>
        <div className={`flex gap-3 items-center px-4 md:px-5 py-2 md:py-2.5 rounded-full border transition-colors ${isAlert ? 'bg-red-500/20 border-red-500/50' : 'bg-green-500/10 border-green-500/20'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isAlert ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
          <span className={`text-xs md:text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${isAlert ? 'text-red-400' : 'text-green-400'}`}><CheckCircle2 className="w-4 h-4" /> {isAlert ? t.emergency : t.sysLive}</span>
        </div>
      </header>

      
      {activeMenu === 'dash' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full overflow-hidden">
          
          
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest"><Crosshair className="w-4 h-4" /> Target Asset:</div>
            <div className="flex gap-2 bg-[#0a0a0a] border border-white/5 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto custom-scrollbar">
              <button onClick={() => changeCoinTarget("BTC")} className={`px-5 md:px-6 py-2 rounded-lg text-xs font-bold transition-all flex-1 md:flex-none ${activeCoin === "BTC" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:text-white"}`}>BTC</button>
              <button onClick={() => changeCoinTarget("ETH")} className={`px-5 md:px-6 py-2 rounded-lg text-xs font-bold transition-all flex-1 md:flex-none ${activeCoin === "ETH" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}>ETH</button>
              <button onClick={() => changeCoinTarget("SOL")} className={`px-5 md:px-6 py-2 rounded-lg text-xs font-bold transition-all flex-1 md:flex-none ${activeCoin === "SOL" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-slate-400 hover:text-white"}`}>SOL</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className={`border-l-4 border-y border-r rounded-2xl p-4 md:p-6 shadow-xl transition-all duration-300 ${isAlert ? 'bg-red-950/40 border-red-500 shadow-red-500/20' : 'bg-[#0a0a0a] border-l-cyan-500 border-white/5'}`}>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Live {activeCoin} Price (USD)</p>
              <h3 className={`text-2xl md:text-4xl font-black ${isAlert ? 'text-red-500' : 'text-white'}`}>${currentVal.toFixed(2)}</h3>
            </div>
            <div className="bg-[#0a0a0a] border-l-4 border-l-orange-500 border-y border-r border-white/5 rounded-2xl p-4 md:p-6 shadow-xl"><p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">{t.peak}</p><h3 className="text-2xl md:text-4xl font-black text-orange-400">${peakVal.toFixed(2)}</h3></div>
            <div className="bg-[#0a0a0a] border-l-4 border-l-purple-500 border-y border-r border-white/5 rounded-2xl p-4 md:p-6 shadow-xl sm:col-span-2 md:col-span-1"><p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">{t.market}</p><h3 className={`text-2xl md:text-4xl font-black flex items-center gap-2 ${isAlert ? 'text-red-500 animate-pulse' : 'text-purple-400'}`}>{isAlert ? <TrendingDown className="w-6 h-6 md:w-8 md:h-8" /> : <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />} {isAlert ? t.volatile : t.stable}</h3></div>
          </div>

          <div className={`mb-6 border rounded-2xl p-4 shadow-xl flex items-start md:items-center gap-4 transition-all duration-500 ${isAlert ? 'bg-red-950/20 border-red-500/50' : 'bg-indigo-950/20 border-indigo-500/30'}`}>
             <div className={`p-2 rounded-xl mt-1 md:mt-0 ${isAlert ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}><BrainCircuit className="w-5 h-5 md:w-6 md:h-6 animate-pulse" /></div>
             <div className="flex-1">
                <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2 ${isAlert ? 'text-red-400' : 'text-indigo-300'}`}><Info className="w-3 h-3" /> Sentinel Insight</p>
                <p className={`text-xs md:text-sm font-medium leading-relaxed ${isAlert ? 'text-red-100' : 'text-indigo-100'}`}>{aiAnalysis}</p>
             </div>
          </div>
          
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
         <div className={`lg:col-span-2 flex flex-col gap-6 w-full max-w-full overflow-hidden`}>
           <div className={`border rounded-2xl md:rounded-[2rem] p-4 md:p-6 relative overflow-hidden group transition-all duration-500 ${isAlert ? 'bg-red-950/10 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.15)]' : 'bg-[#0a0a0a] border-white/5 shadow-2xl'}`}>
             <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
               <div className="flex items-center gap-3">
                 <div className={`p-2 md:p-2.5 rounded-xl transition-colors ${isAlert ? 'bg-red-500/20' : 'bg-cyan-500/10'}`}><Flame className={`w-4 h-4 md:w-5 md:h-5 ${isAlert ? 'text-red-500 animate-bounce' : 'text-cyan-400'}`} /></div>
                 <h2 className="text-base md:text-lg font-bold text-white">{t.chartTitle} ({activeCoin})</h2>
               </div>
             </div>
             <div className="h-[200px] md:h-[280px] w-full mt-2 relative z-10">
               <AdvancedChart labels={labels} values={values} coin={activeCoin} />
             </div>
           </div>
           <OrderBookDepth />
         </div>
            
         <div className="flex flex-col gap-6 w-full">
             <div className={`border rounded-2xl md:rounded-[2rem] p-4 md:p-5 shadow-2xl h-[200px] flex flex-col transition-colors ${isAlert ? 'bg-red-950/20 border-red-500/30' : 'bg-[#0a0a0a] border-white/5'}`}>
               <div className="flex items-center gap-3 mb-3"><div className="p-1.5 bg-slate-800 rounded-lg"><Terminal className="text-slate-300 w-3 h-3" /></div><h2 className="text-xs font-bold text-white uppercase tracking-widest">{t.logs}</h2></div>
               <div className="flex-1 overflow-y-auto bg-black/80 rounded-xl p-3 border border-white/5 text-[8px] md:text-[9px] custom-scrollbar">
                 {logs.map((log, i) => (<div key={i} className={`mb-1 ${log.includes('ERROR') || log.includes('ALERT') ? 'text-red-400 font-bold' : log.includes('TARGET') || log.includes('SWAP') ? 'text-amber-400 font-bold' : 'text-cyan-500/80'}`}>{log}</div>))}
               </div>
             </div>
             <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-[2rem] p-4 md:p-5 shadow-2xl flex-1 flex flex-col justify-end">
                 <p className="text-[9px] md:text-[10px] text-slate-500 mb-2 flex items-center gap-2"><Crosshair className="w-3 h-3" /> {t.override}:</p>
                 <div className="grid grid-cols-2 gap-2">
                   <button onClick={triggerSpike} className="w-full py-2.5 md:py-3 bg-red-950/30 border border-red-500/50 hover:bg-red-600 hover:text-white text-red-500 rounded-xl font-black uppercase tracking-widest text-[8px] md:text-[9px] transition-all active:scale-95 flex items-center justify-center gap-2"><Zap className="w-3 h-3" /> {t.spike}</button>
                   <button onClick={purgeSystem} className="w-full py-2.5 md:py-3 bg-orange-950/30 border border-orange-500/50 hover:bg-orange-600 hover:text-white text-orange-500 rounded-xl font-black uppercase tracking-widest text-[8px] md:text-[9px] transition-all active:scale-95 flex items-center justify-center gap-2"><Trash2 className="w-3 h-3" /> {t.purge}</button>
                 </div>
             </div>
         </div>
       </div>

       <MarketSentiment />
       
       <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 mt-8">
          <SonarBubbles />
       </div>

      <div className="border-t border-white/10 pt-8 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
         <div className="flex items-center gap-3 mb-6">
           <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20"><Rocket className="w-4 h-4 md:w-5 md:h-5 text-purple-400" /></div>
           <div><h2 className="text-lg md:text-xl font-bold text-white tracking-tight">The Degen Vault</h2><p className="text-slate-500 text-[8px] md:text-[10px] tracking-widest uppercase">Live Altcoin & Memecoin Sentiment</p></div>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 perspective-1000">
           {altcoins.map((coin, idx) => (
             
             <DegenTiltCard key={idx} coin={coin} />
           ))}
         </div>
       </div>

       <div className="mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
         <MempoolVisualizer />
       </div>

      </div>

      ) : activeMenu === 'radar' ? (
        <div className="animate-in fade-in zoom-in-95 duration-500 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-[3rem] p-4 md:p-8 shadow-2xl flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px] relative overflow-hidden">
             <div className="absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] border border-red-500/20 rounded-full flex items-center justify-center"><div className="w-[180px] md:w-[300px] h-[180px] md:h-[300px] border border-red-500/20 rounded-full flex items-center justify-center"><div className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] border border-red-500/20 rounded-full flex items-center justify-center"><RadioTower className="w-6 h-6 md:w-8 md:h-8 text-red-500 animate-pulse" /></div></div><div className="absolute top-1/2 left-1/2 w-[125px] md:w-[200px] h-[125px] md:h-[200px] origin-top-left bg-gradient-to-br from-red-500/40 to-transparent animate-[spin_3s_linear_infinite] rounded-br-full" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}></div></div>
             <div className="relative z-10 mt-auto pt-40 md:pt-80 text-center"><h2 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">Deep Web Scan</h2><p className="text-red-500 text-[10px] md:text-xs mt-2 flex items-center justify-center gap-2 font-bold animate-pulse"><Zap className="w-3 h-3" /> Intercepting Massive Tx...</p></div>
          </div>
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-[3rem] p-4 md:p-8 shadow-2xl flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b border-white/5 gap-4">
              <div className="flex items-center gap-3"><div className="p-2 md:p-3 bg-red-500/10 rounded-xl"><Radar className="text-red-500 w-5 h-5 md:w-6 md:h-6" /></div><div><h2 className="text-lg md:text-xl font-bold text-white">Live Whale Feed</h2><p className="text-slate-500 text-[8px] md:text-[10px] uppercase tracking-widest mt-1">Global Blockchain Network</p></div></div>
              <div className="bg-red-950/30 border border-red-500/30 text-red-500 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-2 w-max"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {whales.length} Intercepted</div>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              {whales.map((w) => (
                <div key={w.id} className="animate-in slide-in-from-left-4 fade-in duration-300 bg-black/40 border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors gap-3">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-[10px] md:text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {w.time}</div>
                    <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-black ${w.coin === 'BTC' ? 'bg-amber-500/10 text-amber-500' : w.coin === 'ETH' ? 'bg-cyan-500/10 text-cyan-500' : w.coin === 'SOL' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'}`}>{w.coin}</div>
                    <div className="text-base md:text-lg font-black text-white">{w.amt.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400"><span className="bg-white/5 px-2 py-1 rounded border border-white/5 truncate max-w-[80px] md:max-w-none">{w.from}</span><ArrowRightLeft className="w-3 h-3 text-slate-600 shrink-0" /><span className="bg-white/5 px-2 py-1 rounded border border-white/5 text-white font-bold truncate max-w-[80px] md:max-w-none">{w.to}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      ) : activeMenu === 'news' ? (
        <IntelFeed />
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500 w-full">
           {!walletAddress ? (
             <div className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[600px]">
               <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[3rem] p-6 md:p-12 shadow-[0_0_80px_rgba(249,115,22,0.1)] w-full max-w-xl text-center relative overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-orange-500/10 blur-[60px] rounded-full"></div>
                 <div className="relative z-10 flex flex-col items-center">
                   <div className="w-16 h-16 md:w-24 md:h-24 bg-orange-500/10 border border-orange-500/30 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_30px_rgba(249,115,22,0.2)]"><Fingerprint className="w-8 h-8 md:w-12 md:h-12 text-orange-400" /></div>
                   <h2 className="text-2xl md:text-3xl font-black mb-3 md:mb-4">Web3 Identity</h2>
                   <p className="text-xs md:text-sm text-slate-400 mb-8 md:mb-10">Connect your Web3 wallet to access the full Oracle capabilities and decrypt your portfolio heatmap.</p>
                   <button onClick={connectWallet} disabled={isConnecting} className="w-full py-4 md:py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50">{isConnecting ? "Connecting..." : "Initiate Connection"}</button>
                 </div>
               </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
               <div className="lg:col-span-2 overflow-x-auto">
                 <AssetHeatmap />
               </div>
               <div className="flex flex-col gap-6 w-full">
                  <div className="bg-[#0a0a0a] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-xl">
                    <div className="w-full flex justify-between items-center bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2.5 md:px-5 md:py-3 rounded-lg md:rounded-xl font-bold mb-4 text-[10px] md:text-xs">
                      <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> Secured</span>
                      <span className="font-mono text-[10px] md:text-xs">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                    </div>
                    <button onClick={disconnectWallet} className="w-full py-2.5 md:py-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/50 rounded-lg md:rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95">Disconnect Identity</button>
                  </div>
                  <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-xl flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6"><Coins className="w-3 h-3 md:w-4 md:h-4" /> Nexus Router Swap</div>
                    <div className="space-y-2 mb-4 md:mb-6">
                      <div className="bg-[#111] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 flex justify-between items-center"><input type="number" value={swapAmount} onChange={(e)=>setSwapAmount(e.target.value)} placeholder="0.0" className="bg-transparent text-xl md:text-2xl font-black text-white outline-none w-1/2" /><span className="bg-cyan-500/20 text-cyan-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-base">ETH</span></div>
                      <div className="flex justify-center -my-3 relative z-10"><div className="bg-[#222] p-1.5 md:p-2 rounded-full border border-white/10 shadow-lg"><ArrowDownUp className="w-3 h-3 md:w-4 md:h-4 text-slate-400" /></div></div>
                      <div className="bg-[#111] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 flex justify-between items-center"><input type="text" value={swapAmount ? (Number(swapAmount) * 20.5).toFixed(4) : "0.0"} readOnly className="bg-transparent text-xl md:text-2xl font-black text-slate-500 outline-none w-1/2" /><span className="bg-amber-500/20 text-amber-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-base">BTC</span></div>
                    </div>
                    <button onClick={handleSwap} disabled={isSwapping} className="w-full mt-auto py-3 md:py-4 bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 border border-orange-500/50 rounded-xl font-black uppercase tracking-widest text-xs md:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">{isSwapping ? <RadioTower className="w-4 h-4 animate-spin" /> : "Confirm Swap"}</button>
                  </div>
               </div>
             </div>
           )}
        </div>
      )}

      
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-[calc(100vw-2rem)] sm:w-96 bg-[#050505]/90 backdrop-blur-xl border border-indigo-500/30 rounded-[2rem] shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 h-[400px] md:h-[500px]">
            <div className="bg-indigo-950/40 p-4 md:p-5 border-b border-indigo-500/20 flex items-center justify-between"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-500/20 rounded-full"><Bot className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" /></div><div><h3 className="font-bold text-white text-xs md:text-sm">Oracle Assistant</h3><p className="text-[8px] md:text-[10px] text-indigo-300 tracking-widest uppercase flex items-center gap-1"><span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> Analyzing Market</p></div></div><button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button></div>
            <div className="flex-1 p-4 md:p-5 overflow-y-auto flex flex-col gap-3 md:gap-4 custom-scrollbar">
               {chatHistory.map((chat, i) => (<div key={i} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] md:max-w-[80%] p-2.5 md:p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${chat.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-[#1a1a1a] border border-white/10 text-slate-300 rounded-bl-none'}`}>{chat.text}</div></div>))}
               <div ref={chatEndRef} />
            </div>
            <div className="p-3 md:p-4 border-t border-white/10 bg-black/50"><div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-full p-1 pl-3 md:pl-4"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="Ask AI..." className="flex-1 bg-transparent outline-none text-xs md:text-sm text-white placeholder-slate-500 w-full" /><button onClick={handleSendChat} className="p-2 md:p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors active:scale-95"><Send className="w-3 h-3 md:w-4 md:h-4" /></button></div></div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-3 md:p-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 hover:-translate-y-1 ${isChatOpen ? 'bg-indigo-600 text-white shadow-indigo-500/50' : 'bg-[#0a0a0a] border border-white/10 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50'}`}>{isChatOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />}</button>
      </div>

    </main>
  );
}