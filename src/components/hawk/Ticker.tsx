const items = [
  { sym: "$HAWK", val: "+428.6%", up: true },
  { sym: "WHALE TX", val: "12.4 SOL → bonded", up: true },
  { sym: "ALPHA SIGNAL", val: "92.4% confidence", up: true },
  { sym: "$BTC", val: "+1.8%", up: true },
  { sym: "$ETH", val: "+0.9%", up: true },
  { sym: "$SOL", val: "+3.2%", up: true },
  { sym: "MARKET SCAN", val: "1,284 wallets / sec", up: true },
  { sym: "RUG DETECTED", val: "blocked", up: false },
  { sym: "$HAWK HOLDERS", val: "TBD", up: true },
];

export const Ticker = () => {
  const row = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden border-y border-primary/30 bg-black/60 backdrop-blur-sm py-3">
      <div className="flex animate-ticker whitespace-nowrap gap-10 will-change-transform">
        {row.map((it, i) => (
          <div key={i} className="flex items-center gap-3 font-mono text-sm">
            <span className="text-muted-foreground">{it.sym}</span>
            <span className={it.up ? "text-success" : "text-danger"}>{it.val}</span>
            <span className="text-primary/40">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
};