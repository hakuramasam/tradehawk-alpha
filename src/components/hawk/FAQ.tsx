import { Section } from "./Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is $HAWK actually an AI?", a: "The lore is built around an autonomous on-chain predator. The token is a community-powered meme coin on Pump.fun. The brand, the swarm, and the holder-only signals are real — the magic is the community." },
  { q: "How do I buy $HAWK?", a: "Grab a Solana wallet (Phantom or Backpack), fund it with SOL, head to Pump.fun, search $HAWK, and ape. Liquidity burns once we bond." },
  { q: "Is the contract safe?", a: "Fair launch on Pump.fun means no mint authority, no freeze authority, and liquidity is burned on bonding. Always verify the contract address from our official X." },
  { q: "What's the supply?", a: "1,000,000,000 $HAWK. No team allocation tricks. No hidden wallets. The swarm sees everything." },
  { q: "Will there be a CEX listing?", a: "If the swarm flies hard enough, the exchanges come to us. We don't beg — we hunt." },
  { q: "Is this financial advice?", a: "Absolutely not. $HAWK is a meme coin. Memes are volatile. The hawk is brutal. Only ape what you can afford to feed to the predator." },
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