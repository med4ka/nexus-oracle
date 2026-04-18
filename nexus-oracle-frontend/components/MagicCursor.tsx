"use client";
import { useEffect, useState } from "react";

export default function MagicCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || target.closest('button') || target.closest('.cursor-crosshair') || target.tagName.toLowerCase() === 'input') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = 'auto'; };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[99999] mix-blend-screen transition-all duration-75 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        style={{ transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)` }}
      />
      
      <div 
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99998] transition-all duration-200 ease-out flex items-center justify-center ${
          isHovering 
            ? "w-16 h-16 bg-cyan-500/20 border-2 border-cyan-400/80 backdrop-blur-sm" 
            : "w-8 h-8 bg-transparent border border-cyan-500/50"
        }`}
        style={{ 
          transform: `translate3d(${position.x - (isHovering ? 32 : 16)}px, ${position.y - (isHovering ? 32 : 16)}px, 0)` 
        }}
      />
    </>
  );
}