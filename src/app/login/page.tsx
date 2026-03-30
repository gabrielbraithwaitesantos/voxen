'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CircleUserRound, Info, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const cachedUser = localStorage.getItem('username');
    if (cachedUser) {
      router.replace('/hub');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      localStorage.setItem('username', username.trim());
      setIsTransitioning(true);
      setTimeout(() => router.push('/hub'), 450);
    }
  };

  return (
    <motion.main
      className={`min-h-screen px-5 py-8 text-[#e9dcc2] transition-opacity duration-500 md:px-10 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background:
          'radial-gradient(circle at center, rgba(16, 44, 94, 0.62) 0%, rgba(5, 17, 43, 0.95) 46%, rgba(3, 9, 25, 1) 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
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
            <p>Caso ainda não tenha seu Voxen ID, acesse suporte@voxen.com.br</p>
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#e3c481]/10 bg-[#111b32]/45 p-6 md:p-8">
            <h1 className="mb-8 text-center text-3xl font-black uppercase tracking-wide md:text-4xl">Apresente-se aqui:</h1>

            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="text-sm uppercase tracking-[0.28em] text-[#e9dcc2]/70">ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-2 w-full border-b border-[#e3c481]/45 bg-transparent pb-2 text-2xl outline-none focus:border-[#f3d98f]"
                />
              </div>

              <div>
                <label className="text-sm uppercase tracking-[0.28em] text-[#e9dcc2]/70">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 w-full border-b border-[#e3c481]/45 bg-transparent pb-2 text-2xl outline-none focus:border-[#f3d98f]"
                />
              </div>

              <motion.button
                type="submit"
                className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#e3c481]/70 text-[#e3c481] transition hover:bg-[#e3c481]/12 hover:scale-[1.04]"
                aria-label="Entrar"
                whileHover={{ scale: 1.06, backgroundColor: 'rgba(227, 196, 129, 0.16)' }}
                whileTap={{ scale: 0.96 }}
              >
                <ArrowRight className="h-7 w-7" />
              </motion.button>
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
