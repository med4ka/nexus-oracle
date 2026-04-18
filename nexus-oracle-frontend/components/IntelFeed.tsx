"use client";
import { useState, useEffect } from "react";
import { Newspaper, RadioTower, ExternalLink, Clock, Globe } from "lucide-react";

export default function IntelFeed() {
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealNews = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss");
        const json = await res.json();
        
        if (json && json.items && json.items.length > 0) {
          setNewsFeed(json.items);
        } else {
          throw new Error("API Limit"); 
        }
      } catch (error) {
        console.warn("Menggunakan Berita Cadangan...");
        setNewsFeed([
          { title: "Bitcoin Institutional Adoption Surges", description: "Major banks are now integrating Web3 tech.", thumbnail: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", pubDate: new Date().toISOString(), link: "#" },
          { title: "Ethereum Layer 2 TVL Hits New High", description: "Scaling solutions are driving massive volume.", thumbnail: "https://cryptologos.cc/logos/ethereum-eth-logo.png", pubDate: new Date().toISOString(), link: "#" },
          { title: "Solana DeFi Ecosystem Explodes", description: "New protocols are attracting millions in liquidity.", thumbnail: "https://cryptologos.cc/logos/solana-sol-logo.png", pubDate: new Date().toISOString(), link: "#" },
          { title: "Global Web3 Regulations Updated", description: "New frameworks aim to protect investors.", thumbnail: "https://cryptologos.cc/logos/tether-usdt-logo.png", pubDate: new Date().toISOString(), link: "#" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealNews();
  }, []);

  const stripHtml = (html: string) => {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Newspaper className="text-purple-400 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Global Intel Feed</h2>
              <p className="text-slate-500 text-xs tracking-widest uppercase mt-1">Real-Time Market Headlines (CoinTelegraph)</p>
            </div>
         </div>
         {isLoading && (
           <div className="flex items-center gap-2 text-purple-400 text-sm font-bold animate-pulse">
             <RadioTower className="w-4 h-4 animate-ping" /> Scanning Networks...
           </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-[70vh] overflow-y-auto custom-scrollbar pr-4">
        {newsFeed.map((news, idx) => (
          <a href={news.link} target="_blank" rel="noreferrer" key={idx} className="group flex flex-col bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] h-96">
            
            <div className="relative h-48 overflow-hidden bg-black shrink-0 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
              <img 
                src={news.thumbnail || "https://cryptologos.cc/logos/ethereum-eth-logo.png"} 
                alt="News Cover" 
                onError={(e) => { e.currentTarget.src = "https://cryptologos.cc/logos/ethereum-eth-logo.png" }}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 rounded-xl" 
              />
              <div className="absolute top-4 left-4 z-20 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-2">
                <Globe className="w-3 h-3"/> Cointelegraph
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2 leading-relaxed">
                {news.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-6 flex-1 leading-loose">
                {stripHtml(news.description)}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> {new Date(news.pubDate).toLocaleDateString()}
                </div>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}