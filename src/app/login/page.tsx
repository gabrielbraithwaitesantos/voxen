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
      className={`relative min-h-screen overflow-hidden px-5 py-8 text-[#e9dcc2] transition-opacity duration-500 md:px-10 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background:
          'radial-gradient(circle at center, rgba(16, 44, 94, 0.62) 0%, rgba(5, 17, 43, 0.95) 46%, rgba(3, 9, 25, 1) 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-[#f3d98f]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#80b9ff]/10 blur-3xl" />

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(rgba(233, 220, 194, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(233, 220, 194, 0.06) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
        animate={{ opacity: [0.22, 0.38, 0.24] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid min-h-[92vh] w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
        <motion.aside
          className="rounded-3xl border border-[#e3c481]/15 bg-[#0b1428]/55 px-8 py-10 backdrop-blur-md"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-14 flex justify-center md:justify-start">
            <motion.img
              src="/voxen-logo.png"
              alt="Voxen"
              className="h-16 w-16 object-contain"
              animate={{ y: [0, -2, 0], scale: [1, 1.03, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <h2 className="text-center text-2xl font-black uppercase tracking-wide md:text-left md:text-3xl">Voxen ID</h2>
          <p className="mt-10 text-xl leading-relaxed text-[#efe3c8]/85 md:text-2xl">
            • Integra suas informações e atividade para uma experiência no ecossistema Voxen fluida e conectada.
          </p>
        </motion.aside>

        <motion.section
          className="rounded-3xl border border-[#e3c481]/15 bg-[#0b1428]/45 px-6 py-8 backdrop-blur-md md:px-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 flex items-start justify-center gap-2 text-center text-[11px] uppercase tracking-[0.2em] text-[#efdba8]/85 md:text-sm md:tracking-[0.22em]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Não tem Voxen ID? Crie agora na página oficial de entrada.</p>
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#e3c481]/15 bg-[#101a31]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:p-8">
            <p className="mb-3 text-center text-[10px] uppercase tracking-[0.3em] text-[#e9dcc2]/55">Acesso seguro</p>
            <h1 className="mb-8 text-center text-3xl font-black uppercase tracking-wide md:text-4xl">Apresente-se aqui:</h1>

            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="text-sm uppercase tracking-[0.28em] text-[#e9dcc2]/70">ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Digite seu Voxen ID (ex: gabriel.santos)"
                  className="mt-2 w-full rounded-xl border border-[#e3c481]/35 bg-[#0a1326]/75 px-4 py-3 text-lg outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                />
              </div>

              <div>
                <label className="text-sm uppercase tracking-[0.28em] text-[#e9dcc2]/70">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className="mt-2 w-full rounded-xl border border-[#e3c481]/35 bg-[#0a1326]/75 px-4 py-3 text-lg outline-none transition focus:border-[#f3d98f] focus:ring-2 focus:ring-[#f3d98f]/20"
                />
              </div>

              <motion.button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`group mt-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border px-5 py-3.5 text-base font-black uppercase tracking-[0.16em] transition ${
                  canSubmit && !isSubmitting
                    ? 'border-[#e3c481]/75 bg-[#e3c481]/10 text-[#f4e5be] hover:bg-[#e3c481]/22'
                    : 'cursor-not-allowed border-[#e3c481]/25 bg-[#0f1a30]/70 text-[#e9dcc2]/45'
                }`}
                aria-label="Avançar"
                whileHover={canSubmit && !isSubmitting ? { scale: 1.02, y: -1 } : {}}
                whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}
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

              <div className="pt-1 text-center text-xs text-[#e9dcc2]/70">
                Primeiro acesso?{' '}
                <Link href="/voxen-id" className="font-bold uppercase tracking-[0.12em] text-[#f2dca8] hover:text-white">
                  Criar Voxen ID
                </Link>
              </div>
            </form>
          </div>
        </motion.section>

        <motion.aside
          className="rounded-3xl border border-[#e3c481]/15 bg-[#0b1428]/55 px-8 py-10 backdrop-blur-md"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-14 flex justify-center md:justify-end">
            <motion.div
              animate={{ y: [0, -2, 0], rotate: [0, 1.2, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CircleUserRound className="h-16 w-16" />
            </motion.div>
          </div>
          <h2 className="text-center text-2xl font-black uppercase tracking-wide md:text-right md:text-3xl">Perfil / Senha</h2>
          <p className="mt-10 text-xl leading-relaxed text-[#efe3c8]/85 md:text-2xl">
            • Criando sua senha terá segurança dobrada no seu login e presença na plataforma Voxen.
          </p>
          <div className="mt-10 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e9dcc2]/65 md:justify-end">
            <Shield className="h-4 w-4" />
            Criptografia ativa
          </div>
        </motion.aside>
      </div>
    </motion.main>
  );
}
