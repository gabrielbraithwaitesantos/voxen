import { Calendar, LineChart, Users } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function WeeklySchedulePage() {
  return (
    <TrackPage
      badge="Cronograma • Semanal"
      title="Agenda semanal com execução previsível"
      description="Organize prioridades da semana com blocos de estudo, calls e revisões para manter evolução contínua."
      modules={[
        {
          title: 'Planejamento de blocos',
          description: 'Defina horários fixos para prática, revisão e interação com a comunidade.',
          checklist: ['Bloco de estudo', 'Bloco de prática oral', 'Bloco de revisão'],
          icon: Calendar,
        },
        {
          title: 'Ritmo de acompanhamento',
          description: 'Use checkpoints para ajustar carga e manter consistência.',
          checklist: ['Revisão de meio de semana', 'Ajuste de prioridades', 'Check final de resultado'],
          icon: LineChart,
        },
        {
          title: 'Integração em grupo',
          description: 'Conecte sua agenda aos encontros coletivos para acelerar aprendizagem.',
          checklist: ['Participação em call', 'Resumo pós encontro', 'Ação para semana seguinte'],
          icon: Users,
        },
      ]}
      metrics={[
        { label: 'Meta mínima', value: '5 blocos produtivos por semana' },
        { label: 'Ritual recomendado', value: 'Planejar domingo, revisar sexta' },
        { label: 'Indicador principal', value: 'Assiduidade + execução' },
      ]}
      nextStepTitle="Definir prioridade da semana"
      nextStepDescription="Escolha um objetivo central e distribua os blocos no calendário antes da segunda-feira."
      nextStepHref="/home"
      nextStepCta="Voltar à Home"
      actions={[
        { label: 'Call em grupo', href: '/schedule/group-call', hint: 'Acompanhar evolução coletiva' },
        { label: 'Agendamento 1-on-1', href: '/schedule/one-on-one', hint: 'Ajustes personalizados' },
        { label: 'Visão geral Cronograma', href: '/schedule', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
