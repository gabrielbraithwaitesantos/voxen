'use client';

import { motion } from 'framer-motion';

const particles = [
  { left: '12%', top: '22%', size: 5, delay: 0.1, duration: 4.4 },
  { left: '24%', top: '72%', size: 4, delay: 0.5, duration: 4.8 },
  { left: '38%', top: '30%', size: 3, delay: 0.9, duration: 4.2 },
  { left: '59%', top: '74%', size: 6, delay: 0.25, duration: 5.1 },
  { left: '68%', top: '22%', size: 4, delay: 1.1, duration: 4.6 },
  { left: '81%', top: '58%', size: 3, delay: 0.4, duration: 4.7 },
];

export function SplashScreen() {
  return (
    <motion.div
      key="splash-screen-voxen"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at center, rgba(26, 63, 133, 0.55) 0%, rgba(7, 30, 77, 0.92) 42%, rgba(2, 10, 32, 1) 100%)',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeOut' } }}
    >
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(rgba(243, 217, 143, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(243, 217, 143, 0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {particles.map((dot, index) => (
        <motion.span
          key={`${dot.left}-${dot.top}`}
          className="absolute rounded-full bg-[#f3d98f]/75"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            boxShadow: '0 0 16px rgba(243, 217, 143, 0.45)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: [0.2, 0.8, 0.35],
            y: [8, -10, 4],
            transition: {
              duration: dot.duration,
              delay: dot.delay + index * 0.04,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            },
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(96, 144, 232, 0.22) 0%, rgba(96, 144, 232, 0.08) 18%, rgba(96, 144, 232, 0) 40%)',
        }}
        initial={{ opacity: 0.65, scale: 1.08 }}
        animate={{
          opacity: [0.65, 1, 0.85],
          scale: [1.08, 1, 1.04],
          transition: {
            duration: 3.6,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          },
        }}
      />

      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
        }}
        exit={{
          opacity: 0,
          y: 8,
          transition: { duration: 0.6, ease: 'easeInOut' },
        }}
      >
        <div className="relative flex h-36 w-36 items-center justify-center md:h-44 md:w-44">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#e9dcc2]"
            style={{ boxShadow: '0 0 24px rgba(255, 208, 120, 0.28)' }}
            animate={{
              scale: [1, 1.03, 1],
              opacity: [0.9, 1, 0.9],
              rotate: [0, 4, 0],
              transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-[#b98b2e]/80"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          <motion.img
            src="/voxen-logo.png"
            alt="Voxen Logo"
            className="relative z-10 h-[64%] w-[64%] object-contain"
            style={{ filter: 'drop-shadow(0 0 14px rgba(255, 195, 78, 0.24))' }}
            animate={{
              y: [0, -2, 0],
              scale: [1, 1.015, 1],
              transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>

        <motion.h1
          className="mt-10 text-[11px] font-black uppercase tracking-[0.52em] text-[#f3d98f]/90"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Voxen Intelligence
        </motion.h1>

        <motion.div
          className="mt-4 h-[2px] w-56 overflow-hidden bg-white/10"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#f3d98f]/20 via-[#f3d98f] to-[#f3d98f]/20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.p
          className="mt-3 text-[10px] uppercase tracking-[0.36em] text-[#f3d98f]/65"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Iniciando ecossistema...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
