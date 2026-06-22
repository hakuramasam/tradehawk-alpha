const items = [
  { sym: "$THAI", val: "Live on Base", up: true },
  { sym: "AGENT", val: "scanning Base mainnet", up: true },
  { sym: "ALPHA SIGNAL", val: "92.4% confidence", up: true },
  { sym: "$DEGEN", val: "+42.8%", up: true },
  { sym: "$BRETT", val: "+18.4%", up: true },
  { sym: "$MOCHI", val: "+64.3%", up: true },
  { sym: "MARKET SCAN", val: "1,284 tokens / min", up: true },
  { sym: "RUG DETECTED", val: "blocked", up: false },
  { sym: "GATE", val: "100,000 $THAI required", up: true },
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