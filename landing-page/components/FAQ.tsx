"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FAQ() {
  const items = [
    {
      question: "Do I need to install anything?",
      answer: "No! Just use npx liteshare to run it directly without global installation."
    },
    {
      question: "Is it secure?",
      answer: "Yes. Direct P2P transfer means your files don't sit on a central server. You can also password protect transfers."
    },
    {
      question: "Is there a file size limit?",
      answer: "No limits. Since it's P2P, you can transfer files as large as your internet connection allows."
    },
    {
      question: "What happens if I close the terminal?",
      answer: "The transfer session ends immediately. No data is retained anywhere."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* FAQ Items - Left Side */}
          <div className="space-y-8">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter text-left text-[var(--color-foreground)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <FAQItem 
                  key={index} 
                  question={item.question} 
                  answer={item.answer}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          {/* Image - Right Side */}
          <motion.div 
            className="flex items-center justify-center"
            style={{ perspective: "2000px" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.img 
              src="https://ik.imagekit.io/6d1smec2e/lietshare/litesharefloppy.webp" 
              alt="Liteshare Floppy Disk" 
              className="w-full max-w-xl h-auto object-contain cursor-pointer"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 0, 51, 0.08)) drop-shadow(0 0 40px rgba(255, 0, 51, 0.08))'
              }}
              initial={{
                rotateX: 25,
                rotateY: -15,
                scale: 0.7,
              }}
              whileInView={{
                rotateX: 0,
                rotateY: 0,
                scale: 1,
              }}
              whileHover={{
                scale: 1.05,
                filter: 'drop-shadow(0 0 30px rgba(255, 0, 51, 0.25)) drop-shadow(0 0 60px rgba(255, 0, 51, 0.2))',
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              viewport={{ once: true }}
              transition={{
                duration: 4,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              animate={{
                y: [0, -10, 0],
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="border border-[var(--color-surface)] rounded-lg bg-[var(--color-surface)]/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1 
      }}
      whileHover={{ 
        scale: 1.02,
        borderColor: "rgba(255, 0, 51, 0.3)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface)]/40 transition-colors"
      >
        <motion.span
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {question}
        </motion.span>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 90 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isOpen ? (
            <Minus className="h-4 w-4 text-[var(--color-primary)]" />
          ) : (
            <Plus className="h-4 w-4 text-[var(--color-foreground)]/50" />
          )}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div 
              className="p-4 pt-0 text-[var(--color-foreground)]/70 border-t border-[var(--color-surface)]/50"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {answer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
