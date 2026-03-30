import { HelpCircle, Pencil, Voicemail } from 'lucide-react';
import { SectionOverview } from '@/components/section-overview';

export default function LabOverviewPage() {
  return (
    <SectionOverview
      badge="Laboratório"
      title="Treino prático diário para fluidez no inglês"
      description="Consolide hábitos de evolução com prática guiada, suporte contínuo e sessões focadas em pronúncia e confiança."
      spotlightTitle="Iniciar prática diária"
      spotlightDescription="Sessões curtas e consistentes geram avanço real em vocabulário, escuta e produção oral."
      spotlightHref="/lab/daily-practice"
      spotlightCta="Praticar agora"
      links={[
        {
          title: 'Prática Diária',
          description: 'Rotina de exercícios para progresso contínuo.',
          href: '/lab/daily-practice',
          icon: Pencil,
        },
        {
          title: 'Suporte de Base',
          description: 'Tire dúvidas, alinhe método e remova bloqueios.',
          href: '/lab/support',
          icon: HelpCircle,
        },
        {
          title: 'Sala de Voz',
          description: 'Treino ativo de fala, escuta e correção ao vivo.',
          href: '/lab/voice-room',
          icon: Voicemail,
        },
      ]}
      stats={[
        { label: 'Diretriz da Área', value: 'Consistência supera intensidade' },
        { label: 'Cadência Recomendada', value: '20 a 30 minutos por dia' },
        { label: 'Objetivo Principal', value: 'Fluidez com confiança' },
      ]}
    />
  );
}