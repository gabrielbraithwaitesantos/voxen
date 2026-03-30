import { Award, Lightbulb, MessageSquare } from 'lucide-react';
import { SectionOverview } from '@/components/section-overview';

export default function CommunityOverviewPage() {
  return (
    <SectionOverview
      badge="Comunidade"
      title="Coordenação, troca de ideias e reconhecimento"
      description="O núcleo de comunidade concentra conversas operacionais, sugestões de melhoria e evolução por conquistas desbloqueadas."
      spotlightTitle="Abrir o chat geral"
      spotlightDescription="Conduza alinhamentos rápidos, compartilhe decisões e mantenha toda a equipe no mesmo contexto."
      spotlightHref="/community/chat"
      spotlightCta="Entrar no chat"
      links={[
        {
          title: 'Chat Geral',
          description: 'Canal central para comunicação diária e alinhamentos rápidos.',
          href: '/community/chat',
          icon: MessageSquare,
        },
        {
          title: 'Sugestões',
          description: 'Espaço para melhorias da plataforma e novas propostas.',
          href: '/community/suggestions',
          icon: Lightbulb,
        },
        {
          title: 'Conquistas',
          description: 'Acompanhe selos desbloqueados e marcos de participação.',
          href: '/community/achievements',
          icon: Award,
        },
      ]}
      stats={[
        { label: 'Foco da Semana', value: 'Engajamento e disciplina' },
        { label: 'Objetivo Imediato', value: 'Publicar 1 contribuição útil por dia' },
        { label: 'Modo da Área', value: 'Colaboração estratégica' },
      ]}
    />
  );
}