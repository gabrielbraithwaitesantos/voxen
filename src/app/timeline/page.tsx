'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { TimelineSplashScreen } from '@/components/timeline-splash-screen';
import { useUser, useFirestore, useStorage } from '@/firebase';
import { Timeline } from '@/components/timeline';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimelinePage() {
  const [loading, setLoading] = useState(true);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100); 
    return () => clearTimeout(timer);
  }, []);

  const isSplashLoading = loading || isUserLoading;
  const areServicesReady = firestore && storage && user;

  return (
    <div className="relative flex flex-col min-h-screen bg-[#05080c]">
      <div className={cn("fixed inset-0 z-50 pointer-events-none transition-opacity duration-300", !isSplashLoading && "opacity-0")}>
         <TimelineSplashScreen />
      </div>

      <Header className={cn(isSplashLoading && 'invisible')} />
      <main className={cn("flex-grow container mx-auto px-4 py-8 animate-fade-in", isSplashLoading && 'invisible')}>
        {!areServicesReady ? (
           <div className="flex flex-col h-full items-center justify-center pt-24 text-primary">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-4 opacity-60">Conectando ao banco de dados...</p>
          </div>
        ) : (
          <Timeline firestore={firestore} storage={storage} user={user} />
        )}
      </main>
      
      <footer className="py-12 border-t border-primary/10 text-center bg-black/20 mt-24">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 italic">
              Voxen Intelligence Systems &bull; Proteger e Analisar
          </p>
      </footer>
    </div>
  );
}
