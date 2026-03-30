'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Mic, Square, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface MessageFormProps {
  onNewMessage: (data: { text?: string; imageFile?: File; audioFile?: File }) => Promise<void>;
  currentUser: string;
  onUserChange: (user: string) => void;
}

export function MessageForm({ onNewMessage, currentUser, onUserChange }: MessageFormProps) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const file = new File([audioBlob], `voxen_audio_${Date.now()}.mp3`, { type: 'audio/mp3' });
        setIsSubmitting(true);
        try { await onNewMessage({ audioFile: file }); } finally { setIsSubmitting(false); setRecordingDuration(0); }
      };
      mediaRecorder.start();
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => setRecordingDuration((prev) => prev + 1), 1000);
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Protocolo de Áudio Falhou", 
        description: "Permissão de microfone negada ou indisponível."
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && !imageFile) return;
    setIsSubmitting(true);
    try {
      await onNewMessage({ text, imageFile: imageFile || undefined });
      setText('');
      removeImage();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-primary/30 p-4 max-w-3xl mx-auto w-full shadow-2xl relative">
      
      {previewUrl && (
        <div className="relative inline-block mb-6 ml-2">
          <div className="relative h-28 w-28 border-2 border-primary/40 shadow-2xl overflow-hidden shrink-0">
            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
          </div>
          <button
            onClick={removeImage}
            className="absolute -top-3 -right-3 bg-primary text-background hover:bg-foreground p-1 shadow-2xl transition-all"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isRecording && (
          <div className="flex items-center justify-between bg-primary/10 text-foreground px-6 py-5 mb-5 border border-primary/20">
              <div className="flex items-center gap-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Capturando evidência sonora: {formatDuration(recordingDuration)}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-foreground hover:bg-primary/10 font-black text-[9px] uppercase tracking-widest"
                onClick={stopRecording}
              >
                  <Square className="w-3 h-3 mr-2 fill-current" />
                  Concluir Transmissão
              </Button>
          </div>
      )}

      <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row items-stretch sm:items-end gap-4", isRecording && "hidden")}>
        
        <div className="flex-shrink-0 w-full sm:w-auto">
           <select 
              value={currentUser}
              onChange={(e) => onUserChange(e.target.value)}
              className="w-full sm:w-auto bg-background border border-primary/40 text-foreground text-[10px] uppercase tracking-[0.2em] font-black p-4 outline-none focus:border-primary transition-all"
           >
             <option value="Agente Principal">Agente Principal</option>
             <option value="Analista Forense">Analista Forense</option>
             <option value="Unidade de Inteligência">Unidade de Inteligência</option>
             <option value="Investigador de Campo">Investigador de Campo</option>
           </select>
        </div>

        <div className="relative flex-grow flex items-end bg-background/80 border border-primary/30 focus-within:border-primary transition-all overflow-hidden">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-14 w-14 shrink-0 text-primary hover:text-foreground hover:bg-primary/10 border-r border-primary/20 rounded-none"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                title="Capturar Evidência Visual"
            >
                <ImageIcon className="w-5 h-5" />
            </Button>
            
            <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Insira o relatório operacional..."
                className="min-h-[56px] max-h-[150px] resize-none border-0 bg-transparent focus-visible:ring-0 px-6 py-4.5 text-[15px] text-foreground placeholder:text-primary/30 font-medium italic"
                disabled={isSubmitting}
                rows={1}
            />

            {!text.trim() && !imageFile ? (
                 <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-14 w-14 shrink-0 transition-all border-l border-primary/20 rounded-none",
                        isRecording ? "text-background bg-primary" : "text-primary hover:text-foreground hover:bg-primary/10"
                    )}
                    onClick={startRecording}
                    disabled={isSubmitting}
                    title="Iniciar Transmissão de Áudio"
                >
                    <Mic className="w-5 h-5" />
                </Button>
            ) : (
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={(!text.trim() && !imageFile) || isSubmitting}
                    className="h-14 w-14 shrink-0 text-primary hover:text-foreground hover:bg-primary/10 border-l border-primary/20 rounded-none"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Send className="w-6 h-6" />
                    )}
                </Button>
            )}
        </div>
      </form>
    </div>
  );
}
