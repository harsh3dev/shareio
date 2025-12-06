"use client";

import { motion } from "motion/react";
import { Lock, Smartphone, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export const CodeVisual = ({ isActive }: { isActive: boolean }) => {
  const [randomCode, setRandomCode] = useState("8081");
  
  // Effect to scramble numbers when active
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
        setRandomCode(Math.floor(1000 + Math.random() * 9000).toString());
    }, 100);

    // Stop scrambling and show real code at the end of cycle
    const timeout = setTimeout(() => {
        clearInterval(interval);
        setRandomCode("8081");
    }, 1500); // Scramble for 1.5s then show code

    const reset = setTimeout(() => {
        // Just keeping loop timing consistent with parent if needed, 
        // strictly this component relies on prop 'isActive' state usually, 
        // but since isActive is constant for 5 seconds in parent, we might want local looping.
        // For now, let's just let it be fully controlled by the parent cycle or local looped animation?
        // The parent switches card every 5s.
        // Let's make this animation loop every 2.5s locally if active?
    }, 2500);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, [isActive]);

  // Actually, better to use animation frames or framed motion for visual loop
  // Let's use Framer Motion for the UI parts and keep the text static-ish or simple
  
  return (
    <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-zinc-950/50 rounded-xl overflow-hidden relative">
      {/* Background Matrix/Grid effect */}
      <div className="absolute inset-0 flex flex-col opacity-10 font-mono text-[10px] leading-3 overflow-hidden pointer-events-none text-[var(--color-primary)]">
         {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} className="whitespace-nowrap">
                 {Array.from({ length: 150 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
             </div>
         ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-[200px]"
        initial={false}
        animate={isActive ? "active" : "inactive"}
      >
         
         {/* Security Shield/Lock interacting */}
         <div className="relative mb-4">
             <motion.div
                className="absolute inset-0 bg-[var(--color-primary)]/20 blur-xl rounded-full"
                variants={{
                    active: { opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1], transition: { duration: 2, repeat: Infinity } },
                    inactive: { opacity: 0 }
                }}
             />
             <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-700 relative z-10 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-zinc-400" />
                 <div className="h-4 w-[1px] bg-zinc-700" />
                 <Lock className="w-5 h-5 text-[var(--color-primary)]" />
             </div>
         </div>

         {/* Code Display */}
         <div className="bg-zinc-900/90 border border-[var(--color-primary)]/50 rounded-lg p-2 px-4 shadow-[0_0_15px_-5px_var(--color-primary)] flex gap-2">
            {["8", "0", "8", "1"].map((char, i) => (
                <motion.span 
                    key={i}
                    className="font-mono text-xl font-bold text-white relative"
                    variants={{
                        active: { 
                            scale: [1, 1.2, 1],
                            textShadow: ["0 0 0px var(--color-primary)", "0 0 10px var(--color-primary)", "0 0 0px var(--color-primary)"],
                            transition: { delay: 1.5 + (i * 0.1), duration: 0.5 } // Reveal after lock animation
                        },
                        inactive: { scale: 1, textShadow: "none" }
                    }}
                >
                    {/* Digit Scrambler mask */}
                    <motion.span
                        className="absolute inset-0 bg-zinc-900 text-zinc-500"
                        initial={{ opacity: 1 }}
                        animate={isActive ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ delay: 1.5 + (i * 0.1), duration: 0.1 }}
                    >
                        {Math.floor(Math.random() * 9)}
                    </motion.span>
                    {char}
                </motion.span>
            ))}
         </div>
         
         <motion.div 
             className="mt-2 text-xs text-[var(--color-primary)] font-mono"
             variants={{
                 active: { opacity: [0, 1, 0], transition: { delay: 2, duration: 2, repeat: Infinity } },
                 inactive: { opacity: 0 }
             }}
         >
             SECURE CHANNEL ESTABLISHED
         </motion.div>

      </motion.div>
    </div>
  );
};
