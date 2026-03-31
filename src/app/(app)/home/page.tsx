'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useUser, useFirestore, useCollection, useMemoFirebase, collection, query, orderBy, doc, useStorage, useDoc, updateDoc } from '@/firebase';
import { createMessage, deleteMessage, unlockAchievement } from '@/firebase/actions';
import { MessageForm } from '@/components/message-form';
import { MessageList } from '@/components/message-list';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/models/types';
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Compass,
  FlaskConical,
  ImageIcon,
  Loader2,
  Mic,
  MessageSquareText,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { BackgroundMusic } from '@/components/ui/background-music';

export interface Message {
  id: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  imagePath?: string;
  audioUrl?: string;
  audioPath?: string;
  timestamp: any;
  likes: string[];
  status?: 'sending' | 'sent' | 'failed';
}

const parseMessageDate = (timestamp: any): Date | null => {
  if (!timestamp) return null;

  if (typeof timestamp === 'object' && typeof timestamp.toDate === 'function') {
    const fromFirebase = timestamp.toDate();
    return Number.isNaN(fromFirebase?.getTime?.()) ? null : fromFirebase;
  }

  const fromString = new Date(timestamp);
  return Number.isNaN(fromString.getTime()) ? null : fromString;
};

export default function HomePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const hasMarkedWelcomeRef = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [playEntrance, setPlayEntrance] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = hasHydrated && Boolean(prefersReducedMotion);
  const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const getEntranceMotion = (delay: number, y = 18) => ({
    initial: false,
    animate: playEntrance
      ? { opacity: 1, y: 0 }
      : shouldReduceMotion
        ? { opacity: 0 }
        : { opacity: 0, y },
    transition: shouldReduceMotion
      ? { duration: 0.18, delay }
      : { duration: 0.7, delay, ease: easeCurve },
  });
  const getStaggerMotion = (baseDelay: number, index: number) => ({
    initial: false,
    animate: playEntrance
      ? { opacity: 1, y: 0 }
      : shouldReduceMotion
        ? { opacity: 0 }
        : { opacity: 0, y: 14 },
    transition: shouldReduceMotion
      ? { duration: 0.16, delay: baseDelay + index * 0.025 }
      : { duration: 0.45, delay: baseDelay + index * 0.06, ease: easeCurve },
  });
  
  const [currentUser, setCurrentUser] = useState<string>('Agente Principal');

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setCurrentUser(stored);
    setHasHydrated(true);

    const frame = window.requestAnimationFrame(() => {
      setPlayEntrance(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voxen_v2_messages'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore]);

  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

  const userProfileQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'voxen_v2_users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileQuery);

  useEffect(() => {
    if (userProfile?.displayName) {
      setCurrentUser(userProfile.displayName);
      localStorage.setItem('username', userProfile.displayName);
      return;
    }

    if (userProfile?.voxenId) {
      const normalized = userProfile.voxenId.toUpperCase();
      setCurrentUser(normalized);
      localStorage.setItem('username', normalized);
    }
  }, [userProfile?.displayName, userProfile?.voxenId]);

  useEffect(() => {
    if (!user || !firestore || !userProfile || hasMarkedWelcomeRef.current || userProfile.onboarding?.hasSeenWelcome) {
      return;
    }

    hasMarkedWelcomeRef.current = true;
    updateDoc(doc(firestore, 'voxen_v2_users', user.uid), {
      'onboarding.hasSeenWelcome': true,
    }).catch(() => {
      hasMarkedWelcomeRef.current = false;
    });
  }, [user, firestore, userProfile]);

  const onboarding = userProfile?.onboarding;
  const onboardingReadGuidelines = Boolean(onboarding?.hasReadGuidelines);
  const onboardingPostedWord = Boolean(onboarding?.hasPostedFirstDailyPractice);
  const onboardingCompleted = Boolean(onboarding?.completedAt);
  const profileRole = userProfile?.role || 'disciple';
  const profileRoleLabel = profileRole === 'tutor' ? 'Tutor' : profileRole === 'admin' ? 'Admin' : 'Discípulo';

  const operationMetrics = useMemo(() => {
    const source = messages || [];
    const now = Date.now();

    let mediaCount = 0;
    let audioCount = 0;
    let textOnlyCount = 0;
    let last24HoursCount = 0;

    source.forEach((message) => {
      if (message.imageUrl) mediaCount += 1;
      if (message.audioUrl) audioCount += 1;
      if (message.text && !message.imageUrl && !message.audioUrl) textOnlyCount += 1;

      const date = parseMessageDate(message.timestamp);
      if (date && now - date.getTime() <= 24 * 60 * 60 * 1000) {
        last24HoursCount += 1;
      }
    });

    return {
      totalCount: source.length,
      mediaCount,
      audioCount,
      textOnlyCount,
      last24HoursCount,
    };
  }, [messages]);

  const operationalAreas: Array<{
    title: string;
    description: string;
    href: Route;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }> = [
    {
      title: 'Comunidade',
      description: 'Chat, sugestões e conquistas da tropa.',
      href: '/community',
      icon: Users,
      badge: 'Colaboração',
    },
    {
      title: 'Conhecimento',
      description: 'Trilhas de estudo com foco estratégico.',
      href: '/knowledge',
      icon: BookOpen,
      badge: 'Estudo',
    },
    {
      title: 'Elite',
      description: 'Retórica, debate e mentoria avançada.',
      href: '/elite',
      icon: Trophy,
      badge: 'Performance',
    },
    {
      title: 'Laboratório',
      description: 'Prática diária e treino de voz.',
      href: '/lab',
      icon: FlaskConical,
      badge: 'Prática',
    },
    {
      title: 'Agenda',
      description: 'Planejamento semanal e calls de acompanhamento.',
      href: '/schedule',
      icon: CalendarClock,
      badge: 'Ritmo',
    },
  ];

  const quickActions: Array<{
    title: string;
    hint: string;
    href: Route;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { title: 'Linha do Tempo', hint: 'Atualize marcos históricos', href: '/timeline', icon: Compass },
    { title: 'Galeria', hint: 'Suba novas evidências visuais', href: '/gallery', icon: ImageIcon },
    { title: 'Avisos', hint: 'Comunique decisões oficiais', href: '/announcements', icon: MessageSquareText },
    { title: 'Chat Geral', hint: 'Coordenação entre membros', href: '/community/chat', icon: Users },
  ];

  const handleNewMessage = async (data: { text?: string; imageFile?: File; audioFile?: File }) => {
    if (!firestore || !storage || !user) return;

    const newDocRef = doc(collection(firestore, 'voxen_v2_messages'));
    try {
      await createMessage(firestore, storage, newDocRef, currentUser, data);
      // Unlock first message achievement
      await unlockAchievement(firestore, user.uid, 'first-message').catch(console.warn);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Protocolo Falhou",
        description: "Falha ao registrar relatório no Dossiê Digital.",
      });
    }
  };

  const handleDeleteMessage = async (message: Message) => {
    if (!firestore || !storage) return;
    try {
      await deleteMessage(firestore, storage, message.id, message.imagePath, message.audioPath);
      toast({ title: "Arquivo Eliminado", description: "O registro foi removido permanentemente." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro na Operação" });
    }
  };

  const handleToggleLike = async (messageId: string) => {
    // Logic for verification signatures...
  };

  return (
    <div className="relative min-h-full bg-[#05080c] font-body selection:bg-primary selection:text-primary-foreground">
      <BackgroundMusic />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-[-8%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-8%] h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(161,138,90,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,138,90,0.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <motion.main
        className="relative mx-auto w-full max-w-[1400px] px-4 pb-20 pt-10 sm:px-8"
        initial={false}
        animate={playEntrance ? { opacity: 1, y: 0 } : shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        transition={shouldReduceMotion ? { duration: 0.2 } : { duration: 0.55, ease: easeCurve }}
      >
        <motion.section
          className="overflow-hidden border border-primary/20 bg-black/35 px-6 py-8 shadow-[0_18px_70px_rgba(0,0,0,0.35)] md:px-10 md:py-10"
          {...getEntranceMotion(0.08, 20)}
        >
          <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr] xl:items-end">
            <motion.div {...getEntranceMotion(0.14, 16)}>
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Painel de Comando
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl">
                Home Operacional Voxen
              </h1>
              <p className="mt-5 max-w-2xl text-base italic leading-relaxed text-primary sm:text-lg">
                Visualize o pulso da comunidade, navegue pelas trilhas essenciais e registre novos relatórios sem sair do centro de operações.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <motion.div key={action.title} {...getStaggerMotion(0.2, index)}>
                      <Link
                        href={action.href}
                        className="group inline-flex items-center gap-3 border border-primary/30 bg-black/35 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:border-primary hover:text-foreground"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{action.title}</span>
                        <ArrowUpRight className="h-4 w-4 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="border border-primary/25 bg-[#0a0f18] p-6 shadow-2xl"
              {...getEntranceMotion(0.18, 12)}
            >
              <div className="flex items-center justify-between border-b border-primary/15 pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Operador Ativo</p>
                  <p className="mt-2 text-xl font-black uppercase tracking-wider text-foreground">{currentUser}</p>
                </div>
                <div className="relative flex h-12 w-12 items-center justify-center border border-primary/40 bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="border border-primary/15 bg-black/20 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Total de Dossiês</p>
                  <p className="mt-1 text-2xl font-black text-foreground">{operationMetrics.totalCount}</p>
                </div>
                <div className="border border-primary/15 bg-black/20 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Últimas 24h</p>
                  <p className="mt-1 text-2xl font-black text-foreground">{operationMetrics.last24HoursCount}</p>
                </div>
                <div className="border border-primary/15 bg-black/20 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Com Imagem</p>
                  <p className="mt-1 text-2xl font-black text-foreground">{operationMetrics.mediaCount}</p>
                </div>
                <div className="border border-primary/15 bg-black/20 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Com Áudio</p>
                  <p className="mt-1 text-2xl font-black text-foreground">{operationMetrics.audioCount}</p>
                </div>
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55">
                Relatórios textuais: {operationMetrics.textOnlyCount}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {!onboardingCompleted ? (
          <motion.section
            className="mt-8 border border-primary/20 bg-black/30 px-6 py-6 shadow-[0_14px_50px_rgba(0,0,0,0.35)]"
            {...getEntranceMotion(0.22, 14)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/15 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Tutorial de entrada</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-wide text-foreground">Bem-vindo ao Voxen</h2>
                <p className="mt-2 text-sm text-primary/80">
                  Nível atual: {profileRoleLabel}. Complete os 2 passos para liberar a aba Conhecimento.
                </p>
              </div>
              <span className="border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                Progresso: {Number(onboardingReadGuidelines) + Number(onboardingPostedWord)}/2
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="border border-primary/15 bg-black/25 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70">Passo 1</p>
                <p className="mt-2 text-base font-black uppercase tracking-wide text-foreground">Ler Diretrizes</p>
                <p className="mt-2 text-sm text-primary/80">Abra as diretrizes e confirme o padrão de convivência da comunidade.</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-primary/85">
                  {onboardingReadGuidelines ? 'Concluído' : 'Pendente'}
                </p>
                {!onboardingReadGuidelines ? (
                  <Link
                    href="/guidelines"
                    className="mt-3 inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-all hover:border-primary hover:text-foreground"
                  >
                    Abrir diretrizes
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>

              <div className="border border-primary/15 bg-black/25 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70">Passo 2</p>
                <p className="mt-2 text-base font-black uppercase tracking-wide text-foreground">Primeira palavra</p>
                <p className="mt-2 text-sm text-primary/80">Envie sua primeira palavra na aba Prática Diária para concluir o tutorial.</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-primary/85">
                  {onboardingPostedWord ? 'Concluído' : 'Pendente'}
                </p>
                {!onboardingPostedWord ? (
                  <Link
                    href="/lab/daily-practice"
                    className="mt-3 inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-all hover:border-primary hover:text-foreground"
                  >
                    Ir para prática diária
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          </motion.section>
        ) : null}

        <motion.section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5" {...getEntranceMotion(0.28, 18)}>
          {operationalAreas.map((area, index) => {
            const Icon = area.icon;

            return (
              <motion.div key={area.title} {...getStaggerMotion(0.32, index)}>
                <Link
                  href={area.href}
                  className="group block border border-primary/20 bg-black/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-black/45"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary/80 transition-colors group-hover:text-primary" />
                    <span className="border border-primary/25 bg-primary/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-primary/80">
                      {area.badge}
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-black uppercase tracking-wide text-foreground">{area.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-primary/80">{area.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-colors group-hover:text-foreground">
                    Abrir área
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.section>

        <motion.section className="mt-10" {...getEntranceMotion(0.46, 16)}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-primary/15 pb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Comando Rápido</p>
              <p className="mt-2 text-sm text-primary/80">Registre uma atualização com texto, imagem ou áudio.</p>
            </div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary/80">
              <Mic className="h-4 w-4" /> captura multimodal ativa
            </div>
          </div>

          <div className="sticky top-6 z-30">
            <MessageForm onNewMessage={handleNewMessage} currentUser={currentUser} onUserChange={setCurrentUser} />
          </div>
        </motion.section>

        <motion.section
          className="mt-10 border border-primary/15 bg-black/20 px-2 py-6 sm:px-5"
          {...getEntranceMotion(0.58, 16)}
        >
          <div className="mb-6 flex items-center justify-between px-4">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-wide text-foreground">Fluxo de Relatórios</h3>
              <p className="mt-1 text-sm text-primary/75">Histórico completo das publicações da equipe.</p>
            </div>
          </div>

          <div className="relative min-h-[360px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-6 py-28">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary/65">Sincronizando dossiês...</p>
              </div>
            ) : (
              <MessageList
                messages={messages || []}
                currentUser={currentUser}
                onDeleteMessage={handleDeleteMessage}
                onToggleLike={handleToggleLike}
              />
            )}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
