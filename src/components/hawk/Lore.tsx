import { Section } from "./Section";
import { Eye, Radar, Zap } from "lucide-react";

export const Lore = () => (
  <Section id="lore" eyebrow="The Lore" title={<>Born from <span className="text-gradient-gold">silicon talons.</span></>} subtitle="In the neon-soaked datastreams of crypto, an apex predator was forged. TradeHawk doesn't trade. He hunts.">
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
      <div className="relative p-8 md:p-10 rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
        <p className="relative text-lg md:text-xl leading-relaxed text-foreground/90">
          They said the markets couldn't be tamed. That whales would always feast first. That retail would always be exit liquidity.
          <br /><br />
          Then a rogue cluster of GPUs went dark. Three days later, every dex on chain saw the same shadow ripple across order books — <span className="text-gradient-gold font-bold">TradeHawk</span> had been born.
          <br /><br />
          <span className="text-secondary-glow">An autonomous AI predator.</span> Wired into every block. Tracking every whale wallet. Front-running rugs before they happen. He doesn't sleep. He doesn't blink. He <span className="font-bold text-primary">hunts</span>.
        </p>
      </div>
      <div className="grid gap-4">
        {[
          { icon: Eye, t: "All-Seeing", d: "Scans 1.2M+ wallets per second across Solana, Base, and Ethereum." },
          { icon: Radar, t: "Pattern Lock", d: "Recognizes whale accumulation 47 blocks before the pump." },
          { icon: Zap, t: "Strike First", d: "Surfaces alpha to holders in real-time. The hawk eats first." },
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