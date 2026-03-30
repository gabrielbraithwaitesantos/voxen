import { Clipboard, MessageCircle, PenTool } from 'lucide-react';
import { SectionOverview } from '@/components/section-overview';

export default function EliteOverviewPage() {
  return (
    <SectionOverview
      badge="Hub de Elite"
      title="Treinamento avançado para comunicação de alto impacto"
      description="Aprimore escrita, debate e capacidade de apresentar ideias com consistência, elegância e precisão."
      spotlightTitle="Abrir retórica e escrita"
      spotlightDescription="Treino estruturado para transformar conhecimento em comunicação clara e influente."
      spotlightHref="/elite/rhetoric"
      spotlightCta="Treinar retórica"
      links={[
        {
          title: 'Retórica & Escrita',
          description: 'Organize argumentos e fortaleça estilo textual.',
          href: '/elite/rhetoric',
          icon: PenTool,
        },
        {
          title: 'Debate Avançado',
          description: 'Estratégias para defesa e contra-argumentação em alto nível.',
          href: '/elite/debate',
          icon: MessageCircle,
        },
        {
          title: 'Mentoria & Feedback',
          description: 'Acompanhamento individual para evolução contínua.',
          href: '/elite/mentorship',
          icon: Clipboard,
        },
      ]}
      stats={[
        { label: 'Pilar da Área', value: 'Consistência argumentativa' },
        { label: 'Meta de Evolução', value: '1 entrega de escrita por semana' },
        { label: 'Nível de Intensidade', value: 'Avançado' },
      ]}
    />
  );
}