"use client";

import { motion } from "motion/react";
import { HardDrive, ArrowDown, FileCheck, Wifi } from "lucide-react";

export const DownloadVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-zinc-950/50 rounded-xl overflow-hidden relative">
      {/* Background peer nodes effect */}
      <div className="absolute inset-0 opacity-20">
         {/* Simple constellation of dots */}
         {[...Array(6)].map((_, i) => (
             <div key={i} className="absolute w-1 h-1 bg-zinc-600 rounded-full" style={{ 
                 top: `${Math.random() * 80 + 10}%`, 
                 left: `${Math.random() * 80 + 10}%` 
             }} />
         ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full"
        initial={false}
        animate={isActive ? "active" : "inactive"}
      >
        <div className="flex items-center gap-8 mb-4">
             {/* Peer/Cloud Node */}
             <div className="relative">
                 <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                     <Wifi className="w-5 h-5 text-zinc-400" />
                 </div>
                 {/* Sending packet */}
                 <motion.div 
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-[var(--color-primary)] rounded-full -translate-x-1/2 -translate-y-1/2 z-20"
                    variants={{
                        active: { 
                            offsetDistance: "0%", 
                            x: [0, 40, 80], // Simple translation for demo instead of path
                            y: [0, -10, 0],
                            opacity: [1, 1, 0],
                            transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                        },
                        inactive: { opacity: 0 }
                    }}
                 />
             </div>

             {/* Arrow representing transfer */}
             <motion.div 
                className="text-zinc-600"
                variants={{
                    active: { color: "#2EA043", opacity: [0.5, 1, 0.5], transition: { duration: 1, repeat: Infinity } },
                    inactive: { color: "#52525b" }
                }}
             >
                <ArrowDown className="w-6 h-6 rotate-[-90deg]" />
             </motion.div>

             {/* Local Drive/Destination */}
             <div className="relative">
                 <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700 shadow-lg">
                     <HardDrive className="w-6 h-6 text-zinc-300" />
                 </div>
                 {/* Fill effect */}
                 <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)]/20 rounded-b-xl"
                    variants={{
                        active: { height: ["0%", "100%", "0%"], transition: { duration: 3, repeat: Infinity } },
                        inactive: { height: "0%" }
                    }}
                 />
             </div>
        </div>

        {/* File appearing */}
        <motion.div
            className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-md border border-[var(--color-primary)]/30 backdrop-blur-sm"
            variants={{
                active: { y: [10, 0], opacity: [0, 1], transition: { delay: 1, duration: 0.5 } },
                inactive: { opacity: 0, y: 10 }
            }}
        >
            <FileCheck className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-xs font-mono text-zinc-300">file.pdf received</span>
        </motion.div>

      </motion.div>
    </div>
  );
};
