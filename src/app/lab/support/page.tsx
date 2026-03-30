import { BookOpen, HelpCircle, Pencil } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function SupportPage() {
  return (
    <TrackPage
      badge="Laboratório • Suporte"
      title="Suporte de base para destravar o aprendizado"
      description="Centralize dúvidas, ajuste método de estudo e elimine gargalos que impedem progresso contínuo."
      modules={[
        {
          title: 'Triagem de dúvidas',
          description: 'Classifique a dificuldade para receber orientação no formato correto.',
          checklist: ['Dúvida gramatical', 'Dúvida de vocabulário', 'Dúvida de pronúncia'],
          icon: HelpCircle,
        },
        {
          title: 'Correção guiada',
          description: 'Corrija exemplos reais com foco no erro que mais se repete.',
          checklist: ['Exemplo original', 'Correção explicada', 'Nova tentativa aplicada'],
          icon: Pencil,
        },
        {
          title: 'Biblioteca de apoio',
          description: 'Reforce fundamentos com materiais de referência para consulta rápida.',
          checklist: ['Resumo gramatical', 'Lista de conectores', 'Estruturas úteis de fala'],
          icon: BookOpen,
        },
      ]}
      metrics={[
        { label: 'SLA de resposta', value: 'Até 24h para dúvidas registradas' },
        { label: 'Formato recomendado', value: 'Pergunta + exemplo real' },
        { label: 'Meta da área', value: 'Reduzir erros recorrentes' },
      ]}
      nextStepTitle="Registrar sua principal dúvida"
      nextStepDescription="Abra uma sugestão com contexto objetivo para priorizar o suporte e acompanhar resolução."
      nextStepHref="/community/suggestions"
      nextStepCta="Enviar dúvida"
      actions={[
        { label: 'Prática diária', href: '/lab/daily-practice', hint: 'Aplicar após correção' },
        { label: 'Sala de voz', href: '/lab/voice-room', hint: 'Validar oralmente' },
        { label: 'Visão geral Lab', href: '/lab', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
