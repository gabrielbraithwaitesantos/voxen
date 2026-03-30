import Link from 'next/link';
import { AlertCircle, ArrowUpRight, Calendar, MessageSquare, Shield } from 'lucide-react';

const activeAnnouncements = [
  {
    title: 'Atualização de rotina semanal',
    category: 'Operação',
    date: '30 Mar 2026',
    description: 'As revisões de progresso passam a ocorrer nas sextas, com síntese obrigatória no chat geral.',
    priority: 'Alta prioridade',
  },
  {
    title: 'Padronização de entregas curtas',
    category: 'Academia',
    date: '29 Mar 2026',
    description: 'Toda trilha deve registrar ao menos uma entrega objetiva por semana para acompanhamento da evolução.',
    priority: 'Padrão ativo',
  },
  {
    title: 'Janela de suporte ampliada',
    category: 'Laboratório',
    date: '28 Mar 2026',
    description: 'Dúvidas enviadas até 18h entram no ciclo de resposta prioritária do mesmo dia útil.',
    priority: 'Comunicado',
  },
];

const upcomingEvents = [
  { title: 'Call de alinhamento semanal', date: 'Quarta • 20:00', area: 'Cronograma' },
  { title: 'Sessão de debate avançado', date: 'Quinta • 19:30', area: 'Hub de Elite' },
  { title: 'Prática oral guiada', date: 'Sexta • 21:00', area: 'Laboratório' },
];

const weeklyChecklist = [
  'Revisar diretrizes e manter padrão de interação.',
  'Publicar pelo menos uma contribuição no chat geral.',
  'Registrar objetivo semanal no perfil.',
  'Confirmar presença nas sessões do cronograma.',
];

export default function AnnouncementsPage() {
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
            Avisos Gerais
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Central de comunicados e atualizações oficiais
          </h1>
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-primary sm:text-lg">
            Acompanhe decisões operacionais, ajustes de agenda e orientações da comunidade em um só lugar.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:border-primary hover:text-foreground"
            >
              Ver cronograma
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/guidelines"
              className="inline-flex items-center gap-2 border border-primary/25 bg-black/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/90 transition-all hover:border-primary/60 hover:text-foreground"
            >
              Revisar diretrizes
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <div className="space-y-4">
            {activeAnnouncements.map((announcement) => (
              <article key={announcement.title} className="border border-primary/20 bg-black/25 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-3">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary/80">
                    <MessageSquare className="h-4 w-4" />
                    {announcement.category}
                  </div>
                  <span className="border border-primary/25 bg-primary/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-primary/85">
                    {announcement.priority}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-foreground">{announcement.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-primary/80">{announcement.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-primary/60">Publicado em {announcement.date}</p>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="border border-primary/20 bg-[#0a0f18] p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <Calendar className="h-4 w-4" /> Próximos eventos
              </div>
              <div className="mt-4 space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="border border-primary/15 bg-black/25 p-3">
                    <p className="text-sm font-black uppercase tracking-wide text-foreground">{event.title}</p>
                    <p className="mt-1 text-xs text-primary/75">{event.date}</p>
                    <p className="text-xs text-primary/60">Área: {event.area}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-primary/20 bg-[#0a0f18] p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <Shield className="h-4 w-4" /> Checklist da semana
              </div>
              <ul className="mt-4 space-y-2">
                {weeklyChecklist.map((item) => (
                  <li key={item} className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-primary/20 bg-black/25 p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <AlertCircle className="h-4 w-4" /> Não encontrou o aviso?
              </div>
              <p className="mt-3 text-sm text-primary/80">Se algo estiver desatualizado, registre no canal de sugestões para revisão da equipe.</p>
              <Link
                href="/community/suggestions"
                className="mt-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-all hover:border-primary hover:text-foreground"
              >
                Enviar atualização
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
