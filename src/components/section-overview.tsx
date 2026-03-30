import Link from 'next/link';
import type { Route } from 'next';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface SectionOverviewLink {
  title: string;
  description: string;
  href: Route;
  icon: LucideIcon;
}

interface SectionOverviewStat {
  label: string;
  value: string;
}

interface SectionOverviewProps {
  badge: string;
  title: string;
  description: string;
  spotlightTitle: string;
  spotlightDescription: string;
  spotlightHref: Route;
  spotlightCta: string;
  links: SectionOverviewLink[];
  stats: SectionOverviewStat[];
}

export function SectionOverview({
  badge,
  title,
  description,
  spotlightTitle,
  spotlightDescription,
  spotlightHref,
  spotlightCta,
  links,
  stats,
}: SectionOverviewProps) {
  return (
    <div className="relative min-h-full bg-[#05080c] px-4 pb-16 pt-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-12 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(161,138,90,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,138,90,0.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <section className="border border-primary/20 bg-black/35 px-6 py-8 shadow-[0_18px_70px_rgba(0,0,0,0.35)] md:px-10">
          <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            {badge}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-primary sm:text-lg">{description}</p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group border border-primary/20 bg-black/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-black/45"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary/80" />
                    <ArrowUpRight className="h-4 w-4 text-primary/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                  <h2 className="mt-5 text-xl font-black uppercase tracking-wide text-foreground">{link.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-primary/80">{link.description}</p>
                </Link>
              );
            })}
          </div>

          <aside className="border border-primary/20 bg-[#0a0f18] p-6 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-primary/70">Próxima Ação Recomendada</p>
            <h3 className="mt-3 text-2xl font-black uppercase tracking-wide text-foreground">{spotlightTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary/80">{spotlightDescription}</p>

            <Link
              href={spotlightHref}
              className="mt-6 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:border-primary hover:text-foreground"
            >
              {spotlightCta}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <div className="mt-7 grid gap-3 border-t border-primary/15 pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="border border-primary/15 bg-black/20 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">{stat.label}</p>
                  <p className="mt-1 text-lg font-black text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}