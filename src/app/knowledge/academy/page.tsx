import { BookOpen, School, Users } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function AcademyPage() {
  return (
    <TrackPage
      badge="Conhecimento • Academia"
      title="Academia Voxen para evolução estruturada"
      description="Ambiente de estudo guiado com trilhas progressivas para consolidar repertório e pensamento crítico."
      modules={[
        {
          title: 'Trilha fundamental',
          description: 'Construa base sólida antes de avançar para conteúdos de maior complexidade.',
          checklist: ['Leitura orientada', 'Resumo de conceitos', 'Aplicação em exemplo real'],
          icon: School,
        },
        {
          title: 'Estudo ativo',
          description: 'Transforme conteúdo absorvido em conhecimento utilizável.',
          checklist: ['Perguntas-chave', 'Mapa mental curto', 'Revisão em 24h'],
          icon: BookOpen,
        },
        {
          title: 'Discussão aplicada',
          description: 'Valide entendimento com debate e troca entre membros.',
          checklist: ['Tópico da semana', 'Ponto de vista defendido', 'Feedback de pares'],
          icon: Users,
        },
      ]}
      metrics={[
        { label: 'Ritmo recomendado', value: '3 sessões por semana' },
        { label: 'Formato ideal', value: 'Estudo + síntese + aplicação' },
        { label: 'Meta da trilha', value: 'Domínio progressivo de base' },
      ]}
      nextStepTitle="Escolher módulo da semana"
      nextStepDescription="Defina um tema central e transforme em plano de estudo com entregáveis curtos."
      nextStepHref="/knowledge"
      nextStepCta="Voltar ao hub de conhecimento"
      actions={[
        { label: 'Ethos & Logos', href: '/knowledge/ethos-logos', hint: 'Aprimorar argumentação' },
        { label: 'Apologética', href: '/knowledge/apologetics', hint: 'Defesa racional de ideias' },
        { label: 'Automação & IA', href: '/knowledge/automation-ai', hint: 'Aplicação prática com tecnologia' },
      ]}
    />
  );
}
