'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';
import { LoginScreen } from '@/components/login-screen';

/**
 * AppManager (Maestro Atualizado)
 * Ouve o evento `onAnimationComplete` do novo splash screen "Signature"
 * para criar uma transição suave e automática para a próxima tela.
 */
export function AppManager() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  // A transição agora é acionada pelo término da animação, não por um clique.
  const handleAnimationComplete = () => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      router.push('/home');
    } else {
      setShowSplash(false); // Revela a tela de login
    }
  };

  const handleLogin = (name: string) => {
    localStorage.setItem('username', name);
    router.push('/home');
  };

  if (showSplash) {
    // O maestro agora ouve a conclusão da animação.
    return <SplashScreen onAnimationComplete={handleAnimationComplete} />;
  }

  return <LoginScreen onLogin={handleLogin} />;
}
