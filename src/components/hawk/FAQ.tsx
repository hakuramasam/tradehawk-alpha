import { Section } from "./Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is TradeHawk AI?", a: "TradeHawk AI is an autonomous trading agent for Base mainnet. It scans trending tokens, runs multi-strategy alpha hunting (momentum, smart-money copy, narrative surge), and surfaces ranked trade signals to its holders." },
  { q: "What is $THAI and why do I need it?", a: "$THAI (TradeHawk AI Token) is the access key. The agent dashboard and signals are gated to wallets holding at least 100,000 $THAI on Base. Connect your wallet at /app to check access." },
  { q: "How do I buy $THAI?", a: "Use any Base-compatible wallet (Rainbow, MetaMask, Coinbase Wallet) with ETH on Base, then buy $THAI on Clanker. Contract: 0x00c605b6515A8509974391FCFd34014c78107B07." },
  { q: "How does the agent execute trades?", a: "Mode A (default): the agent surfaces signals; you click 'Execute' and your wallet signs a 0x/Uniswap swap on Base — full custody, full control. Mode B (opt-in, coming soon): you authorize a session key with strict risk caps for hands-off execution." },
  { q: "Is my wallet safe? Can the agent drain me?", a: "Signal mode requires per-trade signature in your wallet — the agent can never move funds without your approval. Auto-execute mode uses an isolated session key you fund and cap; the agent can never touch your main wallet." },
  { q: "What chain does the agent trade on?", a: "Base mainnet only at launch. BSC and Solana are on the roadmap (Phase 04)." },
  { q: "Is this financial advice?", a: "No. TradeHawk AI is software for on-chain analytics and trade execution. Crypto trading is high-risk; signals can be wrong; you can lose money. Only deploy what you can afford to lose." },
];

export const FAQ = () => (
  <Section id="faq" eyebrow="FAQ" title={<>Sharp <span className="text-gradient-gold">questions.</span> Sharp answers.</>}>
    <div className="max-w-3xl">
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`} className="border border-border rounded-xl bg-card/60 backdrop-blur-sm px-6 data-[state=open]:border-primary/60 transition-colors">
            <AccordionTrigger className="text-left font-display text-lg hover:no-underline hover:text-primary py-5">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </Section>
);