import { Section } from "./Section";
import { Crown, Egg, Swords, Users } from "lucide-react";

const phases = [
  { phase: "Phase 01", name: "Nest", icon: Egg, items: ["$THAI fair-launched on Clanker (Base)", "Brand, site, agent skeleton live", "Wallet gate at 100K $THAI", "First 1,000 hunters onboarded"], status: "active" },
  { phase: "Phase 02", name: "Hunt", icon: Swords, items: ["Live Base trending feed", "3 strategies in production", "SIWE auth + holder backend", "One-click 0x swap on Base"], status: "soon" },
  { phase: "Phase 03", name: "Swarm", icon: Users, items: ["Auto-execute mode w/ risk caps", "Smart-money wallet copy v2", "Narrative-surge NLP layer", "Holder telegram alpha pings"], status: "soon" },
  { phase: "Phase 04", name: "Dominate", icon: Crown, items: ["Multi-chain (BSC, Solana)", "Strategy marketplace", "$THAI staking + revenue share", "The agent runs the timeline"], status: "soon" },
];

export const Roadmap = () => (
  <Section id="roadmap" eyebrow="Roadmap" title={<>From nest to <span className="text-gradient-gold">dominance.</span></>} subtitle="No fake VC milestones. Just four phases of pure ascent.">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
      {phases.map((p, i) => (
        <div key={p.name} className="relative group">
          <div className={`relative h-full p-6 rounded-2xl border bg-card/60 backdrop-blur-sm transition-all hover:-translate-y-1 ${p.status === "active" ? "border-primary/60 glow-gold" : "border-border hover:border-secondary/50"}`}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{p.phase}</span>
              {p.status === "active" && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Active
                </span>
              )}
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${p.status === "active" ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground" : "bg-secondary/15 text-secondary-glow border border-secondary/40"}`}>
              <p.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-3xl mb-4">{p.name}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {p.items.map((it) => (
                <li key={it} className="flex gap-2"><span className="text-primary mt-0.5">▸</span>{it}</li>
              ))}
            </ul>
          </div>
          {i < phases.length - 1 && (
            <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/60 to-transparent" />
          )}
        </div>
      ))}
    </div>
  </Section>
);