import { MessageCircle, PenTool, Scale } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function RhetoricPage() {
  return (
    <TrackPage
      badge="Elite • Retórica"
      title="Retórica e escrita para alta influência"
      description="Desenvolva comunicação persuasiva com estrutura lógica, linguagem precisa e ritmo narrativo."
      modules={[
        {
          title: 'Arquitetura de argumento',
          description: 'Organize abertura, sustentação e conclusão para conduzir a audiência com clareza.',
          checklist: ['Gancho inicial forte', '3 pilares de sustentação', 'Fechamento com síntese'],
          icon: Scale,
        },
        {
          title: 'Estilo e impacto',
          description: 'Ajuste ritmo, vocabulário e tom para cada contexto de comunicação.',
          checklist: ['Frases mais diretas', 'Eliminação de ruído', 'Ênfase nos pontos críticos'],
          icon: PenTool,
        },
        {
          title: 'Validação em prática',
          description: 'Teste argumentos em conversas e apresentações curtas para consolidar habilidade.',
          checklist: ['Pitch de 2 minutos', 'Reescrita após feedback', 'Iteração semanal'],
          icon: MessageCircle,
        },
      ]}
      metrics={[
        { label: 'Entrega recomendada', value: '1 texto estratégico por semana' },
        { label: 'Tempo de treino', value: '30 minutos por sessão' },
        { label: 'Indicador principal', value: 'Clareza e poder de síntese' },
      ]}
      nextStepTitle="Publicar um texto curto"
      nextStepDescription="Compartilhe uma tese resumida no chat para testar clareza e receber retorno objetivo dos membros."
      nextStepHref="/community/chat"
      nextStepCta="Publicar no chat"
      actions={[
        { label: 'Debate avançado', href: '/elite/debate', hint: 'Aplicar em argumentação ao vivo' },
        { label: 'Mentoria', href: '/elite/mentorship', hint: 'Receber correções direcionadas' },
        { label: 'Visão geral Elite', href: '/elite', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
