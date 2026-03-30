'use client';

import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { Pause, Music2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFirestore, useDoc, doc, useMemoFirebase, useUser } from '@/firebase';

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([0.3]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nodeRef = useRef(null);

  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const musicConfigRef = useMemoFirebase(() => {
    // Only query if firestore is available and user is authenticated (not loading and not null)
    if (!firestore || isUserLoading || !user) return null;
    return doc(firestore, 'config', 'backgroundMusic');
  }, [firestore, user, isUserLoading]);

  const { data: config } = useDoc(musicConfigRef);
  const musicUrl = config?.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  // Do not render if auth is still pending to avoid flickering or permission errors
  if (isUserLoading) return null;

  return (
    <Draggable nodeRef={nodeRef} cancel=".no-drag">
      <motion.div
        ref={nodeRef}
        className="fixed top-4 right-4 z-50 flex items-center group cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />

        <div className={cn('flex items-center bg-[#050C14]/80 backdrop-blur-md border border-[#8D6F3D]/20 rounded-full shadow-lg p-1 transition-all duration-500 ease-out overflow-hidden')}>
          <div className={cn('max-w-0 opacity-0 overflow-hidden transition-all duration-500 ease-out flex items-center gap-3', 'group-hover:max-w-[400px] group-hover:opacity-100 group-hover:mr-3')}>
            <div className="flex items-center gap-2 pl-3">
                <div className="w-20 no-drag">
                    <Slider
                        defaultValue={[0.3]}
                        max={1}
                        step={0.01}
                        value={isMuted ? [0] : volume}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-[#8D6F3D] hover:text-[#D8CCAB] hover:bg-[#8D6F3D]/10 no-drag"
                    onClick={toggleMute}
                >
                    {isMuted || volume[0] === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </Button>
            </div>
            <div className="h-6 w-[1px] bg-[#8D6F3D]/20"></div>
            <div className="flex flex-col min-w-[80px] no-drag text-right">
                <span className="text-[9px] font-black text-[#8D6F3D] uppercase tracking-wider leading-none">Ambiente Som</span>
                <span className="text-[10px] text-[#D8CCAB]/60 font-bold uppercase tracking-tighter mt-1">Operacional</span>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'rounded-full h-9 w-9 shrink-0 text-[#8D6F3D] hover:bg-[#8D6F3D]/10 transition-colors relative no-drag',
                    isPlaying && 'animate-pulse-slow'
                  )}
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-[#050C14] border-[#8D6F3D]/30 text-[#D8CCAB]">
                <p>{isPlaying ? 'Pausar Transmissão' : 'Iniciar Trilha Voxen'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    </Draggable>
  );
}
