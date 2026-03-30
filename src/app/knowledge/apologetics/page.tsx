import { BookOpen, Scale, Shield } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function ApologeticsPage() {
  return (
    <TrackPage
      badge="Conhecimento • Apologética"
      title="Apologética com base histórica e lógica"
      description="Desenvolva capacidade de defender convicções com clareza, respeito e consistência argumentativa."
      modules={[
        {
          title: 'Fundamentos da defesa',
          description: 'Compreenda princípios de argumentação ética e responsabilidade intelectual.',
          checklist: ['Definir tese central', 'Separar fato de opinião', 'Sustentar com referências'],
          icon: Shield,
        },
        {
          title: 'Estrutura de resposta',
          description: 'Treine respostas objetivas para perguntas complexas.',
          checklist: ['Contextualizar a pergunta', 'Responder com lógica', 'Concluir com clareza'],
          icon: Scale,
        },
        {
          title: 'Base documental',
          description: 'Use fontes confiáveis para fortalecer a qualidade do argumento.',
          checklist: ['Leitura de fontes primárias', 'Notas de referência', 'Síntese em linguagem simples'],
          icon: BookOpen,
        },
      ]}
      metrics={[
        { label: 'Objetivo principal', value: 'Defesa racional sem agressividade' },
        { label: 'Cadência de estudo', value: '2 a 3 sessões por semana' },
        { label: 'Padrão de qualidade', value: 'Clareza, evidência e coerência' },
      ]}
      nextStepTitle="Preparar resposta de referência"
      nextStepDescription="Escreva uma resposta curta para uma questão frequente e revise com base em evidências."
      nextStepHref="/elite/rhetoric"
      nextStepCta="Refinar escrita"
      actions={[
        { label: 'Ethos & Logos', href: '/knowledge/ethos-logos', hint: 'Aprofundar estrutura lógica' },
        { label: 'Academia', href: '/knowledge/academy', hint: 'Consolidar base teórica' },
        { label: 'Visão geral Conhecimento', href: '/knowledge', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
