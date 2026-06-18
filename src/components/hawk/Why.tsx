import { Section } from "./Section";
import { Brain, Flame, Target, Users } from "lucide-react";

const reasons = [
  { icon: Brain, t: "AI That Actually Works", d: "Not a chatbot wrapper. A live, on-chain predator model trained on 5 years of whale wallet behavior.", c: "primary" },
  { icon: Flame, t: "Meme Fuel ⚡", d: "Top-tier lore, weapons-grade memes, and a brand that prints itself across every timeline.", c: "secondary" },
  { icon: Users, t: "Swarm of Degens", d: "A horde of holders moving in formation. We don't sell. We circle. We feast together.", c: "primary" },
  { icon: Target, t: "Alpha, Delivered", d: "Holders get real-time signals: wallet alerts, narrative shifts, rug warnings. Edge baked in.", c: "secondary" },
];

export const Why = () => (
  <Section id="why" eyebrow="Why $HAWK" title={<>Four reasons <span className="text-gradient-gold">degens are bonding.</span></>}>
    <div className="grid sm:grid-cols-2 gap-5">
      {reasons.map(({ icon: Icon, t, d, c }) => (
        <div key={t} className={`group relative p-7 md:p-8 rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/30 hover:border-${c}/60 transition-all overflow-hidden`}>
          <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity ${c === "primary" ? "bg-primary/30" : "bg-secondary/30"}`} />
          <div className="relative">
            <div className={`inline-flex w-14 h-14 rounded-xl items-center justify-center mb-5 ${c === "primary" ? "bg-primary/15 text-primary border border-primary/40" : "bg-secondary/15 text-secondary-glow border border-secondary/40"}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-2">{t}</h3>
            <p className="text-muted-foreground">{d}</p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);