import { Section } from "./Section";
import { Eye, Radar, Zap } from "lucide-react";

export const Lore = () => (
  <Section id="lore" eyebrow="The Agent" title={<>An autonomous predator <span className="text-gradient-gold">on Base.</span></>} subtitle="TradeHawk AI is an always-on trading agent. It scans every block on Base mainnet, runs multi-strategy alpha hunting, and serves signals only to $THAI holders.">
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
      <div className="relative p-8 md:p-10 rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
        <p className="relative text-lg md:text-xl leading-relaxed text-foreground/90">
          Base mainnet is the fastest-moving alpha frontier in crypto. New tokens launch every minute on Clanker. Whales rotate in seconds. Retail eats exit liquidity.
          <br /><br />
          <span className="text-gradient-gold font-bold">TradeHawk AI</span> is the answer: an autonomous agent that ingests Base mempool, DEX trades, and social signal, then runs momentum, smart-money copy, and narrative-surge strategies — non-stop.
          <br /><br />
          <span className="text-secondary-glow">Holders of $THAI get the agent.</span> Hold the minimum, connect your wallet, unlock live signals, one-click executions, and (opt-in) auto-execute with risk caps. The swarm eats first.
        </p>
      </div>
      <div className="grid gap-4">
        {[
          { icon: Eye, t: "Base-Native", d: "Indexes every block, swap, and Clanker deploy on Base mainnet." },
          { icon: Radar, t: "Strategy Stack", d: "Momentum breakout, smart-money copy, narrative-surge — running 24/7." },
          { icon: Zap, t: "Holder-Only", d: "Signals, dashboards, and auto-execute gated to $THAI holders." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="group p-6 rounded-xl border border-border bg-card/40 hover:border-primary/50 hover:bg-card/80 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">{t}</div>
                <div className="text-sm text-muted-foreground mt-1">{d}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);