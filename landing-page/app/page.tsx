import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { VideoShowcase } from "@/components/VideoShowcase";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-[var(--color-primary)] selection:text-[var(--color-background)]">
      <Navbar />
      <Hero />
      <VideoShowcase />
      <HowItWorks />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
