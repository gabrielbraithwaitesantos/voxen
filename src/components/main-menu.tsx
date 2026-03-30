'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import { User, LogOut, ChevronRight, LayoutGrid, BarChart2, Users, Settings, LifeBuoy, FileText, Bell, Bot } from 'lucide-react';

interface MainMenuProps {
  userName?: string;
  onLogout?: () => void;
}

interface MenuEntry {
        icon: React.ReactNode;
        title: string;
        description: string;
        delay: number;
        href: Route | '#';
        disabled: boolean;
}

/**
 * O Cartão de Menu Interativo
 * Reage ao mouse e serve como um ponto de entrada para as seções do app.
 */
const MenuItem = ({ icon, title, description, delay, href, disabled }: MenuEntry) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay,
                duration: 0.5
            }
        }
    };

    const content = (
        <motion.div
            variants={itemVariants}
            className={`relative bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-start justify-between group overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!disabled ? { scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="flex flex-col items-start">
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">{icon}</div>
                <h3 className="font-bold text-lg text-primary/90 mb-1">{title}</h3>
                <p className="text-sm text-primary/60 leading-snug">{description}</p>
            </div>
            {!disabled && <ChevronRight className="absolute top-6 right-6 w-5 h-5 text-primary/30 group-hover:text-primary/70 transition-colors" />}
        </motion.div>
    );

    if (disabled) {
        return content;
    }

    return <Link href={href as Route}>{content}</Link>;
};

/**
 * O Menu Principal: O hub central do seu aplicativo.
 * AGORA, o item "Dashboard" é um link funcional.
 */
export function MainMenu({ userName = 'Convidado', onLogout }: MainMenuProps) {
    const menuItems: Omit<MenuEntry, 'delay'>[] = [
        { icon: <LayoutGrid className="w-7 h-7 text-primary/70" />, title: 'Dashboard', description: 'Visão geral do sistema', href: '/dashboard', disabled: false },
        { icon: <BarChart2 className="w-7 h-7 text-primary/70" />, title: 'Relatórios', description: 'Análises e estatísticas', href: '#', disabled: true },
        { icon: <Users className="w-7 h-7 text-primary/70" />, title: 'Usuários', description: 'Gerenciar contas', href: '#', disabled: true },
        { icon: <FileText className="w-7 h-7 text-primary/70" />, title: 'Documentos', description: 'Gerenciar arquivos', href: '#', disabled: true },
        { icon: <Bell className="w-7 h-7 text-primary/70" />, title: 'Notificações', description: 'Central de alertas', href: '#', disabled: true },
        { icon: <Bot className="w-7 h-7 text-primary/70" />, title: 'Automações', description: 'Configurar robôs', href: '#', disabled: true },
        { icon: <LifeBuoy className="w-7 h-7 text-primary/70" />, title: 'Suporte', description: 'Ajuda e tutoriais', href: '#', disabled: true },
        { icon: <Settings className="w-7 h-7 text-primary/70" />, title: 'Configurações', description: 'Ajustes da conta', href: '#', disabled: true },
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-primary p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Barra Superior */}
            <motion.header
                className="absolute top-0 left-0 right-0 h-20 px-8 flex justify-between items-center"
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
                <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-primary/80" />
                    <span className="font-bold text-lg">{userName}</span>
                </div>
                <motion.button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                </motion.button>
            </motion.header>

            {/* Grade de Menu */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {menuItems.map((item, index) => (
                    <MenuItem key={index} {...item} delay={0.4 + (index * 0.05)} />
                ))}
            </motion.div>

            {/* Barra Inferior */}
            <motion.footer
                className="absolute bottom-0 left-0 right-0 h-16 px-8 flex justify-between items-center"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
                <img src="/voxen-logo.png" alt="Voxen Logo" className="w-8 h-8 opacity-40" />
                <span className="text-xs text-primary/30">Versão 1.0.0</span>
            </motion.footer>
        </motion.div>
    );
}
