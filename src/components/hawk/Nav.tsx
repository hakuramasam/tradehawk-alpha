import logo from "@/assets/hawk-logo.png";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const links = [
  { href: "#lore", label: "Lore" },
  { href: "#why", label: "Why $HAWK" },
  { href: "#tokenomics", label: "Tokenomics" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#community", label: "Community" },
  { href: "#faq", label: "FAQ" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-primary/20" : "bg-transparent"}`}>
      <nav className="container flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex items-center gap-2 group">
          <img src={logo} alt="TradeHawk logo" width={40} height={40} className="w-10 h-10 group-hover:rotate-12 transition-transform" />
          <span className="font-display font-black text-xl tracking-tight">
            TRADE<span className="text-gradient-gold">HAWK</span>
          </span>
        </a>
        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
          ))}
        </div>
        <Button asChild variant="hawk" size="sm">
          <a href="#buy">Buy $HAWK</a>
        </Button>
      </nav>
    </header>
  );
};