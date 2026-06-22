import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useThaiBalance } from "@/hooks/useThaiBalance";
import { HawkConnectButton } from "@/components/hawk/ConnectButton";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/hawk/Particles";
import { CLANKER_URL, THAI_MIN_HOLDING } from "@/lib/thai";
import logo from "@/assets/hawk-logo.png";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Brain,
  ChevronRight,
  Flame,
  Lock,
  Radar,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);

const MOCK_TRENDING = [
  { symbol: "DEGEN", name: "Degen", chg: 42.8, vol: "$8.2M", liq: "$3.1M", score: 92 },
  { symbol: "BRETT", name: "Brett", chg: 18.4, vol: "$12.6M", liq: "$5.4M", score: 88 },
  { symbol: "TOSHI", name: "Toshi", chg: -6.1, vol: "$4.1M", liq: "$2.0M", score: 71 },
  { symbol: "HIGHER", name: "Higher", chg: 11.7, vol: "$2.9M", liq: "$1.4M", score: 79 },
  { symbol: "MOCHI", name: "Mochi", chg: 64.3, vol: "$5.7M", liq: "$2.2M", score: 95 },
];

const MOCK_SIGNALS = [
  {
    symbol: "MOCHI",
    strategy: "Momentum Breakout",
    confidence: 94,
    side: "LONG",
    entry: "$0.00412",
    sl: "$0.00368",
    tp: "$0.00540",
    reason: "5x volume vs 24h avg, 3 smart-money wallets accumulating, breaking 4h resistance.",
  },
  {
    symbol: "DEGEN",
    strategy: "Smart Money Copy",
    confidence: 87,
    side: "LONG",
    entry: "$0.0094",
    sl: "$0.0086",
    tp: "$0.0118",
    reason: "Whale 0x4a…91 deployed 24 ETH in last 47 blocks. Historical hit rate 72%.",
  },
  {
    symbol: "TOSHI",
    strategy: "Liquidity Trap Avoidance",
    confidence: 78,
    side: "AVOID",
    entry: "—",
    sl: "—",
    tp: "—",
    reason: "LP migration pattern detected. 38% of supply held by 2 wallets. Hawk circles.",
  },
];

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground relative">
    <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: "var(--gradient-radial)" }}
    />
    <Particles density={40} />
    <header className="relative border-b border-primary/20 bg-background/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TradeHawk AI" width={36} height={36} className="w-9 h-9" />
          <div className="flex flex-col leading-none">
            <span className="font-display font-black tracking-tight">
              TRADE<span className="text-gradient-gold">HAWK AI</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Agent · Base Mainnet
            </span>
          </div>
        </Link>
        <HawkConnectButton compact />
      </div>
    </header>
    <main className="relative container py-8 md:py-12">{children}</main>
  </div>
);

const Gate = ({
  title,
  desc,
  cta,
}: {
  title: React.ReactNode;
  desc: React.ReactNode;
  cta: React.ReactNode;
}) => (
  <div className="max-w-2xl mx-auto text-center py-16 md:py-24">
    <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/40 text-primary mb-6 glow-gold">
      <Lock className="w-7 h-7" />
    </div>
    <h1 className="font-display font-black text-3xl md:text-5xl mb-4">{title}</h1>
    <p className="text-muted-foreground text-lg mb-8">{desc}</p>
    <div className="flex flex-wrap gap-3 justify-center">{cta}</div>
  </div>
);

