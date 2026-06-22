import { Section } from "./Section";
import { Copy, ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CLANKER_URL, THAI_CONTRACT_ADDRESS } from "@/lib/thai";
import { Link } from "react-router-dom";

const stats = [
  { label: "Ticker", value: "$THAI", suffix: "TradeHawk AI" },
  { label: "Chain", value: "Base", suffix: "mainnet (8453)" },
  { label: "Launchpad", value: "Clanker", suffix: "fair launch" },
  { label: "Access gate", value: "100,000", suffix: "$THAI to unlock agent" },
  { label: "Tax", value: "0 / 0", suffix: "no rent, no kings" },
  { label: "Utility", value: "Agent access", suffix: "+ holder-only signals" },
];

export const Tokenomics = () => (
  <Section id="tokenomics" eyebrow="Tokenomics" title={<>Engineered for the <span className="text-gradient-gold">swarm.</span></>} subtitle="Fair launch. Zero tax. Liquidity nuked from orbit. The hawk eats first — but the swarm eats forever.">
    <div className="grid md:grid-cols-3 gap-5 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="relative group p-7 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm hover:border-primary/60 hover:-translate-y-1 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">{s.label}</div>
            <div className="font-display font-black text-3xl md:text-4xl text-gradient-gold mb-1">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.suffix}</div>
          </div>
        </div>
      ))}
    </div>

    <div id="buy" className="relative p-6 md:p-8 rounded-2xl border border-secondary/40 bg-gradient-to-br from-secondary/10 to-primary/5 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="space-y-1 min-w-0">
          <div className="text-xs font-mono uppercase tracking-widest text-secondary-glow">Contract Address · Base</div>
          <div className="font-mono text-xs md:text-sm text-foreground truncate">{THAI_CONTRACT_ADDRESS}</div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="outlineHawk"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(THAI_CONTRACT_ADDRESS);
              toast("Contract copied. The hawk is watching.");
            }}
          >
            <Copy /> Copy CA
          </Button>
          <Button variant="hawk" size="sm" asChild>
            <a href={CLANKER_URL} target="_blank" rel="noopener noreferrer">
              Buy on Clanker <ExternalLink />
            </a>
          </Button>
          <Button variant="outlineHawk" size="sm" asChild>
            <Link to="/app"><Rocket /> Launch Agent</Link>
          </Button>
        </div>
      </div>
    </div>
  </Section>
);