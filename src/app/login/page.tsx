'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CircleUserRound, Info, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, useFirestore, useUser, doc, getDoc } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { buildVoxenAuthEmail, formatVoxenIdForDisplay, normalizeVoxenId } from '@/lib/voxen-id';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/home');
    }
  }, [isUserLoading, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit || isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const normalizedId = normalizeVoxenId(username);

      if (normalizedId.length < 4) {
        throw new Error('Informe um Voxen ID válido (mínimo de 4 caracteres).');
      }

      const authEmail = buildVoxenAuthEmail(normalizedId);
      const credential = await signInWithEmailAndPassword(auth, authEmail, password);

      const profileRef = doc(firestore, 'voxen_v2_users', credential.user.uid);
      const profileSnapshot = await getDoc(profileRef);
      const profileData = profileSnapshot.exists() ? profileSnapshot.data() : null;
      const resolvedName = profileData?.displayName || profileData?.voxenId || formatVoxenIdForDisplay(normalizedId);

      localStorage.setItem('username', String(resolvedName));
      setIsTransitioning(true);

      setTimeout(() => {
        router.push('/home');
      }, 280);
    } catch (error: any) {
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        setErrorMessage('Voxen ID ou senha incorretos.');
      } else {
        setErrorMessage(error?.message || 'Falha ao autenticar. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      className={`relative min-h-screen overflow-hidden px-4 py-6 text-[#e9dcc2] transition-opacity duration-500 sm:px-6 md:px-10 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background:
          'radial-gradient(circle at 50% 10%, rgba(44, 81, 145, 0.4) 0%, rgba(8, 21, 49, 0.92) 40%, rgba(4, 10, 24, 1) 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="pointer-events-none absolute -left-14 top-10 h-72 w-72 rounded-full bg-[#f2d592]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-14 top-12 h-72 w-72 rounded-full bg-[#7ba8df]/10 blur-3xl" />

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(233, 220, 194, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(233, 220, 194, 0.05) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
        animate={{ opacity: [0.2, 0.32, 0.22] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <motion.div
          className="relative w-full overflow-hidden rounded-[30px] border border-[#e3c481]/20 bg-[#081225]/76 shadow-[0_28px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e3c481]/50 to-transparent" />
          <div className="grid lg:grid-cols-[1fr_1fr]">
            <motion.section
              className="relative flex h-full flex-col justify-center border-b border-[#e3c481]/15 px-6 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e3c481]/30 bg-[#e3c481]/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f1ddb0]">
                <Shield className="h-3.5 w-3.5" />
                Acesso institucional
              </div>

              <div className="mt-8 flex items-center gap-5">
                <motion.img
                  src="/voxen-logo-clean.png"
                  alt="Voxen"
                  className="h-24 w-24 rounded-2xl border border-[#e3c481]/28 bg-[#0d1a33]/90 p-1.5 object-contain shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                  animate={{ y: [0, -2, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#e9dcc2]/65">Voxen Platform</p>
                  <h1 className="mt-1 text-3xl font-black uppercase tracking-[0.06em] text-[#f5e7c4] sm:text-4xl">Login seguro</h1>
                </div>
              </div>

              <p className="mt-8 max-w-xl text-base leading-relaxed text-[#efe3c8]/82 sm:text-lg">
                Acesse sua conta com o Voxen ID para continuar seu progresso, sua trilha de conhecimento e suas conexões na plataforma.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-[#e3c481]/18 bg-[#0f1a33]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#efd9a6]/85">Identidade única</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#e9dcc2]/75">Seu Voxen ID conecta perfil, histórico e presença em todo o ecossistema.</p>
                </div>
                <div className="rounded-2xl border border-[#e3c481]/18 bg-[#0f1a33]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#efd9a6]/85">Proteção contínua</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#e9dcc2]/75">Camada de autenticação reforçada para manter seus dados e seu acesso protegidos.</p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#e9dcc2]/60">
                <CircleUserRound className="h-4 w-4" />
                Fluxo autenticado por Voxen ID + senha
              </div>
            </motion.section>

            <motion.section
              className="flex h-full flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8 rounded-2xl border border-[#e3c481]/20 bg-[#101b33]/65 p-4 text-sm leading-relaxed text-[#e9dcc2]/80">
                <p className="inline-flex items-start gap-2">
                  <Info className="mt-[2px] h-4 w-4 shrink-0 text-[#f0dba8]" />
                  Não tem Voxen ID?{' '}
                  <Link href="/voxen-id" className="font-semibold uppercase tracking-[0.1em] text-[#f1dca8] transition hover:text-white">
                    Criar agora
                  </Link>
                </p>
              </div>

              <p className="text-[10px] uppercase tracking-[0.3em] text-[#e9dcc2]/55">Painel de acesso</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.08em] text-[#f5e7c4] sm:text-[2.2rem]">Entrar na plataforma</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#e9dcc2]/72 sm:text-base">Use seu Voxen ID e sua senha para iniciar a sessão.</p>

              <form onSubmit={handleLogin} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="voxen-id" className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e9dcc2]/68">
                    Voxen ID
                  </label>
                  <input
                    id="voxen-id"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="ex: gabriel.santos"
                    className="mt-2 w-full rounded-xl border border-[#e3c481]/32 bg-[#0a1326]/86 px-4 py-3 text-base outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                  />
                </div>

                <div>
                  <label htmlFor="voxen-password" className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e9dcc2]/68">
                    Senha
                  </label>
                  <input
                    id="voxen-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    className="mt-2 w-full rounded-xl border border-[#e3c481]/32 bg-[#0a1326]/86 px-4 py-3 text-base outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={`group mt-2 flex w-full items-center justify-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-black uppercase tracking-[0.16em] transition-all ${
                    canSubmit && !isSubmitting
                      ? 'border-[#e3c481]/80 bg-gradient-to-r from-[#b4934e] via-[#e0c07a] to-[#b58d44] text-[#101624] shadow-[0_12px_26px_rgba(227,196,129,0.25)] hover:brightness-105'
                      : 'cursor-not-allowed border-[#e3c481]/25 bg-[#0f1a30]/70 text-[#e9dcc2]/45'
                  }`}
                  aria-label="Entrar"
                  whileHover={canSubmit && !isSubmitting ? { scale: 1.015, y: -1 } : {}}
                  whileTap={canSubmit && !isSubmitting ? { scale: 0.99 } : {}}
                >
                  {isSubmitting ? 'Autenticando...' : 'Entrar na plataforma'}
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                </motion.button>

                {errorMessage ? (
                  <p className="inline-flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {errorMessage}
                  </p>
                ) : null}

                <div className="pt-2 text-center text-xs text-[#e9dcc2]/65">
                  Primeiro acesso?{' '}
                  <Link href="/voxen-id" className="font-bold uppercase tracking-[0.12em] text-[#f2dca8] hover:text-white">
                    Criar Voxen ID
                  </Link>
                </div>
              </form>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
