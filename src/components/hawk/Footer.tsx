import logo from "@/assets/hawk-logo.png";

export const Footer = () => (
  <footer className="relative border-t border-primary/20 bg-black/60 backdrop-blur-sm mt-10">
    <div className="container py-12 grid md:grid-cols-3 gap-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TradeHawk AI logo: golden cybernetic hawk head" width={36} height={36} className="w-9 h-9" loading="lazy" />
          <span className="font-display font-black text-lg">TRADE<span className="text-gradient-gold">HAWK AI</span></span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">Autonomous AI trading agent on Base mainnet. Gated by $THAI. Hunting trending alpha 24/7.</p>
      </div>
      <div>
        <div className="font-display font-bold mb-3 text-sm uppercase tracking-widest">Explore</div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {["Lore", "Tokenomics", "Roadmap", "Community", "FAQ"].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-primary transition-colors">{l}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-display font-bold mb-3 text-sm uppercase tracking-widest">Disclaimer</div>
        <p className="text-xs text-muted-foreground leading-relaxed">TradeHawk AI provides on-chain analytics and trade execution tooling. Nothing here is financial advice. Crypto trading is high-risk and you can lose money. DYOR.</p>
      </div>
    </div>
    <div className="border-t border-primary/10 py-5">
      <div className="container text-xs text-muted-foreground font-mono flex flex-col md:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} TradeHawk. The sky is ours.</span>
        <span className="text-primary/60">"Tracks whales. Hunts alpha. Never sleeps."</span>
      </div>
    </div>
  </footer>
);