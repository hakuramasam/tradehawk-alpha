import { Section } from "./Section";
import { Brain, Flame, Target, Users } from "lucide-react";

const reasons = [
  { icon: Brain, t: "AI That Actually Trades", d: "Not a chatbot. An autonomous agent running real strategies on Base mainnet — momentum, smart-money, narrative.", gold: true },
  { icon: Target, t: "Trending Base Alpha", d: "Continuous scan of Base DEX pairs and Clanker launches. Ranked by volume, liquidity, and whale activity.", gold: false },
  { icon: Users, t: "Token-Gated Access", d: "Hold 100,000 $THAI in your wallet. Connect. Unlock signals, executions, and auto-mode. No subs, no logins.", gold: true },
  { icon: Flame, t: "Holder Edge", d: "Wallet alerts, rug warnings, one-click swaps, opt-in auto-execute with risk caps. The hawk eats first.", gold: false },
];

export const Why = () => (
  <Section id="why" eyebrow="Why $HAWK" title={<>Four reasons <span className="text-gradient-gold">degens are bonding.</span></>}>
    <div className="grid sm:grid-cols-2 gap-5">
      {reasons.map(({ icon: Icon, t, d, gold }) => (
        <div key={t} className={`group relative p-7 md:p-8 rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/30 transition-all overflow-hidden ${gold ? "hover:border-primary/60" : "hover:border-secondary/60"}`}>
          <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity ${gold ? "bg-primary/30" : "bg-secondary/30"}`} />
          <div className="relative">
            <div className={`inline-flex w-14 h-14 rounded-xl items-center justify-center mb-5 ${gold ? "bg-primary/15 text-primary border border-primary/40" : "bg-secondary/15 text-secondary-glow border border-secondary/40"}`}>
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