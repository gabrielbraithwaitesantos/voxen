'use client';

import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Download, Clock, AlertCircle, Maximize2, X, ThumbsUp, MessageSquare, FileText, Search, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { CustomAudioPlayer } from './custom-audio-player';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Card } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  imagePath?: string;
  audioUrl?: string;
  audioPath?: string;
  timestamp: any;
  likes: string[];
  status?: 'sending' | 'sent' | 'failed';
}

interface MessageListProps {
  messages: Message[];
  currentUser: string;
  onDeleteMessage: (message: Message) => void;
  onToggleLike: (id: string) => void;
}

function FormattedTimestamp({ timestamp, status }: { timestamp: any, status?: Message['status'] }) {
  const [formattedDate, setFormattedDate] = useState('');
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (timestamp) {
      try {
        let jsDate;
        if (typeof timestamp === 'object' && timestamp !== null && typeof timestamp.toDate === 'function') {
            jsDate = timestamp.toDate();
        } else {
            jsDate = new Date(timestamp);
        }

        if (isValid(jsDate)) {
            setFormattedDate(format(jsDate, "dd MMM yyyy 'às' HH:mm", { locale: ptBR }));
            
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - jsDate.getTime()) / 1000);
            
            if (diffInSeconds < 60) setTimeAgo('AGORA');
            else if (diffInSeconds < 3600) setTimeAgo(`${Math.floor(diffInSeconds / 60)}M ATRÁS`);
            else if (diffInSeconds < 86400) setTimeAgo(`${Math.floor(diffInSeconds / 3600)}H ATRÁS`);
            else setTimeAgo(format(jsDate, "dd/MM", { locale: ptBR }));
        }
      } catch (e) {}
    }
  }, [timestamp]);

  const statusIcon = () => {
    if (status === 'sending') return <Clock className="w-3 h-3 ml-2 text-primary" />;
    if (status === 'failed') return <AlertCircle className="w-3 h-3 ml-2 text-destructive" />;
    return null;
  }

  return (
    <div className="flex items-center text-[9px] text-primary font-black tracking-widest uppercase" title={formattedDate}>
      {timeAgo}
      {statusIcon()}
    </div>
  );
}

