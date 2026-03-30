'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Calendar, LineChart, Shield, Users } from 'lucide-react';

const quickLinks: Array<{
  title: string;
  description: string;
  href: Route;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    title: 'Home Operacional',
    description: 'Painel principal com mensagens e métricas em tempo real.',
    href: '/home',
    icon: Shield,
  },
  {
    title: 'Conhecimento',
    description: 'Trilhas de estudo e formação estratégica.',
    href: '/knowledge',
    icon: BookOpen,
  },
  {
    title: 'Comunidade',
    description: 'Chat geral, sugestões e conquistas.',
    href: '/community',
    icon: Users,
  },
  {
    title: 'Cronograma',
    description: 'Agenda semanal e sessões de acompanhamento.',
    href: '/schedule',
    icon: Calendar,
  },
];

export default function DashboardPage() {
  const [username, setUsername] = useState('Agente Voxen');

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);

  const nowLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(new Date()),
    []
  );

  return (
    <div className="relative min-h-full bg-[#05080c] px-4 pb-16 pt-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(161,138,90,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,138,90,0.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <section className="border border-primary/20 bg-black/35 px-6 py-8 shadow-[0_18px_70px_rgba(0,0,0,0.35)] md:px-10">
          <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Dashboard Voxen
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Visão executiva da plataforma
          </h1>
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-primary sm:text-lg">
            Olá, {username}. Use este painel para navegar rapidamente entre áreas críticas e manter ritmo de execução.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-primary/65">{nowLabel}</p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-primary/20 bg-[#0a0f18] p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Status do sistema</p>
            <p className="mt-2 text-2xl font-black text-foreground">Operacional</p>
          </div>
          <div className="border border-primary/20 bg-[#0a0f18] p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Foco recomendado</p>
            <p className="mt-2 text-2xl font-black text-foreground">Consistência diária</p>
          </div>
          <div className="border border-primary/20 bg-[#0a0f18] p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Próxima revisão</p>
            <p className="mt-2 text-2xl font-black text-foreground">Sexta</p>
          </div>
          <div className="border border-primary/20 bg-[#0a0f18] p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Indicador principal</p>
            <p className="mt-2 text-2xl font-black text-foreground">Engajamento</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group border border-primary/20 bg-black/25 p-5 transition-all hover:-translate-y-1 hover:border-primary/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-primary/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm text-primary/80">{item.description}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 border border-primary/20 bg-black/30 p-6">
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5 text-primary" />
            <h3 className="text-2xl font-black uppercase tracking-wide text-foreground">Direção desta semana</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-primary/80">
            Priorize participação em sessões, execução de trilhas e registro de progresso no painel principal. O crescimento no Voxen depende de constância.
          </p>
        </section>
      </div>
    </div>
  );
}
