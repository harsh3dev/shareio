import Link from "next/link";
import { Github } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const version = process.env.NEXT_PUBLIC_PACKAGE_VERSION || "1.0.4";
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      {/* Bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-40"></div>
      
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-[var(--color-primary)]">
            &gt;_
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-[var(--color-foreground)]">
            Liteshare
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {/* Shields.io badge */}
          <Link
            href="https://www.npmjs.com/package/liteshare"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block hover:opacity-80 transition-opacity"
          >
            <Image
              src={`https://img.shields.io/badge/version-${version}-ff0033?style=flat-square&logo=npm&logoColor=white`}
              alt={`Version ${version}`}
              width={100}
              height={20}
              unoptimized
            />
          </Link>
          <Link
            href="https://github.com/harsh3dev/shareio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
