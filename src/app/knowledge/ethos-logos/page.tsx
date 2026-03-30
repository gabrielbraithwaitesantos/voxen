import { MessageCircle, PenTool, Scale } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function EthosLogosPage() {
  return (
    <TrackPage
      badge="Conhecimento • Ethos & Logos"
      title="Ethos e logos para argumentação sólida"
      description="Aprenda a combinar credibilidade, lógica e clareza para se comunicar com precisão e autoridade."
      modules={[
        {
          title: 'Ethos: autoridade e postura',
          description: 'Construa confiança por meio de coerência, responsabilidade e domínio do tema.',
          checklist: ['Posicionamento consistente', 'Tom respeitoso', 'Referências confiáveis'],
          icon: PenTool,
        },
        {
          title: 'Logos: estrutura lógica',
          description: 'Organize argumentos por premissas, evidências e conclusão.',
          checklist: ['Premissas claras', 'Evidência verificável', 'Conclusão necessária'],
          icon: Scale,
        },
        {
          title: 'Aplicação em diálogo',
          description: 'Treine uso prático dos princípios em conversas e debates.',
          checklist: ['Resposta objetiva', 'Exemplo concreto', 'Síntese final em 1 frase'],
          icon: MessageCircle,
        },
      ]}
      metrics={[
        { label: 'Competência alvo', value: 'Argumento claro e defensável' },
        { label: 'Rotina recomendada', value: '2 exercícios de tese por semana' },
        { label: 'Padrão esperado', value: 'Menos opinião solta, mais estrutura' },
      ]}
      nextStepTitle="Escrever tese de treino"
      nextStepDescription="Formule uma tese em três linhas com premissas e evidência, depois valide com alguém da comunidade."
      nextStepHref="/community/chat"
      nextStepCta="Compartilhar no chat"
      actions={[
        { label: 'Apologética', href: '/knowledge/apologetics', hint: 'Defesa racional aplicada' },
        { label: 'Retórica & escrita', href: '/elite/rhetoric', hint: 'Lapidar comunicação' },
        { label: 'Visão geral Conhecimento', href: '/knowledge', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
