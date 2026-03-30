import { Globe, LineChart, Shield } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function WorldSystemsPage() {
  return (
    <TrackPage
      badge="Conhecimento • Sistemas do Mundo"
      title="Sistemas do mundo para leitura de contexto"
      description="Entenda dinâmicas geopolíticas, econômicas e culturais para tomar decisões com visão mais ampla."
      modules={[
        {
          title: 'Panorama geopolítico',
          description: 'Acompanhe forças e interesses que moldam cenário global.',
          checklist: ['Atores centrais', 'Tensões principais', 'Impactos regionais'],
          icon: Globe,
        },
        {
          title: 'Sinais econômicos',
          description: 'Interprete tendências macro para antecipar efeitos locais.',
          checklist: ['Inflação e juros', 'Mercado de trabalho', 'Ciclos de investimento'],
          icon: LineChart,
        },
        {
          title: 'Risco e resiliência',
          description: 'Desenvolva leitura de risco para decisões mais robustas.',
          checklist: ['Cenário base', 'Cenário adverso', 'Estratégia de mitigação'],
          icon: Shield,
        },
      ]}
      metrics={[
        { label: 'Frequência ideal', value: '1 revisão de cenário por semana' },
        { label: 'Formato de análise', value: 'Fato → impacto → decisão' },
        { label: 'Resultado esperado', value: 'Maior visão sistêmica' },
      ]}
      nextStepTitle="Montar leitura da semana"
      nextStepDescription="Selecione um evento global recente e registre possíveis impactos em aprendizado, carreira e finanças."
      nextStepHref="/knowledge/capital-management"
      nextStepCta="Conectar com capital"
      actions={[
        { label: 'Automação & IA', href: '/knowledge/automation-ai', hint: 'Monitorar sinais com mais eficiência' },
        { label: 'Academia', href: '/knowledge/academy', hint: 'Consolidar fundamentos teóricos' },
        { label: 'Visão geral Conhecimento', href: '/knowledge', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
