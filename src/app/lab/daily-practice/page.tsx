import { BookOpen, Pencil, Voicemail } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function DailyPracticePage() {
  return (
    <TrackPage
      badge="Laboratório • Prática"
      title="Prática diária com evolução previsível"
      description="Estabeleça uma rotina curta, consistente e mensurável para ampliar vocabulário, leitura e expressão oral."
      modules={[
        {
          title: 'Micro rotina diária',
          description: 'Blocos de estudo objetivos para manter constância mesmo em dias corridos.',
          checklist: ['10 min de leitura', '10 min de escrita', '10 min de revisão ativa'],
          icon: Pencil,
        },
        {
          title: 'Vocabulário aplicado',
          description: 'Aprenda palavras em contexto e reutilize em frases reais.',
          checklist: ['5 termos novos por dia', 'Frases com contexto', 'Revisão no dia seguinte'],
          icon: BookOpen,
        },
        {
          title: 'Treino de fluidez',
          description: 'Consolide produção oral com repetições curtas e foco em clareza.',
          checklist: ['Leitura em voz alta', 'Shadowing por 5 minutos', 'Resumo falado de 60 segundos'],
          icon: Voicemail,
        },
      ]}
      metrics={[
        { label: 'Carga mínima', value: '30 minutos por dia' },
        { label: 'Meta semanal', value: '5 dias de consistência' },
        { label: 'Indicador-chave', value: 'Regularidade acima de intensidade' },
      ]}
      nextStepTitle="Começar sessão de hoje"
      nextStepDescription="Selecione um texto curto e complete um ciclo de leitura, resumo e repetição em voz alta."
      nextStepHref="/lab/voice-room"
      nextStepCta="Abrir sala de voz"
      actions={[
        { label: 'Suporte de base', href: '/lab/support', hint: 'Resolver dúvidas de método' },
        { label: 'Sala de voz', href: '/lab/voice-room', hint: 'Consolidar fluidez oral' },
        { label: 'Visão geral Lab', href: '/lab', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
