import { Calendar, Clipboard, UserPlus } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function OneOnOnePage() {
  return (
    <TrackPage
      badge="Cronograma • 1-on-1"
      title="Sessões individuais para ajuste de alto impacto"
      description="Reserve encontros personalizados para tratar bloqueios específicos e acelerar resultados com foco individual."
      modules={[
        {
          title: 'Pré-brief da sessão',
          description: 'Leve contexto objetivo para tornar o encontro mais produtivo.',
          checklist: ['Objetivo da sessão', 'Dificuldade principal', 'Exemplo real para análise'],
          icon: Clipboard,
        },
        {
          title: 'Condução personalizada',
          description: 'Foco no seu estágio atual, com correções e direcionamento direto.',
          checklist: ['Diagnóstico do momento', 'Correção priorizada', 'Plano de treino imediato'],
          icon: UserPlus,
        },
        {
          title: 'Follow-up semanal',
          description: 'Mantenha evolução entre sessões com checkpoints objetivos.',
          checklist: ['Ação da semana registrada', 'Métrica de acompanhamento', 'Data da próxima revisão'],
          icon: Calendar,
        },
      ]}
      metrics={[
        { label: 'Formato recomendado', value: '30 a 40 minutos' },
        { label: 'Objetivo principal', value: 'Resolver bloqueios críticos' },
        { label: 'Cadência sugerida', value: '1 sessão quinzenal' },
      ]}
      nextStepTitle="Preparar pauta da sessão"
      nextStepDescription="Defina o foco principal do 1-on-1 para que a sessão gere ações práticas no mesmo dia."
      nextStepHref="/profile"
      nextStepCta="Atualizar foco no perfil"
      actions={[
        { label: 'Agenda semanal', href: '/schedule/weekly', hint: 'Sincronizar com rotina' },
        { label: 'Call em grupo', href: '/schedule/group-call', hint: 'Complementar com visão coletiva' },
        { label: 'Visão geral Cronograma', href: '/schedule', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
