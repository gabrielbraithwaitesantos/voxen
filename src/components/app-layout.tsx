'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { 
    Home, MessageSquare, BookOpen, UserCircle, Users, Lightbulb, Award, 
    Scale, Cpu, Globe, Shield, School, LineChart, Pencil, HelpCircle, Voicemail, 
    PenTool, MessageCircle as MessageCircleIcon, Clipboard, Calendar, Video, UserPlus, 
    LogOut, Menu, X, PanelLeftClose
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppLayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

interface NavItem {
    name: string;
    icon: LucideIcon;
    href: Route;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const VoxenSidebarIcon = ({ className }: { className?: string }) => (
    <div className={cn("relative", className)}>
    <Image 
            src="/voxen-logo-clean.png" 
      alt="Voxen Logo" 
      fill 
        className="object-contain drop-shadow-[0_0_10px_rgba(255,208,120,0.2)]"
      priority
            unoptimized
    />
  </div>
);

const navSections: NavSection[] = [
    {
        title: 'Início',
        items: [
            { name: 'Bem-vindo', icon: Home, href: '/home' },
            { name: 'Diretrizes', icon: BookOpen, href: '/guidelines' },
            { name: 'Avisos Gerais', icon: MessageSquare, href: '/announcements' },
            { name: 'Meu Voxen ID', icon: UserCircle, href: '/profile' },
        ]
    },
    {
        title: 'Comunidade',
        items: [
            { name: 'Visão Geral', icon: Home, href: '/community' },
            { name: 'Chat Geral', icon: Users, href: '/community/chat' },
            { name: 'Sugestões', icon: Lightbulb, href: '/community/suggestions' },
            { name: 'Conquistas', icon: Award, href: '/community/achievements' },
        ]
    },
    {
        title: 'Conhecimento',
        items: [
            { name: 'Visão Geral', icon: Home, href: '/knowledge' },
            { name: 'Éthos & Logos', icon: Scale, href: '/knowledge/ethos-logos' },
            { name: 'Automação & IA', icon: Cpu, href: '/knowledge/automation-ai' },
            { name: 'Sistemas do Mundo', icon: Globe, href: '/knowledge/world-systems' },
            { name: 'Apologética', icon: Shield, href: '/knowledge/apologetics' },
            { name: 'Academia', icon: School, href: '/knowledge/academy' },
            { name: 'Gestão de Capital', icon: LineChart, href: '/knowledge/capital-management' },
        ]
    },
    {
        title: 'Laboratório de Inglês',
        items: [
            { name: 'Visão Geral', icon: Home, href: '/lab' },
            { name: 'Prática Diária', icon: Pencil, href: '/lab/daily-practice' },
            { name: 'Suporte de Base', icon: HelpCircle, href: '/lab/support' },
            { name: 'Sala de Voz', icon: Voicemail, href: '/lab/voice-room' },
        ]
    },
    {
        title: 'Hub de Elite',
        items: [
            { name: 'Visão Geral', icon: Home, href: '/elite' },
            { name: 'Retórica & Escrita', icon: PenTool, href: '/elite/rhetoric' },
            { name: 'Debate Avançado', icon: MessageCircleIcon, href: '/elite/debate' },
            { name: 'Mentoria & Feedback', icon: Clipboard, href: '/elite/mentorship' },
        ]
    },
     {
        title: 'Cronograma',
        items: [
            { name: 'Visão Geral', icon: Home, href: '/schedule' },
            { name: 'Agenda Semanal', icon: Calendar, href: '/schedule/weekly' },
            { name: 'Sala de Call (Grupo)', icon: Video, href: '/schedule/group-call' },
            { name: 'Agendamento 1-on-1', icon: UserPlus, href: '/schedule/one-on-one' },
        ]
    },
];

export function AppLayout({ children, onLogout }: AppLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setDesktopCollapsed] = useState(false);
    const [username, setUsername] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedSidebarState = localStorage.getItem('voxen-sidebar-collapsed');

        if (storedUsername) {
            setUsername(storedUsername);
        }

