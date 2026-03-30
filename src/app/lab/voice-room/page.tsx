import { MessageCircle, Voicemail, Users } from 'lucide-react';
import { TrackPage } from '@/components/track-page';

export default function VoiceRoomPage() {
  return (
    <TrackPage
      badge="Laboratório • Voz"
      title="Sala de voz para fluidez e confiança"
      description="Treine pronúncia, escuta e espontaneidade com exercícios curtos e feedback imediato."
      modules={[
        {
          title: 'Aquecimento fonético',
          description: 'Prepare articulação e ritmo antes das rodadas de fala.',
          checklist: ['Entonação em frases curtas', 'Pares mínimos de som', 'Ritmo com pausa consciente'],
          icon: Voicemail,
        },
        {
          title: 'Rodada de conversa',
          description: 'Interações em duplas ou trio para reduzir travas e ganhar naturalidade.',
          checklist: ['Tema definido', 'Tempo de fala por pessoa', 'Troca de feedback rápido'],
          icon: Users,
        },
        {
          title: 'Debrief de melhoria',
          description: 'Consolide aprendizados e defina foco para próxima sessão.',
          checklist: ['Erro principal da sessão', 'Ajuste imediato', 'Objetivo para próxima rodada'],
          icon: MessageCircle,
        },
      ]}
      metrics={[
        { label: 'Formato padrão', value: 'Sessões de 25 minutos' },
        { label: 'Foco principal', value: 'Clareza e naturalidade' },
        { label: 'Critério de progresso', value: 'Menos pausas e mais precisão' },
      ]}
      nextStepTitle="Agendar próxima rodada"
      nextStepDescription="Use o cronograma para reservar uma sessão e manter a cadência semanal de prática oral."
      nextStepHref="/schedule/group-call"
      nextStepCta="Agendar call"
      actions={[
        { label: 'Prática diária', href: '/lab/daily-practice', hint: 'Preparar base antes da call' },
        { label: 'Suporte de base', href: '/lab/support', hint: 'Ajustar dificuldades específicas' },
        { label: 'Visão geral Lab', href: '/lab', hint: 'Voltar ao hub da área' },
      ]}
    />
  );
}
