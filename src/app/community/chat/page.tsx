'use client';

import { FormEvent, useMemo, useState } from 'react';
import { MessageSquare, Send, Shield, Users } from 'lucide-react';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, collection, query, orderBy, doc, setDoc } from '@/firebase';
import { UserProfile } from '@/models/types';

interface CommunityMessage {
  id: string;
  channel: string;
  sender: string;
  role: string;
  text: string;
  createdAt: string;
}

const channelOptions = ['Geral', 'Inglês', 'Debate', 'Suporte'];

const formatTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '--:--';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function GeneralChatPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [activeChannel, setActiveChannel] = useState('Geral');
  const [messageInput, setMessageInput] = useState('');

  const userProfileQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'voxen_v2_users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileQuery);
  const senderName = userProfile?.displayName || userProfile?.voxenId || 'Membro Voxen';
  const senderRole = userProfile?.role === 'tutor' ? 'Tutor' : userProfile?.role === 'admin' ? 'Admin' : 'Discípulo';

  const communityMessagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'voxen_v2_community_messages'), orderBy('createdAt', 'asc'));
  }, [firestore]);

  const { data: persistedMessages, isLoading } = useCollection<CommunityMessage>(communityMessagesQuery);

  const messagesByChannel = useMemo(
    () => (persistedMessages || []).filter((message) => message.channel === activeChannel),
    [persistedMessages, activeChannel]
  );

  const activeMembers = useMemo(
    () => [
      { name: 'Coordenação Voxen', status: 'online' },
      { name: 'Agente Principal', status: 'online' },
      { name: 'Analista Forense', status: 'em foco' },
      { name: 'Investigador de Campo', status: 'online' },
    ],
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedText = messageInput.trim();
    if (!normalizedText || !firestore || !user) return;

    const newDocRef = doc(collection(firestore, 'voxen_v2_community_messages'));
    await setDoc(newDocRef, {
      channel: activeChannel,
      sender: senderName,
      role: senderRole,
      text: normalizedText,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    });

    setMessageInput('');
  };

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
            Comunidade • Chat Geral
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Canal de coordenação rápida da comunidade
          </h1>
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-primary sm:text-lg">
            Compartilhe contexto, dúvidas e decisões em um fluxo contínuo para manter ritmo coletivo e alinhamento.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <div className="border border-primary/20 bg-black/25">
            <div className="flex flex-wrap items-center gap-2 border-b border-primary/15 px-4 py-3">
              {channelOptions.map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setActiveChannel(channel)}
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeChannel === channel
                      ? 'border border-primary/40 bg-primary/15 text-primary'
                      : 'border border-primary/20 bg-black/20 text-primary/70 hover:text-foreground'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>

            <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
              {isLoading ? (
                <div className="border border-primary/15 bg-black/30 p-3 text-xs uppercase tracking-[0.18em] text-primary/65">
                  Sincronizando mensagens...
                </div>
              ) : null}

              {!isLoading && messagesByChannel.length === 0 ? (
                <div className="border border-primary/15 bg-black/30 p-3 text-sm text-primary/80">
                  Este canal ainda não tem mensagens. Envie a primeira para iniciar a conversa.
                </div>
              ) : null}

              {messagesByChannel.map((message) => (
                <article key={message.id} className="border border-primary/15 bg-black/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black uppercase tracking-wide text-foreground">{message.sender}</p>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-primary/65">{formatTime(message.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-primary/70">{message.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-primary/85">{message.text}</p>
                </article>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-primary/15 p-4">
              <div className="flex gap-2">
                <input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Digite uma atualização objetiva para o canal"
                  className="h-11 flex-1 border border-primary/30 bg-black/30 px-3 text-sm text-foreground outline-none transition-all placeholder:text-primary/45 focus:border-primary"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 border border-primary/35 bg-primary/15 px-4 text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-all hover:border-primary hover:text-foreground"
                >
                  Enviar
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="border border-primary/20 bg-[#0a0f18] p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <Users className="h-4 w-4" /> Membros ativos
              </div>
              <div className="mt-4 space-y-2">
                {activeMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between border border-primary/15 bg-black/25 px-3 py-2">
                    <p className="text-sm text-foreground/90">{member.name}</p>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-primary/65">{member.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-primary/20 bg-[#0a0f18] p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <Shield className="h-4 w-4" /> Boas práticas do canal
              </div>
              <ul className="mt-4 space-y-2">
                <li className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">Seja direto: contexto, ponto principal e ação esperada.</li>
                <li className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">Evite flood. Reúna mensagens sobre o mesmo tema.</li>
                <li className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">Use o canal de sugestões para pedidos estruturados.</li>
              </ul>
            </div>

            <div className="border border-primary/20 bg-black/25 p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <MessageSquare className="h-4 w-4" /> Canal atual
              </div>
              <p className="mt-3 text-xl font-black uppercase tracking-wide text-foreground">{activeChannel}</p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
