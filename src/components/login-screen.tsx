'use client';

import { useState } from 'react';
import { ArrowRight, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const InfoColumn = ({ icon, title, description, alignment = 'left', delay = 0 }: any) => (
    <motion.div 
        className={`text-center md:text-${alignment} flex flex-col items-center`}
        initial={{ opacity: 0, x: alignment === 'left' ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay }}
    >
        <div className="w-20 h-20 mb-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
            {icon}
        </div>
        <h2 className="font-serif font-bold text-xl tracking-widest text-primary/90 mb-4">{title}</h2>
        <p className="text-sm text-primary/60 max-w-xs leading-relaxed">{description}</p>
    </motion.div>
);

/**
 * VERSÃO REENGENHARADA: O componente `AnimatedInputField` foi reconstruído
 * para ser mais robusto e imune a bugs de preenchimento automático do navegador.
 */
const AnimatedInputField = ({ id, type, placeholder }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    const labelVariants = {
        up: { y: -22, scale: 0.85, transformOrigin: 'left' },
        down: { y: 0, scale: 1, transformOrigin: 'left'  }
    };

    return (
        <div className="relative w-full pt-4">
            <motion.label
                htmlFor={id}
                className="absolute left-0 font-light tracking-widest text-primary/60 pointer-events-none"
                variants={labelVariants}
                initial="down"
                animate={(isFocused || value) ? "up" : "down"}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                {placeholder}
            </motion.label>
            <input
                id={id}
                type={type}
                className="w-full bg-transparent outline-none pb-1 text-lg text-white transition-colors duration-300 border-b-2 border-primary/20"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFocused ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
    );
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
    return (
        <motion.div 
            className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-primary p-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
        >
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
                
                <InfoColumn
                    icon={<BookOpen className="w-10 h-10 text-primary/70" />}
                    title="VOXEN ID"
                    description="Sua identidade única no ecossistema Voxen, integrando suas informações e atividades para uma experiência fluida."
                    alignment="left"
                    delay={0.2}
                />

                <motion.div 
                    className="relative w-full max-w-sm mx-auto bg-black/20 border border-white/10 rounded-2xl backdrop-blur-sm p-8 flex flex-col items-center order-first md:order-none overflow-hidden"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <img src="/voxen-logo.png" alt="Voxen Watermark" className="absolute inset-0 w-full h-full object-cover opacity-[0.02] pointer-events-none" />
                    
                    <h3 className="font-serif text-sm tracking-widest text-primary/60 mb-8">PAINEL DE ACESSO</h3>
                    <div className="w-full space-y-10 mb-12">
                        {/* IDs revisados para serem mais específicos */}
                        <AnimatedInputField id="voxenId" type="text" placeholder="ID VOXEN" />
                        <AnimatedInputField id="password" type="password" placeholder="SENHA" />
                    </div>
                    
                    <motion.button 
                        onClick={() => onLogin('user')}
                        className="relative w-full py-4 text-center font-bold tracking-widest bg-primary/90 text-background rounded-lg shadow-lg shadow-primary/20 overflow-hidden"
                        whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div 
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        />
                        ACESSAR
                    </motion.button>
                </motion.div>

                <InfoColumn
                    icon={<User className="w-10 h-10 text-primary/70" />}
                    title="PERFIL & SENHA"
                    description="Mantenha seu perfil seguro com uma senha forte e garanta sua presença protegida na plataforma Voxen."
                    alignment="right"
                    delay={0.2}
                />
            </div>
        </motion.div>
    );
}
