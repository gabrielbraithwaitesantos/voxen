import { Calendar, Video, Users } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function GroupCallPage() {
  return (
    <TrackPage
      badge="Cronograma • Grupo"
      title="Calls em grupo para alinhamento e prática"
      description="Participe de encontros coletivos com pauta clara, dinâmica de participação e fechamento com próximos passos."
      modules={[
        {
          title: 'Pré-call estratégico',
          description: 'Chegue com contexto e objetivo para aproveitar melhor o encontro.',
          checklist: ['Ler pauta com antecedência', 'Levar 1 dúvida objetiva', 'Definir meta pessoal da call'],
          icon: Calendar,
        },
        {
          title: 'Condução da sessão',
          description: 'Ritmo equilibrado entre conteúdo, interação e aplicação prática.',
          checklist: ['Abertura com contexto', 'Rodada de participação', 'Conclusão com síntese'],
          icon: Video,
        },
        {
          title: 'Pós-call acionável',
          description: 'Converta aprendizados da sessão em tarefas para a semana.',
          checklist: ['Resumo em 3 pontos', 'Ação pessoal definida', 'Compartilhamento com o grupo'],
          icon: Users,
        },
      ]}
      metrics={[
        { label: 'Duração padrão', value: '45 a 60 minutos' },
        { label: 'Frequência ideal', value: '1 call coletiva por semana' },
        { label: 'Meta de presença', value: 'Acima de 80%' },
      ]}
      nextStepTitle="Confirmar presença"
      nextStepDescription="Anote sua participação e prepare a principal contribuição que levará para o próximo encontro."
      nextStepHref="/community/chat"
      nextStepCta="Avisar no chat"
      actions={[
        { label: 'Agenda semanal', href: '/schedule/weekly', hint: 'Organizar blocos da semana' },
        { label: 'Agendamento 1-on-1', href: '/schedule/one-on-one', hint: 'Aprofundar pontos críticos' },
        { label: 'Visão geral Cronograma', href: '/schedule', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
