'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AlertCircle, ArrowUpRight, BookOpen, Shield, Users } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase, useUser, doc, updateDoc } from '@/firebase';
import { UserProfile } from '@/models/types';

const principles = [
  {
    title: 'Respeito mútuo',
    description: 'Discordar é permitido. Desrespeitar pessoas não é. A comunidade prioriza debate firme com postura civilizada.',
    icon: Shield,
  },
  {
    title: 'Foco em evolução',
    description: 'As interações devem contribuir para aprendizado, prática de inglês e crescimento intelectual objetivo.',
    icon: BookOpen,
  },
  {
    title: 'Cultura colaborativa',
    description: 'Compartilhe experiências, materiais e feedback útil para fortalecer o progresso coletivo.',
    icon: Users,
  },
];

const expectedConduct = [
  'Use linguagem respeitosa mesmo em temas sensíveis.',
  'Publique cada assunto no canal mais apropriado.',
  'Cite fontes quando usar referências externas.',
  'Ofereça feedback com foco em melhoria, não em ataque pessoal.',
  'Mantenha consistência entre discurso e prática dentro da plataforma.',
];

const forbiddenConduct = [
  'Assédio, insultos pessoais, discriminação ou intimidação.',
  'Spam, flood, autopromoção fora de contexto e links suspeitos.',
  'Plágio, uso indevido de conteúdo sem crédito e manipulação de informação.',
  'Compartilhar dados pessoais de terceiros sem autorização.',
];

const moderationFlow = [
  'Aviso orientativo com contextualização da conduta inadequada.',
  'Restrição temporária de participação em casos de reincidência.',
  'Remoção da plataforma em violações graves ou persistentes.',
];

export default function GuidelinesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const hasUpdatedRef = useRef(false);

  const userProfileQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'voxen_v2_users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileQuery);

  useEffect(() => {
    if (!user || !firestore || !userProfile || hasUpdatedRef.current || userProfile.onboarding?.hasReadGuidelines) {
      return;
    }

    hasUpdatedRef.current = true;
    updateDoc(doc(firestore, 'voxen_v2_users', user.uid), {
      'onboarding.hasReadGuidelines': true,
    }).catch(() => {
      hasUpdatedRef.current = false;
    });
  }, [user, firestore, userProfile]);

  return (
    <div className="relative min-h-full bg-[#05080c] px-4 pb-16 pt-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(161,138,90,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,138,90,0.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <section className="border border-primary/20 bg-black/35 px-6 py-8 shadow-[0_18px_70px_rgba(0,0,0,0.35)] md:px-10">
          <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Diretrizes da Comunidade
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Regras para um ambiente forte, respeitoso e produtivo
          </h1>
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-primary sm:text-lg">
            Este espaço existe para crescimento intelectual e evolução prática. As diretrizes abaixo garantem segurança, clareza e qualidade nas interações.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:border-primary hover:text-foreground"
            >
              Ver avisos oficiais
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 border border-primary/25 bg-black/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/90 transition-all hover:border-primary/60 hover:text-foreground"
            >
              Revisar meu perfil
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;

            return (
              <article key={principle.title} className="border border-primary/20 bg-black/25 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-wide text-foreground">{principle.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-primary/80">{principle.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="border border-primary/20 bg-[#0a0f18] p-6">
            <h3 className="text-2xl font-black uppercase tracking-wide text-foreground">Conduta esperada</h3>
            <ul className="mt-4 space-y-2">
              {expectedConduct.map((rule) => (
                <li key={rule} className="border border-primary/15 bg-black/30 px-3 py-2 text-sm text-foreground/90">
                  {rule}
                </li>
              ))}
            </ul>
          </article>

          <article className="border border-primary/20 bg-[#0a0f18] p-6">
            <h3 className="text-2xl font-black uppercase tracking-wide text-foreground">Conduta proibida</h3>
            <ul className="mt-4 space-y-2">
              {forbiddenConduct.map((rule) => (
                <li key={rule} className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-foreground/90">
                  {rule}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-8 border border-primary/20 bg-black/30 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-primary" />
            <h3 className="text-2xl font-black uppercase tracking-wide text-foreground">Fluxo de moderação</h3>
          </div>
          <ol className="mt-4 grid gap-2 md:grid-cols-3">
            {moderationFlow.map((step, index) => (
              <li key={step} className="border border-primary/15 bg-black/25 px-3 py-3 text-sm text-primary/85">
                <span className="mr-2 text-xs font-black text-primary">0{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
