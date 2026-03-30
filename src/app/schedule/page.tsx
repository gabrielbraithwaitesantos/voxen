import { Calendar, UserPlus, Video } from 'lucide-react';
import { SectionOverview } from '@/components/section-overview';

export default function ScheduleOverviewPage() {
  return (
    <SectionOverview
      badge="Cronograma"
      title="Planejamento de encontros e rituais de execução"
      description="Organize agenda semanal, calls em grupo e sessões individuais para manter evolução previsível e foco coletivo."
      spotlightTitle="Abrir agenda semanal"
      spotlightDescription="Use a semana como trilho principal de execução e visibilidade de prioridades."
      spotlightHref="/schedule/weekly"
      spotlightCta="Ver agenda"
      links={[
        {
          title: 'Agenda Semanal',
          description: 'Visão central de compromissos e prioridades da semana.',
          href: '/schedule/weekly',
          icon: Calendar,
        },
        {
          title: 'Call em Grupo',
          description: 'Sessões coletivas para alinhamento e discussão.',
          href: '/schedule/group-call',
          icon: Video,
        },
        {
          title: 'Agendamento 1-on-1',
          description: 'Marcação de encontros individuais com foco personalizado.',
          href: '/schedule/one-on-one',
          icon: UserPlus,
        },
      ]}
      stats={[
        { label: 'Regra da Área', value: 'Planejar antes de executar' },
        { label: 'Frequência Ideal', value: 'Revisão semanal toda segunda' },
        { label: 'Métrica-chave', value: 'Assiduidade nas sessões' },
      ]}
    />
  );
}