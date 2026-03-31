'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Info, LogIn } from 'lucide-react';
import { useUser } from '@/firebase';

type HubRoute = Route;

const cards: Array<{
  title: string;
  description: string;
  href: HubRoute;
  icon: React.ComponentType<{ className?: string }> | null;
}> = [
  {
    title: 'ID Voxen e Perfil',
    description: 'Edição e verificação de informações',
    href: '/profile',
    icon: null,
  },
  {
    title: 'Página Principal',
    description: 'Comunidade, aprendizagem e ferramentas Voxen',
    href: '/home',
    icon: LogIn,
  },
  {
    title: 'Conquistas e Posição',
    description: 'Acompanhe sua evolução e cargos',
    href: '/community/achievements',
    icon: Award,
  },
];

export default function HubPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  return (
    <main
      className="min-h-screen px-6 py-12 text-[#e9dcc2] md:px-12"
      style={{
        background:
          'radial-gradient(circle at center, rgba(16, 44, 94, 0.62) 0%, rgba(5, 17, 43, 0.95) 46%, rgba(3, 9, 25, 1) 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-[#f0d89b]/80">
            <Info className="h-4 w-4" />
            Escolha seu próximo destino
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isBrandCard = !Icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={card.href}
                  className="group block rounded-3xl border border-[#e3c481]/12 bg-[#0b1428]/55 px-8 py-14 text-center backdrop-blur-md transition hover:border-[#e3c481]/35 hover:bg-[#13213e]/72 hover:shadow-[0_0_30px_rgba(227,196,129,0.08)]"
                >
                  <div className="mb-10 flex justify-center">
                    <div
                      className={`rounded-full border border-[#e3c481]/45 text-[#e7ce8a] transition group-hover:scale-105 group-hover:text-[#f6dc98] ${
                        isBrandCard ? 'flex h-20 w-20 items-center justify-center p-0' : 'p-5'
                      }`}
                    >
                      {Icon ? (
                        <Icon className="h-10 w-10" />
                      ) : (
                        <img
                          src="/voxen-logo-clean.png"
                          alt="Voxen"
                          className="h-14 w-14 object-contain drop-shadow-[0_0_8px_rgba(227,196,129,0.35)]"
                        />
                      )}
                    </div>
                  </div>

                  <h2 className="text-3xl font-black uppercase leading-tight tracking-wide md:text-4xl">{card.title}</h2>
                  <p className="mt-8 text-lg uppercase tracking-[0.12em] text-[#efe3c8]/80 md:text-xl">• {card.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}