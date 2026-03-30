import { BookOpen, LineChart, Shield } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function CapitalManagementPage() {
  return (
    <TrackPage
      badge="Conhecimento • Capital"
      title="Gestão de capital com visão estratégica"
      description="Fortaleça decisões financeiras com leitura de cenário, disciplina de execução e gestão de risco."
      modules={[
        {
          title: 'Fundamentos financeiros',
          description: 'Consolide noções de caixa, reserva e planejamento de curto e médio prazo.',
          checklist: ['Controle de entradas/saídas', 'Reserva de segurança', 'Objetivos com prazo definido'],
          icon: BookOpen,
        },
        {
          title: 'Risco e proteção',
          description: 'Adote critérios para evitar decisões impulsivas e preservar capital.',
          checklist: ['Regra de exposição máxima', 'Cenário base e alternativo', 'Plano de contingência'],
          icon: Shield,
        },
        {
          title: 'Leitura de performance',
          description: 'Monitore resultados para ajustar estratégia com consistência.',
          checklist: ['Revisão mensal', 'Métricas de evolução', 'Correção de rota'],
          icon: LineChart,
        },
      ]}
      metrics={[
        { label: 'Hábito central', value: 'Registrar decisões e resultados' },
        { label: 'Revisão sugerida', value: 'Fechamento financeiro semanal' },
        { label: 'Objetivo da trilha', value: 'Consistência e previsibilidade' },
      ]}
      nextStepTitle="Abrir revisão da semana"
      nextStepDescription="Liste as principais decisões financeiras recentes e identifique um ajuste imediato para próxima semana."
      nextStepHref="/schedule/weekly"
      nextStepCta="Ver agenda semanal"
      actions={[
        { label: 'Automação & IA', href: '/knowledge/automation-ai', hint: 'Automatizar controle financeiro' },
        { label: 'Sistemas do mundo', href: '/knowledge/world-systems', hint: 'Ler contexto macroeconômico' },
        { label: 'Visão geral Conhecimento', href: '/knowledge', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
