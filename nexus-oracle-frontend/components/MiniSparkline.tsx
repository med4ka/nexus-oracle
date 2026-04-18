"use client";
import { useState, useEffect } from "react";

interface MiniSparklineProps {
  isUp: boolean;
}

export default function MiniSparkline({ isUp }: MiniSparklineProps) {
  const [points, setPoints] = useState("");

  useEffect(() => {
    let current = 50;
    const data = [];
    
    for (let i = 0; i < 20; i++) {
      const bias = isUp ? 1.5 : -1.5;
      const volatility = (Math.random() - 0.5) * 6; 
      current = current + bias + volatility;
      data.push(current);
    }
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const generatedPoints = data.map((val, i) => {
      const x = (i / 19) * 100;
      const y = 30 - ((val - min) / range) * 30;
      return `${x},${y}`;
    }).join(" L ");

    setPoints(generatedPoints);
  }, [isUp]);

  const strokeColor = isUp ? "#10b981" : "#ef4444"; 
  const gradientId = isUp ? "sparkline-up" : "sparkline-down";

  return (
    <div className="w-full h-12 relative overflow-hidden">
      
      
      <style>{`
        .animate-draw { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawLine 1.5s ease-out forwards; }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
      `}</style>

      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkline-up" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sparkline-down" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        
        {points && (
          <>
            {/* Background Gradient Area */}
            <path d={`M 0,30 L ${points} L 100,30 Z`} fill={`url(#${gradientId})`} className="opacity-50" />
            
            
            <polyline
              points={points}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="animate-draw drop-shadow-md"
            />
          </>
        )}
      </svg>
    </div>
  );
}