        if (storedSidebarState === '1') {
            setDesktopCollapsed(true);
        }
    }, []);

    const handleDesktopSidebarToggle = () => {
        setDesktopCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem('voxen-sidebar-collapsed', next ? '1' : '0');
            return next;
        });
    };

    const desktopSidebarWidth = isDesktopCollapsed ? 84 : 280;

    const SidebarContent = ({ collapsed = false, mobile = false }: { collapsed?: boolean; mobile?: boolean }) => (
        <div className="flex flex-col h-full bg-[#0C101A] text-gray-300 border-r border-primary/10">
            <div className={cn("border-b border-primary/10", collapsed ? "px-2 py-4" : "px-4 py-5")}>
                <AnimatePresence mode="wait" initial={false}>
                    {collapsed ? (
                        <motion.div
                            key="sidebar-header-collapsed"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center gap-3"
                        >
                            <button
                                type="button"
                                onClick={handleDesktopSidebarToggle}
                                className="group inline-flex items-center justify-center"
                                title="Abrir menu"
                                aria-label="Abrir menu lateral"
                            >
                                <motion.div
                                    className="rounded-full border border-primary/25 bg-black/25 p-1.5"
                                    whileHover={{ scale: 1.06, borderColor: 'rgba(161,138,90,0.45)', backgroundColor: 'rgba(0,0,0,0.4)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <VoxenSidebarIcon className="w-11 h-11" />
                                </motion.div>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sidebar-header-expanded"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center justify-between gap-3"
                        >
                            <Link href="/home" className="inline-flex min-w-0 items-center gap-3 text-white group">
                                <motion.div
                                    className="rounded-full border border-primary/25 bg-black/25 p-1.5"
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <VoxenSidebarIcon className="w-12 h-12" />
                                </motion.div>
                                <motion.span
                                    className="text-lg font-headline font-black tracking-[0.18em]"
                                    initial={false}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    VOXEN
                                </motion.span>
                            </Link>

                            {!mobile && (
                                <button
                                    onClick={handleDesktopSidebarToggle}
                                    className="h-9 w-9 flex items-center justify-center border border-primary/25 text-primary/70 hover:text-primary hover:border-primary/50 transition-all duration-200"
                                    title="Recolher menu"
                                    aria-label="Recolher menu lateral"
                                >
                                    <PanelLeftClose className="h-4 w-4" />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <nav className={cn("flex-1 overflow-y-auto transition-all duration-300", collapsed ? "px-2 py-6 space-y-6" : "px-4 py-8 space-y-8") }>
                {navSections.map(section => (
                    <div key={section.title}>
                        <motion.h3
                            className={cn(
                                "px-4 overflow-hidden text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]"
                            )}
                            initial={false}
                            animate={
                                collapsed
                                    ? { opacity: 0, y: -6, height: 0, marginBottom: 0 }
                                    : { opacity: 1, y: 0, height: 16, marginBottom: 16 }
                            }
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {section.title}
                        </motion.h3>
                        <div className="space-y-1.5">
                            {section.items.map(item => {
                                const isActive = pathname === item.href;
                                return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        if (mobile) {
                                            setSidebarOpen(false);
                                        }
                                    }}
                                    title={collapsed ? item.name : undefined}
                                    className={cn(
                                        "flex items-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-300",
                                        collapsed ? "justify-center px-0" : "px-4",
                                        isActive 
                                            ? collapsed ? "bg-primary/10 text-primary border-l-2 border-primary" : "bg-primary/10 text-primary border-r-2 border-primary"
                                            : "text-gray-500 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4 shrink-0", collapsed ? "mr-0" : "mr-4", isActive ? "text-primary" : "text-gray-600")} />
                                    <motion.span
                                        className="inline-block overflow-hidden whitespace-nowrap"
                                        initial={false}
                                        animate={
                                            collapsed
                                                ? { opacity: 0, x: -8, maxWidth: 0 }
                                                : { opacity: 1, x: 0, maxWidth: 220 }
                                        }
                                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {item.name}
                                    </motion.span>
                                </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className={cn("border-t border-primary/10 bg-black/20", collapsed ? "p-3" : "p-6")}>
                <AnimatePresence mode="wait" initial={false}>
                    {collapsed ? (
                        <motion.div
                            key="sidebar-footer-collapsed"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-primary/20 flex items-center justify-center font-black text-primary border border-primary/20">
                                {username ? username.charAt(0).toUpperCase() : 'V'}
                            </div>
                            <button onClick={onLogout} className="text-gray-600 hover:text-primary transition-colors p-2" title="Sair" aria-label="Sair">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sidebar-footer-expanded"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/20 flex items-center justify-center font-black text-primary border border-primary/20">
                                    {username ? username.charAt(0).toUpperCase() : 'V'}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-wider">{username || 'Visitante'}</p>
                                    <p className="text-[9px] text-primary/40 font-bold uppercase tracking-widest">Nível: Discípulo</p>
                                </div>
                            </div>
                            <button onClick={onLogout} className="text-gray-600 hover:text-primary transition-colors p-2" title="Sair" aria-label="Sair">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#05080c]">
            <div className="md:hidden fixed top-6 left-6 z-50">
                 <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-3 bg-black/80 backdrop-blur-xl border border-primary/20 text-primary shadow-2xl">
                    {isSidebarOpen ? <X size={24}/> : <Menu size={24} />}
                </button>
            </div>

            <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-30 md:hidden"
                    />
                    <motion.div
                        initial={{ x: '-103%', opacity: 0.92 }}
                        animate={{ x: '0%', opacity: 1 }}
                        exit={{ x: '-103%', opacity: 0.92 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-y-0 left-0 z-40 w-[74vw] max-w-[17.5rem] md:hidden"
                    >
                        <SidebarContent mobile />
                    </motion.div>
                </>
            )}
            </AnimatePresence>

            <motion.aside
                className="hidden md:flex md:flex-shrink-0 overflow-hidden"
                initial={false}
                animate={{ width: desktopSidebarWidth }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="flex flex-col w-full">
                    <SidebarContent collapsed={isDesktopCollapsed} />
                </div>
            </motion.aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto bg-[#05080c] scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}
