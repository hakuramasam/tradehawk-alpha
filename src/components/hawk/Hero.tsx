import hero from "@/assets/hawk-hero.jpg";
import { Button } from "@/components/ui/button";
import { Particles } from "./Particles";
import { PriceChart } from "./PriceChart";
import { Activity, ArrowRight, Users } from "lucide-react";

export const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen pt-24 md:pt-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      <Particles density={80} />

      <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-12 md:py-20">
        <div className="space-y-7 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/5 text-xs font-mono uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            Live on Pump.fun
          </div>

          <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            The <span className="text-gradient-gold glow-text-gold">AI Hawk</span>
            <br />
            Hunting <span className="text-secondary-glow glow-text-blue">Alpha</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            <span className="text-foreground font-semibold">Tracks whales. Hunts alpha. Never sleeps.</span>
            {" "}TradeHawk is the autonomous AI predator stalking every wallet, every chart, every move — so degens don't have to.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild variant="hawk" size="xl">
              <a href="#buy">Buy $HAWK <ArrowRight className="ml-1" /></a>
            </Button>
            <Button asChild variant="outlineHawk" size="xl">
              <a href="#community"><Users /> Join Community</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-sm font-mono">
            <Stat label="Wallets scanned" value="1.2M+" />
            <Stat label="Alpha calls" value="∞" />
            <Stat label="Sleeps" value="0" />
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" aria-hidden />
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-primary/30 glow-gold">
            <img src={hero} alt="Cybernetic AI hawk in flight tracking crypto charts" width={1280} height={1280} className="w-full h-full object-cover animate-float" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex justify-between text-xs font-mono">
              <span className="px-2 py-1 rounded bg-black/70 border border-primary/40 text-primary">$HAWK / SOL</span>
              <span className="px-2 py-1 rounded bg-black/70 border border-success/40 text-success">+428.6%</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 h-20 rounded-lg bg-black/70 border border-primary/30 p-2 backdrop-blur-sm">
              <PriceChart />
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-black/80 border border-secondary/40 glow-blue backdrop-blur-sm">
            <Activity className="text-secondary-glow w-5 h-5" />
            <div className="font-mono text-xs">
              <div className="text-secondary-glow">WHALE DETECTED</div>
              <div className="text-muted-foreground">12.4 SOL → bonded</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-2xl font-bold text-gradient-gold">{value}</div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);