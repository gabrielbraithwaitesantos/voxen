'use client';
import { ChevronDown, Menu, X, Lock } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VoxenIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative w-16 h-16", className)}>
    <Image 
      src="/voxen-logo.png" 
      alt="Voxen Logo" 
      fill 
      className="object-contain"
      priority
      unoptimized
    />
  </div>
);

export function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('Investigador');

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);

  const navigation: Array<{ name: string; href: Route }> = [
    { name: 'Arquivos do Caso', href: '/home' },
    { name: 'Marcos Históricos', href: '/timeline' },
    { name: 'Evidências Visuais', href: '/gallery' },
  ];

  return (
    <header className={cn("bg-background/95 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-2xl", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-3">
            <Link href="/home" className="flex items-center gap-2 group">
              <div className="text-primary transition-transform group-hover:scale-110 duration-500">
                  <VoxenIcon />
              </div>
              <div className="flex flex-col">
                  <span className="font-headline text-2xl font-black tracking-widest leading-none text-foreground">
                    VOXEN
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.4em] text-primary font-bold mt-1.5 opacity-70">
                      Investigative English
                  </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-12">
             {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 py-2 border-b-2",
                      isActive
                        ? "text-foreground border-primary"
                        : "text-foreground/40 border-transparent hover:text-foreground hover:border-primary/50"
                    )}
                  >
                    {item.name}
                  </Link>
                );
             })}
          </nav>

          <div className="flex items-center gap-5">
             <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-primary/5 border border-primary/20">
                <Lock className="w-3 h-3 text-primary/60" />
                <span className="text-[8px] font-black uppercase tracking-widest text-foreground/60">Criptografia Ativa</span>
             </div>
             
             <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-3 py-2 transition-all group border border-transparent hover:border-primary/10">
                 <div className="h-9 w-9 bg-primary/10 flex items-center justify-center font-black text-xs border border-primary/30 text-foreground group-hover:bg-primary group-hover:text-background transition-all">
                    {username.charAt(0).toUpperCase()}
                 </div>
                 <div className="hidden sm:flex flex-col items-start">
                     <span className="text-[11px] font-black leading-none text-foreground uppercase tracking-wider">{username}</span>
                     <span className="text-[9px] text-primary/60 font-bold mt-1.5 uppercase tracking-tighter">Status: Autenticado</span>
                 </div>
                 <ChevronDown className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
             </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:bg-white/10"
              >
                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/98 md:hidden z-40 backdrop-blur-xl"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-background border-r border-primary/20 p-10 md:hidden z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-20">
                    <VoxenIcon />
                    <div className="flex flex-col">
                        <span className="font-headline text-2xl font-black text-foreground tracking-widest">VOXEN</span>
                        <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Investigative</span>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-foreground/60 text-xs uppercase tracking-[0.3em] font-black border-l-2 border-transparent hover:border-primary hover:text-foreground hover:pl-4 transition-all"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
