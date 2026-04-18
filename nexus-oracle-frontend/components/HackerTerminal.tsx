"use client";
import { useState, useEffect, useRef } from "react";
import { TerminalSquare, X } from "lucide-react";

export default function HackerTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "sys", text: "NEXUS SECURE TERMINAL v9.1.4" },
    { type: "sys", text: "Type 'help' for active command list." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playGlitchSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) playGlitchSound(); 
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, history]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#22c55e"; 
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(drawMatrix, 33);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: "user", text: `root@nexus:~# ${input}` }];
    
    setTimeout(() => {
      let response = "";
      switch (cmd) {
        case "help": response = "Commands: ping, hack_btc, clear, root_access"; break;
        case "ping": response = "Pinging nexus-oracle.eth... 12ms. Connection Stable."; break;
        case "clear": setHistory([]); setInput(""); return;
        case "hack_btc": response = "Bypassing SHA-256... Error: Insufficient Hashrate. (Nice try though)"; break;
        case "root_access": response = "ACCESS DENIED. Your IP has been logged and reported to the Cyber Police."; break;
        default: response = `Command not found: ${cmd}`; break;
      }
      setHistory([...newHistory, { type: "res", text: response }]);
    }, 400);

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-[99999] bg-black transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden font-mono ${isOpen ? "h-screen opacity-100" : "h-0 opacity-0"}`}>
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60 pointer-events-none w-full h-full" />

      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>

      <div className="flex flex-col h-full p-6 md:p-12 relative z-10">
        <div className="flex items-center justify-between border-b-2 border-green-500/30 pb-4 mb-4">
           <div className="flex items-center gap-3 text-green-500 font-bold text-lg tracking-widest"><TerminalSquare className="w-6 h-6" /> ROOT CONSOLE</div>
           <button onClick={() => setIsOpen(false)} className="text-green-500/50 hover:text-green-400 p-2"><X className="w-8 h-8" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 text-base md:text-lg">
          {history.map((line, i) => (
            <div key={i} className={`${line.type === "user" ? "text-green-300 font-black mt-3" : line.type === "sys" ? "text-green-600 font-bold" : "text-green-500 font-medium"} drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]`}>
              {line.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleCommand} className="mt-6 flex items-center gap-3 text-green-400 text-lg md:text-xl border-t border-green-500/20 pt-4">
           <span className="font-black drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">root@nexus:~#</span>
           <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent outline-none text-green-300 font-black caret-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" spellCheck="false" />
        </form>
      </div>
    </div>
  );
}