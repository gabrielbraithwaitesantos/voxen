import { MessageCircle, Scale, Shield } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function AdvancedDebatePage() {
  return (
    <TrackPage
      badge="Elite • Debate"
      title="Debate avançado com estratégia e precisão"
      description="Pratique defesa de tese, antecipação de objeções e posicionamento sob pressão para elevar sua performance argumentativa."
      modules={[
        {
          title: 'Construção de tese',
          description: 'Defina posição central, critérios e estrutura de defesa antes de entrar na discussão.',
          checklist: ['Tese clara em 1 frase', 'Critérios de julgamento definidos', 'Exemplos concretos de apoio'],
          icon: Scale,
        },
        {
          title: 'Contra-argumentação',
          description: 'Treine respostas objetivas a objeções comuns sem perder foco no argumento principal.',
          checklist: ['Antecipar 3 objeções', 'Responder sem digressão', 'Retomar ponto central'],
          icon: Shield,
        },
        {
          title: 'Simulações rápidas',
          description: 'Rodadas curtas para testar clareza, timing e capacidade de síntese em tempo real.',
          checklist: ['Abertura em até 90s', 'Réplica em até 60s', 'Conclusão com chamada final'],
          icon: MessageCircle,
        },
      ]}
      metrics={[
        { label: 'Ritmo sugerido', value: '2 sessões por semana' },
        { label: 'Formato principal', value: 'Debate com réplica', helper: 'Foco em argumento + refutação' },
        { label: 'Meta de evolução', value: 'Maior consistência lógica' },
      ]}
      nextStepTitle="Entrar em simulação"
      nextStepDescription="Use o chat da comunidade para promover mini-debates e validar seu repertório com outras perspectivas."
      nextStepHref="/community/chat"
      nextStepCta="Abrir chat de treino"
      actions={[
        { label: 'Retórica & Escrita', href: '/elite/rhetoric', hint: 'Fortaleça estrutura textual' },
        { label: 'Mentoria', href: '/elite/mentorship', hint: 'Receba feedback direcionado' },
        { label: 'Visão geral Elite', href: '/elite', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
