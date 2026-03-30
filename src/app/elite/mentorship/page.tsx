import { Clipboard, MessageCircle, PenTool } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function MentorshipPage() {
  return (
    <TrackPage
      badge="Elite • Mentoria"
      title="Mentoria com feedback acionável"
      description="Transforme prática em evolução concreta com ciclos curtos de revisão, correção e novos testes de performance."
      modules={[
        {
          title: 'Diagnóstico inicial',
          description: 'Mapeie pontos fortes e gargalos para direcionar o treino nas próximas semanas.',
          checklist: ['Objetivo da semana', 'Bloqueio principal identificado', 'Indicador de progresso definido'],
          icon: Clipboard,
        },
        {
          title: 'Feedback estruturado',
          description: 'Receba retorno por critérios claros para não depender de avaliações subjetivas.',
          checklist: ['Clareza', 'Consistência lógica', 'Impacto na comunicação'],
          icon: MessageCircle,
        },
        {
          title: 'Plano de ajuste',
          description: 'Converta feedback em ações práticas para a semana seguinte.',
          checklist: ['1 hábito para manter', '1 erro para corrigir', '1 exercício de reforço'],
          icon: PenTool,
        },
      ]}
      metrics={[
        { label: 'Modelo de ciclo', value: 'Diagnóstico → Ajuste → Reavaliação' },
        { label: 'Cadência ideal', value: '1 mentoria semanal' },
        { label: 'Foco de curto prazo', value: 'Correção de padrões repetitivos' },
      ]}
      nextStepTitle="Registrar objetivo da semana"
      nextStepDescription="Anote no seu perfil o foco atual para facilitar acompanhamento e comparação com ciclos anteriores."
      nextStepHref="/profile"
      nextStepCta="Atualizar objetivo"
      actions={[
        { label: 'Debate avançado', href: '/elite/debate', hint: 'Aplicar feedback em simulação' },
        { label: 'Retórica & escrita', href: '/elite/rhetoric', hint: 'Refinar comunicação escrita' },
        { label: 'Visão geral Elite', href: '/elite', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
