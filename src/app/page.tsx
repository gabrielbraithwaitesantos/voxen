'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SplashEntryPage() {
  return (
    <motion.main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at center, rgba(26, 63, 133, 0.62) 0%, rgba(7, 30, 77, 0.93) 42%, rgba(2, 10, 32, 1) 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-[#020a18]"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.08, 0] }}
        transition={{ duration: 1.05, times: [0, 0.72, 1], ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute inset-y-0 left-[-42%] w-[38%] -skew-x-12 bg-gradient-to-r from-transparent via-[#f0d9a0]/16 to-transparent"
        initial={{ x: '0%' }}
        animate={{ x: ['0%', '300%'] }}
        transition={{ duration: 1.3, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,144,232,0.28),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,8,20,0.1),rgba(3,8,20,0.72))]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Link href="/login" aria-label="Entrar no login Voxen">
          <motion.div
            className="group relative flex h-44 w-44 cursor-pointer items-center justify-center rounded-full sm:h-52 sm:w-52 md:h-60 md:w-60"
            initial={{ opacity: 0, y: 20, scale: 0.76, rotate: -7 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.95, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 230, damping: 22 } }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute -inset-5 rounded-full bg-[#f1e0b8]/16 blur-xl"
              animate={{ scale: [0.96, 1.08, 0.96], opacity: [0.03, 0.15, 0.03] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="absolute -inset-2 rounded-full border border-[#f1e0b8]/34"
              style={{ boxShadow: '0 0 46px rgba(255, 208, 120, 0.24)' }}
              animate={{
                scale: [0.985, 1.03, 0.985],
                opacity: [0.26, 0.56, 0.26],
                transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            <motion.div
              className="relative h-[83%] w-[83%] overflow-hidden rounded-full shadow-[0_0_36px_rgba(255,208,120,0.2)]"
              animate={{
                y: [0, -1.1, 0],
                scale: [0.99, 1.02, 0.99],
                boxShadow: [
                  '0 0 14px rgba(255,208,120,0.14)',
                  '0 0 28px rgba(255,208,120,0.28)',
                  '0 0 14px rgba(255,208,120,0.14)',
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 grid place-items-center">
                <img
                  src="/voxen-logo-clean.png"
                  alt="Voxen"
                  className="h-full w-full origin-center object-contain"
                  style={{ objectPosition: '50% 50%', filter: 'drop-shadow(0 0 14px rgba(255, 195, 78, 0.22))' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </Link>

        <motion.p
          className="mt-10 text-[10px] uppercase tracking-[0.24em] text-[#f0d9a0]/85 sm:mt-11 sm:text-[11px] sm:tracking-[0.38em]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          Toque na insígnia para iniciar
        </motion.p>
      </div>
    </motion.main>
  );
}

