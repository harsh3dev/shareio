import { Shield, Zap, Infinity, Clock } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "End-to-End Encryption",
      description: "Password protected transfers ensure your data remains secure."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Direct P2P connection via WebSockets/TCP for maximum speed."
    },
    {
      icon: <Infinity className="h-6 w-6" />,
      title: "No Limits",
      description: "Share files of any size. The only limit is your bandwidth."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Transient",
      description: "Files are never stored permanently. Gone when session ends."
    }
  ];

  return (
    <section className="py-20 border-y border-[var(--color-surface)]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-16 text-[var(--color-foreground)]">
          Why Liteshare?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col space-y-3 p-6 rounded-lg bg-[var(--color-surface)]/20 border border-[var(--color-surface)] hover:border-[var(--color-primary)]/30 transition-colors"
            >
              <div className="text-[var(--color-accent)]">{feature.icon}</div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">{feature.title}</h3>
              <p className="text-sm text-[var(--color-foreground)]/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
