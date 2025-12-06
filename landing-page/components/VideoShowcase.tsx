'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isInView = useInView(containerRef, { 
    margin: "-100px",
    amount: 0.5 
  });

  // Sync isPlaying state with video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Autoplay/pause based on viewport visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(err => {
          console.log('Video autoplay failed:', err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  // Toggle play/pause on click
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.log('Video play failed:', err);
        });
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-24 overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Perspective wrapper for 3D transforms */}
        <div style={{ perspective: "100px" }}>
          <motion.div
            initial={{ 
              opacity: 0,
              y: 60,
              rotateX: 35,
              scale: 0.8
            }}
            whileInView={{ 
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.8 },
              rotateX: { duration: 1.2 },
              scale: { duration: 1.0 }
            }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-6xl mx-auto"
            style={{ transformStyle: "preserve-3d" }}
          >
          {/* Video container with glow effect */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)]/40 to-[var(--color-primary)]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Video wrapper */}
            <div className="relative rounded-2xl overflow-hidden border border-[var(--color-primary)]/20 shadow-2xl cursor-pointer bg-transparent">
              <motion.video
                ref={videoRef}
                onClick={handleVideoClick}
                className="w-full h-auto aspect-video object-cover bg-transparent"
                title={isPlaying ? "Click to pause" : "Click to play"}
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source 
                  src="https://ik.imagekit.io/6d1smec2e/lietshare/@harshxai%20(1).mp4" 
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </motion.video>
              
              {/* Decorative border gradient overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border border-[var(--color-primary)]/30" />
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--color-primary)] rounded-tl-lg" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[var(--color-primary)] rounded-tr-lg" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[var(--color-primary)] rounded-bl-lg" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--color-primary)] rounded-br-lg" />
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
