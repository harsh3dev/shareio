"use client";

import { motion } from "motion/react";
import { File, ArrowUp, CheckCircle2 } from "lucide-react";

export const UploadVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-zinc-950/50 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 opacity-20">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="bg-zinc-800/50 rounded-sm" />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        initial={false}
        animate={isActive ? "active" : "inactive"}
      >
        {/* Upload Path Animation */}
        <div className="relative mb-2 h-24 w-12 flex justify-center">
            {/* Dashed Line */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-zinc-800 border-l border-r border-dashed border-zinc-700/50 left-1/2 -translate-x-1/2" />
            
            {/* Moving File */}
            <motion.div
                variants={{
                    inactive: { y: 20, opacity: 0.5, scale: 0.9 },
                    active: { 
                        y: [-20, -50, -50], // Move up, pause
                        opacity: [0, 1, 0],
                        scale: [0.8, 1, 0.8],
                        transition: { 
                            duration: 2, 
                            times: [0, 0.6, 1],
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }
                }}
                className="absolute bottom-0 p-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-20"
            >
                <File className="w-6 h-6 text-blue-400" />
            </motion.div>

            {/* Cloud/Server Icon at top */}
             <motion.div 
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 bg-zinc-900 p-2 rounded-full border border-zinc-700"
                variants={{
                    active: { borderColor: "var(--color-primary)", boxShadow: "0 0 15px -3px var(--color-primary)" },
                    inactive: { borderColor: "var(--color-surface)", boxShadow: "none" }
                }}
            >
                <ArrowUp className="w-4 h-4 text-[var(--color-primary)]" />
            </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
            <motion.div 
                className="h-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]"
                variants={{
                    inactive: { width: "0%" },
                    active: { 
                        width: ["0%", "100%", "100%"],
                        opacity: [1, 1, 0],
                        transition: { 
                            duration: 2,
                            times: [0, 0.8, 1],
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }
                }}
            />
        </div>
        
        {/* Success Indicator (Flashes) */}
         <motion.div
            className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-[1px] rounded-xl z-40"
            variants={{
                inactive: { opacity: 0 },
                active: { 
                    opacity: [0, 0, 1, 0], 
                    scale: [0.8, 0.8, 1.1, 1],
                    transition: {
                        duration: 2,
                        times: [0, 0.7, 0.85, 1],
                        repeat: Infinity 
                    }
                }
            }}
        >
             <div className="bg-zinc-900 border border-[var(--color-primary)] p-3 rounded-full shadow-[0_0_20px_-5px_var(--color-primary)]">
                <CheckCircle2 className="w-8 h-8 text-[var(--color-primary)]" />
             </div>
        </motion.div>

      </motion.div>
    </div>
  );
};
