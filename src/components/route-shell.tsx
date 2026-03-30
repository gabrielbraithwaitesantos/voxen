'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';

const PUBLIC_ROUTES = new Set(['/', '/login', '/hub']);

export function RouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = pathname ? PUBLIC_ROUTES.has(pathname) : false;

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/');
  };

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <AppLayout onLogout={handleLogout}>{children}</AppLayout>;
}
