import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-surface)] py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-[var(--color-foreground)]/60">
          Built with <span className="text-[var(--color-error)]">❤️</span> by{" "}
          <Link
            href="https://github.com/harsh3dev"
            target="_blank"
            className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] underline underline-offset-4"
          >
            Harsh
          </Link>
        </div>
        <div className="flex gap-6 text-sm text-[var(--color-foreground)]/60">
          <Link href="#" className="hover:text-[var(--color-foreground)]">
            MIT License
          </Link>
          <Link href="https://github.com/harsh3dev/shareio" className="hover:text-[var(--color-foreground)]">
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  );
}
