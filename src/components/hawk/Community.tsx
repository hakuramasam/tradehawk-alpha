import { Section } from "./Section";
import { Send, Twitter, Rocket } from "lucide-react";

const links = [
  { name: "X / Twitter", handle: "@tradehawk", desc: "Raids, alpha drops, hawk-coded shitposts.", icon: Twitter, href: "https://x.com" },
  { name: "Telegram", handle: "t.me/tradehawk", desc: "The nest. 24/7 swarm comms. Don't get rekt alone.", icon: Send, href: "https://t.me" },
  { name: "Pump.fun", handle: "/HAWK", desc: "Ape the bonding curve. Liquidity burns at the top.", icon: Rocket, href: "https://pump.fun" },
];

export const Community = () => (
  <Section id="community" eyebrow="Join The Swarm" title={<>The hawks are <span className="text-gradient-gold">circling.</span></>} subtitle="One hawk hunts. A swarm devours. Pick your perch.">
    <div className="grid md:grid-cols-3 gap-5">
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="group relative p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-primary/60 hover:-translate-y-1 transition-all overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/40 flex items-center justify-center text-primary mb-5 group-hover:from-primary group-hover:to-primary-glow group-hover:text-primary-foreground transition-all">
              <l.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-1">{l.name}</h3>
            <div className="font-mono text-sm text-secondary-glow mb-3">{l.handle}</div>
            <p className="text-muted-foreground text-sm">{l.desc}</p>
          </div>
        </a>
      ))}
    </div>
  </Section>
);