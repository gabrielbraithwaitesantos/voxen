import Link from 'next/link';
import type { Route } from 'next';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface TrackModule {
  title: string;
  description: string;
  checklist: string[];
  icon: LucideIcon;
}

interface TrackMetric {
  label: string;
  value: string;
  helper?: string;
}

interface TrackAction {
  label: string;
  href: Route;
  hint: string;
}

interface TrackPageProps {
  badge: string;
  title: string;
  description: string;
  modules: TrackModule[];
  metrics: TrackMetric[];
  nextStepTitle: string;
  nextStepDescription: string;
  nextStepHref: Route;
  nextStepCta: string;
  actions: TrackAction[];
}

export function TrackPage({
  badge,
  title,
  description,
  modules,
  metrics,
  nextStepTitle,
  nextStepDescription,
  nextStepHref,
  nextStepCta,
  actions,
}: TrackPageProps) {
  return (
    <div className="relative min-h-full bg-[#05080c] px-4 pb-16 pt-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(161,138,90,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,138,90,0.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <section className="overflow-hidden border border-primary/20 bg-black/35 px-6 py-8 shadow-[0_18px_70px_rgba(0,0,0,0.35)] md:px-10">
          <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            {badge}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-primary sm:text-lg">{description}</p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.title} className="border border-primary/20 bg-black/25 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-wide text-foreground">{module.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-primary/80">{module.description}</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/30 bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {module.checklist.map((item) => (
                      <li key={item} className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <aside className="border border-primary/20 bg-[#0a0f18] p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-primary/70">Próximo passo</p>
            <h3 className="mt-3 text-2xl font-black uppercase tracking-wide text-foreground">{nextStepTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary/80">{nextStepDescription}</p>

            <Link
              href={nextStepHref}
              className="mt-6 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:border-primary hover:text-foreground"
            >
              {nextStepCta}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <div className="mt-7 space-y-3 border-t border-primary/15 pt-6">
              {metrics.map((metric) => (
                <div key={metric.label} className="border border-primary/15 bg-black/20 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">{metric.label}</p>
                  <p className="mt-1 text-lg font-black text-foreground">{metric.value}</p>
                  {metric.helper ? <p className="mt-1 text-xs text-primary/70">{metric.helper}</p> : null}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-primary/15 pt-6">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group block border border-primary/20 bg-black/30 px-3 py-3 transition-all hover:border-primary/60"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black uppercase tracking-wide text-foreground">{action.label}</p>
                    <ArrowUpRight className="h-4 w-4 text-primary/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-xs text-primary/75">{action.hint}</p>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}