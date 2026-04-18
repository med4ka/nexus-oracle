"use client";
import { useState, useEffect, useRef } from "react";
import { Search, LayoutDashboard, Radar, Globe, Wallet, Zap, Trash2, MessageSquare, ChevronRight, Terminal } from "lucide-react";

interface CommandPaletteProps {
  setActiveMenu: (menu: string) => void;
  triggerSpike: () => void;
  purgeSystem: () => void;
  toggleChat: () => void;
}

export default function CommandPalette({ setActiveMenu, triggerSpike, purgeSystem, toggleChat }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault(); 
        setIsOpen((prev) => !prev);
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchQuery(""); 
    }
  }, [isOpen]);

  
  const commands = [
    { id: "dash", label: "Go to Dashboard", icon: LayoutDashboard, action: () => setActiveMenu("dash") },
    { id: "radar", label: "Open Whale Radar", icon: Radar, action: () => setActiveMenu("radar") },
    { id: "news", label: "Read Global Intel Feed", icon: Globe, action: () => setActiveMenu("news") },
    { id: "wallet", label: "Access Portfolio / Wallet", icon: Wallet, action: () => setActiveMenu("wallet") },
    { id: "chat", label: "Summon Oracle A.I. Assistant", icon: MessageSquare, action: toggleChat, color: "text-indigo-400" },
    { id: "spike", label: "Override: Trigger System Spike", icon: Zap, action: triggerSpike, color: "text-red-400" },
    { id: "purge", label: "Override: Purge System Data", icon: Trash2, action: purgeSystem, color: "text-orange-400" },
  ];

  
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const executeCommand = (action: () => void) => {
    action();
    setIsOpen(false); 
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] bg-[#050505]/80 backdrop-blur-md transition-all duration-300">
       
       
       <div className="absolute inset-0 cursor-crosshair" onClick={() => setIsOpen(false)}></div>
       
       
       <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          
          <div className="flex items-center px-6 py-5 border-b border-white/10 bg-black/50">
             <Search className="w-5 h-5 text-cyan-500 mr-4" />
             <input 
               ref={inputRef}
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Type a command or search..."
               className="flex-1 bg-transparent text-white outline-none text-lg placeholder-slate-600 font-mono"
             />
             <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-white/10 px-2 py-1 rounded bg-white/5">
               ESC to cancel
             </div>
          </div>

          
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
             {filteredCommands.length === 0 ? (
               <div className="p-8 flex flex-col items-center justify-center text-slate-500 text-sm font-mono">
                 <Terminal className="w-8 h-8 mb-3 opacity-50" />
                 No commands found for "{searchQuery}"
               </div>
             ) : (
               filteredCommands.map((cmd) => (
                 <button 
                   key={cmd.id}
                   onClick={() => executeCommand(cmd.action)}
                   className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-white/5 transition-colors group text-left"
                 >
                   <div className="flex items-center gap-4">
                     <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors shadow-inner ${cmd.color || 'text-slate-400 group-hover:text-cyan-400'}`}>
                       <cmd.icon className="w-5 h-5" />
                     </div>
                     <span className={`font-mono text-sm tracking-wide ${cmd.color || 'text-slate-300 group-hover:text-white'}`}>
                       {cmd.label}
                     </span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-500 transition-transform group-hover:translate-x-1" />
                 </button>
               ))
             )}
          </div>

          
          <div className="px-6 py-3 border-t border-white/5 bg-black/50 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
             <span>Nexus God Mode</span>
             <span><span className="text-cyan-500">System</span> Override Access</span>
          </div>
       </div>
    </div>
  );
}