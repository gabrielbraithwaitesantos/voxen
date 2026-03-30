'use client';

import { motion } from 'framer-motion';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

/**
 * Splash Screen "Signature": Animação profissional focada na identidade da marca.
 *
 * 1. Animação Icônica: A linha do "V" da Voxen se desenha na tela.
 * 2. Transição Suave: Um fade-out limpo substitui a interação de clique.
 * 3. Sofisticação: O design é minimalista, elegante e memorável.
 */
export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  return (
    <motion.div
        className="relative min-h-screen w-full grid place-items-center overflow-hidden bg-[#0A0809]"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 3.5, times: [0, 0.84, 1] }}
        onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(174, 154, 101, 0.16) 0%, rgba(174, 154, 101, 0.05) 28%, rgba(174, 154, 101, 0) 46%)',
        }}
        animate={{ opacity: [0.7, 1, 0.75] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          className="relative mb-8 flex h-36 w-36 items-center justify-center md:h-40 md:w-40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border border-[#AE9A65]/70"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-2 rounded-full border border-[#AE9A65]/30" />
          <motion.img
            src="/voxen-logo.png"
            alt="Voxen"
            className="relative z-10 h-[64%] w-[64%] object-contain"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.svg
          width="110"
          height="64"
          viewBox="0 0 100 100"
        >
          <motion.path
            d="M20,20 L50,80 L80,20"
            stroke="#AE9A65"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1.8, delay: 0.35 },
              opacity: { duration: 0.01, delay: 0.35 },
            }}
          />
        </motion.svg>

        <motion.p
          className="mt-3 text-[10px] font-black uppercase tracking-[0.36em] text-[#AE9A65]/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Preparando ambiente seguro
        </motion.p>

        <div className="mt-3 h-[2px] w-48 overflow-hidden bg-[#AE9A65]/20">
          <motion.div
            className="h-full bg-[#AE9A65]"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
