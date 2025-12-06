import type { Metadata } from "next";

import "./globals.css";
import React from "react";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Liteshare - P2P File Sharing",
  description: "Fast, secure, and developer-focused P2P file sharing directly from your terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SmoothScroll />
        <div className="min-h-screen w-full bg-black relative">
          {/* Dot Grid Background */}
          <div
            className="absolute inset-0 z-0 bg-black"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />
          {/* Red Blur Gradient - Global */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-[var(--color-primary)]/3 blur-[80px] rounded-full pointer-events-none z-0" />
          {/* Content */}
          <div className="relative z-10 mx-auto w-full">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
