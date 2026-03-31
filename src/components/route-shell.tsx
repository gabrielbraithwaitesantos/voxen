'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser, doc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { UserProfile } from '@/models/types';

const PUBLIC_ROUTES = new Set(['/', '/login', '/voxen-id']);

const isPathInSection = (path: string, base: string): boolean => path === base || path.startsWith(`${base}/`);

export function RouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const isPublicRoute = pathname ? PUBLIC_ROUTES.has(pathname) : false;

  const userProfileQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'voxen_v2_users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileQuery);

  const role = userProfile?.role || 'disciple';
  const hasAccessModel = Boolean(userProfile?.access || userProfile?.onboarding);
  const canAccessKnowledge = hasAccessModel
    ? Boolean(userProfile?.access?.knowledgeUnlocked || userProfile?.onboarding?.completedAt)
    : true;
  const canAccessLab = hasAccessModel ? (userProfile?.access?.labUnlocked ?? true) : true;
  const canAccessElite = hasAccessModel
    ? Boolean(userProfile?.access?.eliteUnlocked || role === 'tutor' || role === 'admin')
    : role === 'tutor' || role === 'admin';

  const isKnowledgeRoute = pathname ? isPathInSection(pathname, '/knowledge') : false;
  const isLabRoute = pathname ? isPathInSection(pathname, '/lab') : false;
  const isEliteRoute = pathname ? isPathInSection(pathname, '/elite') : false;

  const blockedDestination = !isPublicRoute && user && !isProfileLoading
    ? isKnowledgeRoute && !canAccessKnowledge
      ? '/home'
      : isLabRoute && !canAccessLab
        ? '/home'
        : isEliteRoute && !canAccessElite
          ? '/home'
          : null
    : null;

  useEffect(() => {
    if (isPublicRoute && !isUserLoading && user && pathname === '/login') {
      router.replace('/home');
    }
  }, [isPublicRoute, isUserLoading, user, pathname, router]);

  useEffect(() => {
    if (!isPublicRoute && !isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isPublicRoute, isUserLoading, user, router]);

  useEffect(() => {
    if (blockedDestination && pathname !== blockedDestination) {
      router.replace(blockedDestination);
    }
  }, [blockedDestination, pathname, router]);

  const handleLogout = async () => {
    localStorage.removeItem('username');
    await signOut(auth).catch(console.error);
    router.push('/login');
  };

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isUserLoading || !pathname || !user || isProfileLoading || blockedDestination) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080c] text-primary">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary/70">Sincronizando acesso...</p>
      </div>
    );
  }

  return <AppLayout onLogout={handleLogout}>{children}</AppLayout>;
}
