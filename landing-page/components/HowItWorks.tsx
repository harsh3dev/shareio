"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, Key, Download, Terminal, Command, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { FileStack } from "./FileStack";
import { UploadVisual } from "./how-it-works-visuals/UploadVisual";
import { CodeVisual } from "./how-it-works-visuals/CodeVisual";
import { DownloadVisual } from "./how-it-works-visuals/DownloadVisual";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);


  const steps = [
    {
      id: 0,
      Visual: UploadVisual,
      title: "Upload File",
      description: "Upload any file securely with a simple command.",
      command: (
        <>
          npx liteshare post <span className="italic">./file.pdf</span>
        </>
      ),
      terminalTitle: "Upload Process",
      terminalOutput: [
        "$ npx liteshare post presentation.pdf",
        "> Encrypting file...",
        "> Uploading to transparent peer network...",
        "> Success! Your code is: 8081",
        "> Share this code to download."
      ]
    },
    {
      id: 1,
      Visual: CodeVisual,
      title: "Get Code",
      description: "Receive a unique 4-digit code instantly.",
      command: "Code: 8081",
      terminalTitle: "Code Generation",
      terminalOutput: [
        "> File uploaded successfully.",
        "> Generating secure access code...",
        "> Code: 8081",
        "> Waiting for peer connection...",
        "> (Session active for 10 minutes)"
      ]
    },
    {
      id: 2,
      Visual: DownloadVisual,
      title: "Download",
      description: "Recipient runs the get command with the code.",
      command: "npx liteshare get 8081",
      terminalTitle: "Download Process",
      terminalOutput: [
        "$ npx liteshare get 8081",
        "> Connecting to peer...",
        "> Verifying secure channel...",
        "> Downloading presentation.pdf...",
        "> Download complete! (2.4MB)"
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeStep, steps.length]);


  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4"
          >
            Under the Hood: <span className="text-[var(--color-primary)]">How it Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl text-zinc-400"
          >
            You Share Faster
          </motion.p>
        </div>

        <div className="flex flex-col items-center">
          
          {/* Level 1: Central Hub - Rises First */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="relative mb-16"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 shadow-[0_0_30px_-5px_rgba(255,0,51,0.3)] flex items-center justify-center relative z-10 mx-auto glow-box">
              <div className="relative">
                 <div className="absolute inset-0 rounded-full animate-pulse" />
                 <FileStack width={80} height={80} stroke="var(--color-primary)" className="text-[var(--color-primary)] relative z-10" />
              </div>
            </div>

            <motion.div 
              initial={{ scaleY: 0, x: "-50%" }}
              whileInView={{ scaleY: 1, x: "-50%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
              style={{ originY: 0 }}
              className="absolute left-1/2 top-full h-8 w-[2px] bg-gradient-to-b from-[var(--color-primary)]/50 to-zinc-800 hidden md:block" 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12 relative">
               {/* Connector lines - positioned at middle of top box */}
               <div className="absolute -top-24 left-0 w-full h-24 hidden md:block pointer-events-none">
                  <div className="relative w-full h-full">
                     {/* Left section - horizontal to left card */}
                     <div className="absolute left-[16.66%] top-0 h-full" style={{ width: '33.34%' }}>
                        {/* Horizontal line */}
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
                          style={{ originX: 1 }}
                          className="absolute right-0 -top-12 h-[2px] w-full bg-[var(--color-primary)] rounded-l-full"
                        />

                        {/* Vertical drop */}
                        <motion.div 
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.8, ease: "easeInOut" }}
                          style={{ originY: 0 }}
                          className="absolute left-0 -top-12 w-[2px] h-[calc(100%+3rem)] bg-gradient-to-b from-[var(--color-primary)] to-zinc-800"
                        />
                     </div>
                     
                     {/* Center drop - straight down */}
                     <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full">
                        <motion.div 
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
                          style={{ originY: 0 }}
                          className="w-[2px] h-full bg-gradient-to-b from-[var(--color-primary)] to-zinc-800"
                        />
                     </div>
                     
                     {/* Right section - horizontal to right card */}
                     <div className="absolute right-[16.66%] top-0 h-full" style={{ width: '33.34%' }}>
                        {/* Horizontal line */}
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
                          style={{ originX: 0 }}
                          className="absolute left-0 -top-12 h-[2px] w-full bg-[var(--color-primary)] rounded-r-full"
                        />

                        {/* Vertical drop */}
                        <motion.div 
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.8, ease: "easeInOut" }}
                          style={{ originY: 0 }}
                          className="absolute right-0 -top-12 w-[2px] h-[calc(100%+3rem)] bg-gradient-to-b from-[var(--color-primary)] to-zinc-800"
                        />
                     </div>
                  </div>
               </div>
  
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={clsx(
                    "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden group",
                    activeStep === index
                      ? "bg-zinc-950/95 border-[var(--color-primary)] shadow-[0_0_30px_-5px_rgba(255,0,51,0.3)] ring-1 ring-[var(--color-primary)]/50"
                      : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                  )}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative z-10 flex flex-col h-full">  
                  <div className="mb-6 w-full h-[180px]">
                      <step.Visual isActive={activeStep === index} />
                  </div>
                    
                    <h3 className={clsx("text-lg font-semibold mb-2 transition-colors", activeStep === index ? "text-white" : "text-zinc-300")}>
                      {step.title}
                    </h3>
                    
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>
  
                    <div className="mt-auto pt-4 border-t border-zinc-800/50">
                      <code className="text-xs text-[var(--color-primary)] font-mono break-all opacity-80">
                        {step.command}
                      </code>
                    </div>
                  </div>
  
                   {/* Active glow bottom connector */}
                   {activeStep === index && (
                      <motion.div 
                          layoutId="active-connector-bottom"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-gradient-to-t from-[var(--color-primary)] to-transparent opacity-0 md:opacity-100" 
                      />
                   )}
                </motion.div>
              ))}
            </div>
  
            {/* Level 3: Terminal Preview */}
            <div className="w-full max-w-5xl relative">
               {/* Connection line from active card to terminal */}
               <div className="absolute -top-8 left-0 w-full h-8 hidden md:block pointer-events-none">
                   {/* This would be complex to animate perfectly with pure CSS lines, simplifying to a central visual anchor */}
                   <motion.div 
                      initial={{ scaleY: 0, x: "-50%" }}
                      whileInView={{ scaleY: 1, x: "-50%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
                      style={{ originY: 0 }}
                      className="absolute left-1/2 top-0 w-[2px] h-full bg-gradient-to-b from-zinc-800 to-zinc-900" 
                   />
               </div>
  
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl"
              >
                {/* Terminal Header */}
                <div className="flex items-center px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="ml-4 text-xs text-zinc-500 font-mono">
                    {steps[activeStep].terminalTitle} — -zsh
                  </div>
                </div>
  
                {/* Terminal Body */}
                <div className="p-6 font-mono text-sm h-[200px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/20 pointer-events-none" />
                  {steps[activeStep].terminalOutput.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.2 }}
                      className="mb-2 text-zinc-300"
                    >
                      <span className="text-zinc-600 mr-2">{line.startsWith("$") ? "$" : ">"}</span>
                      <span className={line.startsWith("$") ? "text-[var(--color-primary)]" : "text-zinc-300"}>
                          {line.startsWith("$") ? line.substring(2) : line.substring(2)}
                      </span>
                    </motion.div>
                  ))}
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2.5 h-4 bg-[var(--color-primary)] align-middle ml-1"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
