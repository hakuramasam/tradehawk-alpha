import { ReactNode } from "react";

export const Section = ({ id, eyebrow, title, subtitle, children, className = "" }: {
  id?: string; eyebrow?: string; title: ReactNode; subtitle?: string; children: ReactNode; className?: string;
}) => (
  <section id={id} className={`relative py-24 md:py-32 ${className}`}>
    <div className="container relative">
      <div className="max-w-3xl mb-14 md:mb-20">
        {eyebrow && (
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-secondary/40 bg-secondary/10 text-xs font-mono uppercase tracking-widest text-secondary-glow">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">{title}</h2>
        {subtitle && <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
);