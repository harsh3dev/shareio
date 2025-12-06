"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Copy } from "./Copy";
import { CheckCheck } from "./CheckCheck";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const command = "npx liteshare post ./file.pdf";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-48">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-4xl">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
              className="text-4xl font-bold tracking-tighter text-[var(--color-foreground)] sm:text-5xl xl:text-7xl/none"
            >
              {["Share", "files", "from", "your"].map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
                    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 1.2, ease: "easeOut" } },
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                variants={{
                  hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
                  visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 1.2, ease: "easeOut" } },
                }}
                className="inline-block"
              >
                <span className="text-[var(--color-primary)] font-mono italic">terminal</span>.
              </motion.span>
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
              }}
              className="mx-auto max-w-[600px] text-[var(--color-foreground)]/80 md:text-xl"
            >
              {["Fast.", "Secure.", "Peer-to-Peer.", "No", "registration", "required."].map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
                    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 1.2, ease: "easeOut" } },
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
              <div className="relative group cursor-copy" onClick={handleCopy}>
                <div className="relative flex items-center justify-between bg-black/50 backdrop-blur-3xl px-3 py-2 font-sans text-sm text-[var(--color-foreground)]">
                  {/* Bottom Gradient Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-80" />

                  <div className="flex items-center gap-3 mr-4">
                    <span className="text-[var(--color-primary)] font-bold text-lg">&gt;</span>
                    <span className="whitespace-nowrap">
                      npx liteshare post <span className="italic">./file.pdf</span>
                    </span>
                  </div>
                  <button
                    className="p-1 rounded-md hover:bg-[var(--color-surface)] transition-colors text-[var(--color-foreground)]/60 hover:text-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    aria-label="Copy command"
                  >
                    {copied ? (
                      <CheckCheck width={20} height={20} className="text-[#00ff9d]" /> 
                    ) : (
                      <Copy width={20} height={20} />
                    )}
                  </button>
                </div>
              </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
