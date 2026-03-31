'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Fingerprint, Shield, UserPlus, AlertCircle, CheckCircle2, CircleDashed } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '@/firebase/actions';
import { useAuth, useFirestore } from '@/firebase';
import { buildVoxenAuthEmail, formatVoxenIdForDisplay, normalizeVoxenId } from '@/lib/voxen-id';

export default function VoxenIdPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [voxenId, setVoxenId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdVoxenId, setCreatedVoxenId] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  const normalizedId = normalizeVoxenId(voxenId);
  const hasDisplayName = displayName.trim().length >= 2;
  const hasVoxenId = normalizedId.length >= 4;
  const hasPassword = password.length >= 6;
  const hasConfirmPassword = confirmPassword.length >= 6;
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const canSubmit = hasDisplayName && hasVoxenId && hasPassword && hasConfirmPassword && passwordsMatch;

  useEffect(() => {
    if (!createdVoxenId) {
      setRedirectCountdown(null);
      return;
    }

    setRedirectCountdown(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [createdVoxenId]);

  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown <= 0) {
      router.push('/home');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRedirectCountdown((prev) => (prev === null ? prev : prev - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [redirectCountdown, router]);

  const handleCreateAccount = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) return;

    if (!passwordsMatch) {
      setErrorMessage('As senhas não conferem.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const authEmail = buildVoxenAuthEmail(normalizedId);
      const credential = await createUserWithEmailAndPassword(auth, authEmail, password);

      await createUserProfile(firestore, credential.user.uid, {
        displayName: displayName.trim(),
        voxenId: normalizedId,
        role: 'disciple',
      });

      const displayId = formatVoxenIdForDisplay(normalizedId);
      setCreatedVoxenId(displayId);
      localStorage.setItem('username', displayName.trim() || displayId);

      setDisplayName('');
      setVoxenId('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use') {
        setErrorMessage('Esse Voxen ID já está em uso. Escolha outro.');
      } else if (error?.code === 'auth/weak-password') {
        setErrorMessage('Senha fraca. Use no mínimo 6 caracteres.');
      } else if (error?.code === 'auth/operation-not-allowed') {
        setErrorMessage('Cadastro por email/senha não está habilitado no Firebase Auth. Ative esse provedor no console do Firebase.');
      } else if (error?.code === 'auth/network-request-failed') {
        setErrorMessage('Falha de conexão. Verifique sua internet e tente novamente.');
      } else if (error?.code === 'permission-denied') {
        setErrorMessage('Sem permissão para salvar perfil no Firestore. Verifique as regras do Firebase.');
      } else {
        setErrorMessage(error?.message || 'Não foi possível criar seu Voxen ID agora.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-5 py-8 text-[#e9dcc2] md:px-10"
      style={{
        background:
          'radial-gradient(circle at center, rgba(16, 44, 94, 0.62) 0%, rgba(5, 17, 43, 0.95) 46%, rgba(3, 9, 25, 1) 100%)',
      }}
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-[#f3d98f]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#80b9ff]/10 blur-3xl" />

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(233, 220, 194, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(233, 220, 194, 0.05) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
        animate={{ opacity: [0.2, 0.34, 0.2] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence>
        {createdVoxenId ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 top-3 z-50 mx-auto w-full max-w-3xl border border-emerald-300/40 bg-[#0f2c25]/95 px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.45)] backdrop-blur-xl md:inset-x-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Conta criada com sucesso</p>
                <p className="mt-1 text-sm text-white">
                  Seu Voxen ID: <span className="font-black tracking-wide text-emerald-100">{createdVoxenId}</span>
                </p>
                <p className="text-xs text-emerald-100/85">
                  Redirecionando em {redirectCountdown ?? 0}s...
                </p>
              </div>

              <Link
                href="/home"
                className="inline-flex items-center gap-2 border border-emerald-200/40 bg-emerald-500/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-50 transition hover:border-emerald-200 hover:bg-emerald-500/30"
              >
                Entrar na plataforma
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative mx-auto grid min-h-[92vh] w-full max-w-7xl gap-6 md:grid-cols-[1fr_1.25fr]">
        <motion.aside
          className="rounded-3xl border border-[#e3c481]/15 bg-[#0b1428]/55 px-8 py-10 backdrop-blur-md"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-10 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#e3c481]/45 text-[#f2dca8]">
            <Fingerprint className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-black uppercase tracking-wide text-[#f2dca8] md:text-4xl">Criar Voxen ID</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#efe3c8]/85">
            Este é o primeiro passo oficial. Crie seu Voxen ID e sua senha para liberar o acesso à plataforma.
          </p>

          <div className="mt-8 space-y-3 text-sm text-[#efe3c8]/75">
            <p className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#f2dca8]" /> Identidade única por aluno</p>
            <p className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-[#f2dca8]" /> Acesso protegido por senha</p>
            <p className="inline-flex items-center gap-2"><UserPlus className="h-4 w-4 text-[#f2dca8]" /> Nível inicial: Discípulo</p>
          </div>
        </motion.aside>

        <motion.section
          className="rounded-3xl border border-[#e3c481]/15 bg-[#0b1428]/45 px-6 py-8 backdrop-blur-md md:px-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e3c481]/15 bg-[#101a31]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:p-8">
            <p className="mb-3 text-center text-[10px] uppercase tracking-[0.3em] text-[#e9dcc2]/55">Cadastro inicial</p>
            <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-wide">Seu acesso começa aqui</h2>

            <form onSubmit={handleCreateAccount} className="space-y-5">
              <div>
                <label className="text-sm uppercase tracking-[0.22em] text-[#e9dcc2]/70">Nome de exibição</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                  placeholder="Seu nome"
                  className="mt-2 w-full rounded-xl border border-[#e3c481]/35 bg-[#0a1326]/75 px-4 py-3 text-base outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                />
              </div>

              <div>
                <label className="text-sm uppercase tracking-[0.22em] text-[#e9dcc2]/70">Voxen ID</label>
                <input
                  type="text"
                  value={voxenId}
                  onChange={(event) => setVoxenId(event.target.value)}
                  required
                  placeholder="Ex: gabriel.santos"
                  className="mt-2 w-full rounded-xl border border-[#e3c481]/35 bg-[#0a1326]/75 px-4 py-3 text-base outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                />
                <p className="mt-2 text-xs text-[#e9dcc2]/65">
                  ID final: <span className="font-bold text-[#f2dca8]">{normalizedId || '—'}</span>
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm uppercase tracking-[0.22em] text-[#e9dcc2]/70">Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    placeholder="mínimo 6 caracteres"
                    className="mt-2 w-full rounded-xl border border-[#e3c481]/35 bg-[#0a1326]/75 px-4 py-3 text-base outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-[0.22em] text-[#e9dcc2]/70">Confirmar senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    minLength={6}
                    placeholder="repita a senha"
                    className="mt-2 w-full rounded-xl border border-[#e3c481]/35 bg-[#0a1326]/75 px-4 py-3 text-base outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`group mt-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border px-5 py-3.5 text-base font-black uppercase tracking-[0.16em] transition ${
                  canSubmit && !isSubmitting
                    ? 'border-[#e3c481]/75 bg-[#e3c481]/10 text-[#f4e5be] hover:bg-[#e3c481]/22'
                    : 'cursor-not-allowed border-[#e3c481]/25 bg-[#0f1a30]/70 text-[#e9dcc2]/45'
                }`}
                whileHover={canSubmit && !isSubmitting ? { scale: 1.02, y: -1 } : {}}
                whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Criando acesso...' : 'Criar Voxen ID'}
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
              </motion.button>

              <div className="space-y-1.5 border border-[#e3c481]/20 bg-black/20 p-3 text-xs text-[#e9dcc2]/75">
                <p className="font-bold uppercase tracking-[0.16em] text-[#f2dca8]">Checklist de cadastro</p>
                <p className="inline-flex items-center gap-2">
                  {hasDisplayName ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <CircleDashed className="h-3.5 w-3.5 text-[#e9dcc2]/50" />}
                  Nome com pelo menos 2 caracteres
                </p>
                <p className="inline-flex items-center gap-2">
                  {hasVoxenId ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <CircleDashed className="h-3.5 w-3.5 text-[#e9dcc2]/50" />}
                  Voxen ID com pelo menos 4 caracteres válidos
                </p>
                <p className="inline-flex items-center gap-2">
                  {hasPassword ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <CircleDashed className="h-3.5 w-3.5 text-[#e9dcc2]/50" />}
                  Senha com no mínimo 6 caracteres
                </p>
                <p className="inline-flex items-center gap-2">
                  {hasConfirmPassword ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <CircleDashed className="h-3.5 w-3.5 text-[#e9dcc2]/50" />}
                  Confirmação com no mínimo 6 caracteres
                </p>
                <p className="inline-flex items-center gap-2">
                  {passwordsMatch ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <CircleDashed className="h-3.5 w-3.5 text-[#e9dcc2]/50" />}
                  Senhas iguais
                </p>
              </div>

              {errorMessage ? (
                <p className="inline-flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  {errorMessage}
                </p>
              ) : null}
            </form>

            {createdVoxenId ? (
              <div className="mt-6 space-y-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Voxen ID criado com sucesso</p>
                <p className="text-xl font-black tracking-wide text-white">{createdVoxenId}</p>
                <Link
                  href="/home"
                  className="inline-flex items-center gap-2 border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:border-emerald-200"
                >
                  Acessar plataforma agora
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : null}

            <div className="mt-5 text-center text-xs text-[#e9dcc2]/70">
              Já possui Voxen ID?{' '}
              <Link href="/login" className="font-bold uppercase tracking-[0.12em] text-[#f2dca8] hover:text-white">
                Entrar
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