export function MessageList({ messages, currentUser, onDeleteMessage, onToggleLike }: MessageListProps) {
  return (
    <div className="space-y-12 pt-4 pb-24 max-w-3xl mx-auto px-4">
      
      {messages.length === 0 ? (
        <Card className="text-center py-24 bg-transparent border-2 border-dashed border-primary/20 rounded-none">
            <Search className="w-16 h-16 text-primary/10 mx-auto mb-6" />
            <p className="text-foreground font-black text-xl uppercase tracking-widest">Sem Arquivos Registrados</p>
            <p className="text-[10px] text-primary mt-3 font-bold uppercase tracking-[0.3em]">Aguardando relatórios de campo...</p>
        </Card>
      ) : (
        messages.map((message) => {
          const userHasLiked = message.likes?.includes(currentUser);
          const isCurrentUserMessage = message.sender === currentUser;
          const initials = message.sender.substring(0, 1).toUpperCase();

          return (
            <Card 
              key={message.id} 
              className={cn(
                "overflow-hidden transition-all duration-500 bg-card/40 shadow-2xl border border-primary/20 rounded-none group relative",
                message.status === 'failed' && "border-destructive/40"
              )}
            >
                <div className="flex items-start justify-between p-7 pb-5 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="h-12 w-12 bg-primary flex items-center justify-center font-black text-sm text-background shadow-xl border border-foreground/20">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] font-black text-foreground leading-none uppercase tracking-[0.2em]">{message.sender}</span>
                            <div className="mt-2.5">
                                <FormattedTimestamp timestamp={message.timestamp} status={message.status} />
                            </div>
                        </div>
                    </div>

                    {isCurrentUserMessage && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:text-foreground hover:bg-white/5">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border-primary/30 rounded-none text-foreground">
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-bold text-[10px] uppercase tracking-widest p-3"
                                    onClick={() => onDeleteMessage(message)}
                                >
                                    <Trash2 className="w-4 h-4 mr-3" /> Eliminar Evidência
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="px-8 pb-8 relative z-10">
                  {message.text && (
                    <div className="relative">
                        <div className="absolute left-[-20px] top-0 bottom-0 w-[2px] bg-primary/30"></div>
                        <p className="text-[16px] text-foreground/90 whitespace-pre-wrap leading-relaxed font-medium italic py-1 tracking-tight">
                        "{message.text}"
                        </p>
                    </div>
                  )}
                </div>

                {message.imageUrl && (
                     <div className="w-full bg-black/40 border-y border-primary/20 relative h-[450px] overflow-hidden shrink-0">
                         <Dialog>
                            <DialogTrigger asChild>
                                <div className="relative w-full h-full cursor-zoom-in group/img">
                                   <Image 
                                     src={message.imageUrl} 
                                     alt="Evidência Visual" 
                                     fill
                                     className="object-cover transition-transform duration-[2s] group-hover/img:scale-105 opacity-70 group-hover/img:opacity-100" 
                                   />
                                   <div className="absolute inset-0 bg-background/30 group-hover/img:bg-transparent transition-all duration-700"></div>
                                   <div className="absolute top-4 left-4 bg-primary text-background px-2 py-1 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/img:opacity-100 transition-opacity">
                                       Evidence #{(message.id.substring(0, 4)).toUpperCase()}
                                   </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent 
                                className="max-w-[100vw] h-[100vh] p-0 bg-background/98 border-none shadow-none flex items-center justify-center z-[110]"
                                aria-describedby={undefined}
                            >
                                <VisuallyHidden><DialogTitle>Evidência Expandida</DialogTitle></VisuallyHidden>
                                <div className="relative w-full h-full flex items-center justify-center p-8">
                                    <Image 
                                        src={message.imageUrl} 
                                        alt="Expandido" 
                                        fill 
                                        className="object-contain"
                                        quality={100}
                                    />
                                    <div className="absolute top-8 right-8 flex gap-4 z-[120]">
                                        <a href={message.imageUrl} download target="_blank" rel="noopener noreferrer">
                                           <Button size="icon" variant="secondary" className="bg-primary text-background hover:bg-foreground h-12 w-12 rounded-none border-none shadow-2xl">
                                               <Download className="h-6 w-6" />
                                           </Button>
                                        </a>
                                        <DialogClose asChild>
                                          <Button variant="secondary" size="icon" className="bg-white/10 hover:bg-white/20 text-foreground h-12 w-12 rounded-none border-none backdrop-blur-md">
                                              <X className="h-6 w-6" />
                                          </Button>
                                        </DialogClose>
                                    </div>
                                </div>
                            </DialogContent>
                         </Dialog>
                     </div>
                  )}

                  {message.audioUrl && (
                     <div className="px-8 py-5 bg-primary/5 border-t border-primary/10 relative z-10">
                        <div className="text-[9px] text-primary font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Transmissão de Áudio Forense
                        </div>
                        <CustomAudioPlayer src={message.audioUrl} />
                     </div>
                  )}

                <div className="px-3 py-1 border-t border-primary/10 flex items-center gap-2 relative z-10 bg-black/20">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className={cn(
                            "h-11 px-6 rounded-none text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/10 transition-all flex-1 justify-center",
                            userHasLiked && "text-foreground bg-primary/20"
                        )}
                        onClick={() => onToggleLike(message.id)}
                    >
                        <ThumbsUp className={cn("w-4 h-4 mr-3", userHasLiked && "fill-current")} />
                        Verificar {message.likes && message.likes.length > 0 && <span className="ml-3 bg-primary text-background px-2 py-0.5">{message.likes.length}</span>}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="h-11 px-6 rounded-none text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/10 transition-all flex-1 justify-center">
                        <MessageSquare className="w-4 h-4 mr-3" />
                        Anotar
                    </Button>
                </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