const Stat = ({
  icon: Icon,
  label,
  value,
  sub,
  accent = "gold",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: "gold" | "blue" | "green";
}) => {
  const color =
    accent === "blue"
      ? "text-secondary-glow border-secondary/40 bg-secondary/10"
      : accent === "green"
      ? "text-success border-success/40 bg-success/10"
      : "text-primary border-primary/40 bg-primary/10";
  return (
    <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="font-display font-black text-xl">{value}</div>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ holdings }: { holdings: number }) => (
  <div className="space-y-8">
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/40 bg-success/10 text-xs font-mono uppercase tracking-widest text-success mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Access granted
      </div>
      <h1 className="font-display font-black text-3xl md:text-5xl mb-2">
        The hawk is <span className="text-gradient-gold">hunting.</span>
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Live agent scanning trending alpha across Base mainnet. Strategies run continuously;
        execute signals with one click via your connected wallet.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Stat icon={Sparkles} label="Your $THAI" value={fmt(holdings)} sub="Holder tier: Hunter" />
      <Stat icon={Radar} label="Tokens scanned" value="412" sub="Last 60s" accent="blue" />
      <Stat icon={Bot} label="Active strategies" value="3" sub="Running 24/7" />
      <Stat icon={TrendingUp} label="Signals today" value="27" sub="6 high-confidence" accent="green" />
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-secondary-glow mb-1">
              Live signals
            </div>
            <h2 className="font-display font-bold text-2xl">Strategy outputs</h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground inline-flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-success animate-pulse" /> streaming
          </span>
        </div>
        <div className="space-y-3">
          {MOCK_SIGNALS.map((s) => (
            <div
              key={s.symbol + s.strategy}
              className="p-4 rounded-xl border border-border hover:border-primary/50 bg-background/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/40 flex items-center justify-center font-display font-black text-sm">
                    {s.symbol.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-lg flex items-center gap-2">
                      ${s.symbol}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          s.side === "LONG"
                            ? "bg-success/15 text-success border border-success/40"
                            : "bg-danger/15 text-danger border border-danger/40"
                        }`}
                      >
                        {s.side}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{s.strategy}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-muted-foreground">Confidence</div>
                  <div className="font-display font-black text-lg text-gradient-gold">{s.confidence}%</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{s.reason}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex gap-4 text-muted-foreground">
                  <span>Entry: <span className="text-foreground">{s.entry}</span></span>
                  <span>SL: <span className="text-danger">{s.sl}</span></span>
                  <span>TP: <span className="text-success">{s.tp}</span></span>
                </div>
                <Button size="sm" variant={s.side === "AVOID" ? "outlineHawk" : "hawk"} disabled={s.side === "AVOID"}>
                  {s.side === "AVOID" ? "Monitoring" : "Execute trade"} <ChevronRight />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
          Trade execution wires up in Phase 4 (0x Swap on Base). Signals here are demo data
          while the agent backend is provisioned.
        </div>
      </section>

      <section className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
        <div className="text-xs font-mono uppercase tracking-widest text-secondary-glow mb-1">
          Trending on Base
        </div>
        <h2 className="font-display font-bold text-2xl mb-5">Hawk's radar</h2>
        <div className="space-y-2">
          {MOCK_TRENDING.map((t) => (
            <div
              key={t.symbol}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 bg-background/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-secondary/15 border border-secondary/40 flex items-center justify-center font-mono text-xs">
                  {t.symbol.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-sm">${t.symbol}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">Vol {t.vol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-sm font-bold ${t.chg >= 0 ? "text-success" : "text-danger"}`}>
                  {t.chg >= 0 ? "+" : ""}
                  {t.chg}%
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">Score {t.score}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

    <section className="p-6 rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-primary/5 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 text-secondary-glow flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-xl mb-1">Auto-execute mode</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
            Generate a session key, fund a sandbox wallet, and let the hawk execute within your
            risk caps (max per trade, daily cap, allowed tokens). Disabled by default — flipping
            this on means real on-chain trades happen without per-trade approval.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outlineHawk" size="sm" disabled>
              Configure auto-mode (Phase 5)
            </Button>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground self-center">
              currently signal-only
            </span>
          </div>
        </div>
      </div>
    </section>

    <div className="grid md:grid-cols-3 gap-4">
      {[
        { icon: Brain, t: "Momentum Breakout", d: "Detects volume + price expansion vs 24h baseline. Filters illiquid traps." },
        { icon: Target, t: "Smart Money Copy", d: "Mirrors clusters of profitable Base wallets with adaptive lag." },
        { icon: Flame, t: "Narrative Surge", d: "NLP-scans X/Farcaster firehose for ticker mentions, ranks velocity." },
      ].map(({ icon: Icon, t, d }) => (
        <div key={t} className="p-5 rounded-xl border border-border bg-card/40">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mb-3">
            <Icon className="w-5 h-5" />
          </div>
          <div className="font-display font-bold mb-1">{t}</div>
          <div className="text-sm text-muted-foreground">{d}</div>
        </div>
      ))}
    </div>
  </div>
);

const AgentApp = () => {
  const { address, isConnected } = useAccount();
  const { formatted, hasAccess, isLoading } = useThaiBalance(address);

  return (
    <Shell>
      {!isConnected && (
        <Gate
          title={
            <>
              Connect wallet to wake <span className="text-gradient-gold">the hawk.</span>
            </>
          }
          desc={
            <>
              The TradeHawk AI Agent is gated to $THAI holders on Base mainnet. Connect a wallet
              holding at least <span className="text-primary font-bold">{fmt(Number(THAI_MIN_HOLDING))} $THAI</span> to enter.
            </>
          }
          cta={
            <>
              <HawkConnectButton />
              <Button asChild variant="outlineHawk" size="lg">
                <a href={CLANKER_URL} target="_blank" rel="noopener noreferrer">
                  Get $THAI on Clanker <ArrowUpRight />
                </a>
              </Button>
            </>
          }
        />
      )}

      {isConnected && isLoading && (
        <div className="text-center py-24 font-mono text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
          Reading $THAI balance on Base…
        </div>
      )}

      {isConnected && !isLoading && !hasAccess && (
        <Gate
          title={
            <>
              Not enough <span className="text-gradient-gold">$THAI.</span>
            </>
          }
          desc={
            <>
              You hold <span className="text-foreground font-bold">{fmt(formatted)} $THAI</span>.
              The hawk requires{" "}
              <span className="text-primary font-bold">
                {fmt(Number(THAI_MIN_HOLDING))} $THAI
              </span>{" "}
              minimum to grant access. Acquire more on Clanker and reload.
            </>
          }
          cta={
            <>
              <Button asChild variant="hawk" size="lg">
                <a href={CLANKER_URL} target="_blank" rel="noopener noreferrer">
                  Buy $THAI on Clanker <ArrowUpRight />
                </a>
              </Button>
              <Button asChild variant="outlineHawk" size="lg">
                <Link to="/">Back to site</Link>
              </Button>
            </>
          }
        />
      )}

      {isConnected && !isLoading && hasAccess && <Dashboard holdings={formatted} />}
    </Shell>
  );
};

export default AgentApp;