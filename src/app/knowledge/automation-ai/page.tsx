import { BookOpen, Cpu, LineChart } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function AutomationAiPage() {
  return (
    <TrackPage
      badge="Conhecimento • Automação"
      title="Automação e IA para produtividade real"
      description="Aplique ferramentas de IA e automação no fluxo de estudo e execução para gerar mais resultado com menos retrabalho."
      modules={[
        {
          title: 'Mapeamento de processos',
          description: 'Identifique tarefas repetitivas que podem ser simplificadas.',
          checklist: ['Listar tarefas recorrentes', 'Identificar gargalos', 'Priorizar automações simples'],
          icon: Cpu,
        },
        {
          title: 'Prompts e workflows',
          description: 'Estruture interações com IA para obter saídas consistentes.',
          checklist: ['Prompt com contexto', 'Formato de saída definido', 'Validação da resposta'],
          icon: BookOpen,
        },
        {
          title: 'Medição de impacto',
          description: 'Acompanhe ganho de tempo e qualidade após cada automação.',
          checklist: ['Tempo antes/depois', 'Qualidade da entrega', 'Próxima melhoria'],
          icon: LineChart,
        },
      ]}
      metrics={[
        { label: 'Meta inicial', value: 'Automatizar 1 rotina por semana' },
        { label: 'Critério de sucesso', value: 'Menos retrabalho, mais consistência' },
        { label: 'Foco da trilha', value: 'Aplicação prática no dia a dia' },
      ]}
      nextStepTitle="Escolher um processo repetitivo"
      nextStepDescription="Documente um fluxo manual que você executa toda semana e desenhe a primeira versão automatizada."
      nextStepHref="/home"
      nextStepCta="Voltar ao painel"
      actions={[
        { label: 'Gestão de capital', href: '/knowledge/capital-management', hint: 'Aplicar automação em controle financeiro' },
        { label: 'Academia', href: '/knowledge/academy', hint: 'Integrar com trilha de estudo' },
        { label: 'Visão geral Conhecimento', href: '/knowledge', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
