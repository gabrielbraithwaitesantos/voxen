'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, doc } from '@/firebase';
import { createUserProfile, updateUserProfile } from '@/firebase/actions';
import { UserProfile } from '@/models/types';
import { UserCircle, Calendar, Zap, Edit, Save, X, BadgeCheck, Fingerprint, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const userProfileQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'voxen_v2_users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading } = useDoc<UserProfile>(userProfileQuery);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user && !profile && !isLoading) {
      // Create profile if it doesn't exist
      createUserProfile(firestore!, user.uid, {}).catch(console.error);
    }
  }, [user, profile, isLoading, firestore]);

  const handleSave = async () => {
    if (!firestore || !user) return;
    try {
      await updateUserProfile(firestore, undefined as any, user.uid, profile?.avatarPath, {
        displayName: displayName.trim() || undefined,
        avatarFile: avatarFile || undefined,
      });
      setIsEditing(false);
      setAvatarFile(null);
      toast({ title: "Perfil atualizado", description: "Suas informações foram salvas." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar perfil." });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDisplayName(profile?.displayName || '');
    setAvatarFile(null);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-white">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-16 border border-primary/20 bg-primary/10" />
          <div className="h-64 border border-primary/15 bg-black/20" />
        </div>
      </div>
    );
  }

  const userProfile = profile || {
    voxenId: 'VXN-2024-007',
    joinDate: new Date().toISOString(),
    level: 'Nível 1: Discípulo',
    avatarUrl: undefined,
    displayName: '',
  };

  const formattedJoinDate = userProfile.joinDate
    ? new Date(userProfile.joinDate).toLocaleDateString('pt-BR')
    : 'Não informado';
  const identityName = userProfile.displayName?.trim() || 'Membro Voxen';

  return (
    <div className="relative px-4 pb-12 pt-8 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-6">
        <section className="border border-primary/25 bg-[#0a0f18]/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Identidade Digital</p>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-[#f2dca8] md:text-4xl">Meu Voxen ID</h1>
              <p className="mt-2 text-sm text-primary/80">Seu cartão de identificação oficial na comunidade Voxen.</p>
            </div>

            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="cursor-pointer">
                <Edit className="w-4 h-4 mr-2" />
                Editar perfil
              </Button>
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="border border-primary/20 bg-[#0b1322]/72 p-6 shadow-2xl md:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 bg-[#101928] shadow-[0_0_24px_rgba(161,138,90,0.22)]">
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserCircle className="h-20 w-20 text-primary/45" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="displayName" className="text-xs uppercase tracking-[0.22em] text-primary/70">Nome de Exibição</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Seu nome"
                        className="mt-2 border-primary/25 bg-[#101a2d]/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="avatar" className="text-xs uppercase tracking-[0.22em] text-primary/70">Avatar</Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        className="mt-2 border-primary/25 bg-[#101a2d]/80 file:cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button onClick={handleSave} size="sm" className="cursor-pointer">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" className="cursor-pointer">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black uppercase tracking-wide text-white">{userProfile.voxenId}</h2>
                      <span className="inline-flex items-center gap-1 border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verificado
                      </span>
                    </div>

                    <p className="mt-2 text-xl text-primary/95">{identityName}</p>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary/75">
                      Mantenha seus dados atualizados para facilitar reconhecimento, organização de chamadas e distribuição de trilhas de conhecimento.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="border border-primary/20 bg-black/35 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-primary/65">Nível Atual</p>
              <p className="mt-2 text-xl font-black text-[#f2dca8]">{userProfile.level}</p>
              <div className="mt-4 inline-flex items-center gap-2 border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/85">
                <Zap className="h-3.5 w-3.5" /> Evolução contínua
              </div>
            </div>

            <div className="border border-primary/20 bg-black/35 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-primary/65">Dados da Conta</p>

              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-[#f2dca8]" />
                  <div>
                    <p className="text-primary/60">Membro desde</p>
                    <p className="font-semibold text-white">{formattedJoinDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Fingerprint className="mt-0.5 h-4 w-4 text-[#f2dca8]" />
                  <div>
                    <p className="text-primary/60">Identidade registrada</p>
                    <p className="font-semibold text-white">{userProfile.voxenId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-[#f2dca8]" />
                  <div>
                    <p className="text-primary/60">Status de segurança</p>
                    <p className="font-semibold text-emerald-300">Protegido</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
