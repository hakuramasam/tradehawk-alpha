import { Helmet } from "react-helmet-async";
import { Nav } from "@/components/hawk/Nav";
import { Hero } from "@/components/hawk/Hero";
import { Ticker } from "@/components/hawk/Ticker";
import { Lore } from "@/components/hawk/Lore";
import { Why } from "@/components/hawk/Why";
import { Tokenomics } from "@/components/hawk/Tokenomics";
import { Roadmap } from "@/components/hawk/Roadmap";
import { Community } from "@/components/hawk/Community";
import { FAQ } from "@/components/hawk/FAQ";
import { Footer } from "@/components/hawk/Footer";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <Helmet>
      <link rel="canonical" href="https://tradehawk-alpha-nest.lovable.app/" />
    </Helmet>
    <Nav />
    <main>
      <Hero />
      <Ticker />
      <Lore />
      <Why />
      <Tokenomics />
      <Roadmap />
      <Community />
      <FAQ />
    </main>
    <Footer />
  </div>
);

export default Index;
