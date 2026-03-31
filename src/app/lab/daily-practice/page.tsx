'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Pencil, Voicemail, CheckCircle2, CircleDashed, ArrowUpRight } from 'lucide-react';
import { TrackPage } from '@/components/track-page';
import { useDoc, useFirestore, useMemoFirebase, useUser, doc, updateDoc, collection, setDoc } from '@/firebase';
import { UserProfile } from '@/models/types';
import { useToast } from '@/hooks/use-toast';

export default function DailyPracticePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [firstWord, setFirstWord] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userProfileQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'voxen_v2_users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileQuery);
  const onboarding = userProfile?.onboarding;
  const hasReadGuidelines = Boolean(onboarding?.hasReadGuidelines);
  const hasPostedFirstWord = Boolean(onboarding?.hasPostedFirstDailyPractice);
  const onboardingCompleted = Boolean(onboarding?.completedAt);

  const handleFirstWordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedWord = firstWord.trim();
    if (!normalizedWord || !user || !firestore || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const entryRef = doc(collection(firestore, 'voxen_v2_daily_practice_entries'));
      await setDoc(entryRef, {
        userId: user.uid,
        word: normalizedWord,
        createdAt: new Date().toISOString(),
      });

      const role = userProfile?.role || 'disciple';
      const updatePayload: Record<string, unknown> = {
        'onboarding.hasPostedFirstDailyPractice': true,
      };

      if (hasReadGuidelines) {
        updatePayload['onboarding.completedAt'] = new Date().toISOString();
        updatePayload['access.knowledgeUnlocked'] = true;

        if (role === 'tutor' || role === 'admin') {
          updatePayload['access.eliteUnlocked'] = true;
        }
      }

      await updateDoc(doc(firestore, 'voxen_v2_users', user.uid), updatePayload);
      setFirstWord('');

      toast({
        title: 'Primeira palavra registrada',
        description: hasReadGuidelines
          ? 'Tutorial concluído. Conhecimento liberado.'
          : 'Agora leia as Diretrizes para concluir sua liberação.',
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Falha no registro', description: 'Tente novamente em alguns segundos.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TrackPage
      badge="Laboratório • Prática"
      title="Prática diária com evolução previsível"
      description="Estabeleça uma rotina curta, consistente e mensurável para ampliar vocabulário, leitura e expressão oral."
      modules={[
        {
          title: 'Micro rotina diária',
          description: 'Blocos de estudo objetivos para manter constância mesmo em dias corridos.',
          checklist: ['10 min de leitura', '10 min de escrita', '10 min de revisão ativa'],
          icon: Pencil,
        },
        {
          title: 'Vocabulário aplicado',
          description: 'Aprenda palavras em contexto e reutilize em frases reais.',
          checklist: ['5 termos novos por dia', 'Frases com contexto', 'Revisão no dia seguinte'],
          icon: BookOpen,
        },
        {
          title: 'Treino de fluidez',
          description: 'Consolide produção oral com repetições curtas e foco em clareza.',
          checklist: ['Leitura em voz alta', 'Shadowing por 5 minutos', 'Resumo falado de 60 segundos'],
          icon: Voicemail,
        },
      ]}
      metrics={[
        { label: 'Carga mínima', value: '30 minutos por dia' },
        { label: 'Meta semanal', value: '5 dias de consistência' },
        { label: 'Indicador-chave', value: 'Regularidade acima de intensidade' },
      ]}
      nextStepTitle="Começar sessão de hoje"
      nextStepDescription="Selecione um texto curto e complete um ciclo de leitura, resumo e repetição em voz alta."
      nextStepHref="/lab/voice-room"
      nextStepCta="Abrir sala de voz"
      actions={[
        { label: 'Suporte de base', href: '/lab/support', hint: 'Resolver dúvidas de método' },
        { label: 'Sala de voz', href: '/lab/voice-room', hint: 'Consolidar fluidez oral' },
        { label: 'Visão geral Lab', href: '/lab', hint: 'Voltar ao hub da área' },
      ]}
    >
      <div className="border border-primary/20 bg-black/25 p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-primary/70">Tutorial Inicial Voxen</p>
        <h3 className="mt-3 text-2xl font-black uppercase tracking-wide text-foreground">Checklist de liberação</h3>
        <p className="mt-2 text-sm text-primary/80">
          Para liberar a trilha de Conhecimento, complete as duas ações abaixo: ler Diretrizes e postar sua primeira palavra aqui.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="border border-primary/15 bg-black/25 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary/75">1. Ler Diretrizes</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-foreground/90">
              {hasReadGuidelines ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <CircleDashed className="h-4 w-4 text-primary/60" />}
              {hasReadGuidelines ? 'Concluído' : 'Pendente'}
            </p>
            {!hasReadGuidelines ? (
              <Link
                href="/guidelines"
                className="mt-3 inline-flex items-center gap-1 border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-primary transition-all hover:border-primary hover:text-white"
              >
                Abrir diretrizes
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            ) : null}
          </div>

          <div className="border border-primary/15 bg-black/25 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary/75">2. Primeira Palavra do Dia</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-foreground/90">
              {hasPostedFirstWord ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <CircleDashed className="h-4 w-4 text-primary/60" />}
              {hasPostedFirstWord ? 'Concluído' : 'Pendente'}
            </p>

            {!hasPostedFirstWord ? (
              <form onSubmit={handleFirstWordSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={firstWord}
                  onChange={(event) => setFirstWord(event.target.value)}
                  placeholder="Ex: consistency"
                  className="h-10 flex-1 border border-primary/30 bg-black/30 px-3 text-sm text-foreground outline-none placeholder:text-primary/45 focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!firstWord.trim() || isSubmitting}
                  className="h-10 border border-primary/35 bg-primary/10 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-primary transition-all hover:border-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Registrar'}
                </button>
              </form>
            ) : null}
          </div>
        </div>

        {onboardingCompleted ? (
          <div className="mt-4 border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Tutorial concluído. Sua trilha de Conhecimento está liberada.
          </div>
        ) : null}
      </div>
    </TrackPage>
  );
}
