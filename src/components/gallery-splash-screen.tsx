
'use client';

import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export function GallerySplashScreen() {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at center, rgba(23, 56, 104, 0.62) 0%, rgba(7, 26, 64, 0.9) 44%, rgba(4, 10, 28, 1) 100%)',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 1.2, times: [0, 0.82, 1], ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute h-56 w-56 rounded-full border border-primary/30"
        animate={{ scale: [0.95, 1.05, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 1.15, ease: 'easeInOut' }}
      />

      <div className="relative text-center">
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-black/25">
            <Camera className="h-7 w-7 text-primary" />
          </div>
        </motion.div>

        <motion.h1
          className="font-headline text-4xl font-bold text-white md:text-5xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          Eventos & Galeria
        </motion.h1>
        <motion.p
          className="mt-2 text-xs font-medium uppercase tracking-[0.35em] text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          Acervo Voxen
        </motion.p>
      </div>
    </motion.div>
  );
}
