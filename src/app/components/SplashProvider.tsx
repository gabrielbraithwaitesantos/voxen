'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from '@/app/components/SplashScreen';

const SPLASH_DURATION_MS = 3600;

/**
 * O Mestre de Cerimônias.
 * Orquestra a apresentação da "Gênese" e a transição para o aplicativo.
 */
export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
