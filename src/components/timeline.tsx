'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Save, X, ImageIcon, Loader2, Trash2, Maximize2, Pencil, Download, Milestone, Plus, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useCollection, useMemoFirebase, query, collection, orderBy, Firestore } from '@/firebase';
import { FirebaseStorage } from 'firebase/storage';
import { createTimelineEvent, updateTimelineEvent, deleteTimelineEvent, unlockAchievement } from '@/firebase/actions';
import { useToast } from '@/hooks/use-toast';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export interface TimelineEvent {
  id: string;
  title: string;
  date: string; // Stored as 'dd/MM/yyyy' string for display
  imageUrl?: string;
  imagePath?: string;
  createdAt: string; // ISO 8601 string
}

interface TimelineProps {
    firestore: Firestore;
    storage: FirebaseStorage;
    user: any; // Firebase user
}

export function Timeline({ firestore, storage, user }: TimelineProps) {
  const { toast } = useToast();

  const timelineEventsQuery = useMemoFirebase(() => 
    query(collection(firestore, 'voxen_v2_timeline'), orderBy('date', 'desc')),
    [firestore]
  );
  const { data: events, isLoading } = useCollection<TimelineEvent>(timelineEventsQuery);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDate, setEditedDate] = useState(''); // yyyy-MM-dd format for input
  const [editedImageFile, setEditedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEditClick = (event: TimelineEvent, index: number) => {
    setEditingIndex(index);
    setEditedTitle(event.title === "Novo Marco" ? "" : event.title);
    setPreviewImageUrl(event.imageUrl || null);
    setEditedImageFile(null);
    if (event.date && event.date !== 'Definir data') {
      try {
        const parsedDate = parse(event.date, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          setEditedDate(format(parsedDate, 'yyyy-MM-dd'));
        } else {
          setEditedDate('');
        }
      } catch (e) {
        setEditedDate('');
      }
    } else {
      setEditedDate('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = async (index: number) => {
    setIsUploading(true);
    
    try {
        const allItems = [...(events || []), ...createPlaceholders(events || [])];
        const currentItem = allItems[index];
        const isNew = currentItem.id.startsWith('placeholder-');

        const displayDate = editedDate
            ? format(parse(editedDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })
            : '';

        if (isNew) {
            if (!editedTitle || !displayDate) {
                throw new Error("Título e data são obrigatórios.");
            }
            await createTimelineEvent(firestore, storage, {
                title: editedTitle,
                date: displayDate,
                imageFile: editedImageFile || undefined,
            });
            // Unlock timeline creator achievement
            if (user?.uid) await unlockAchievement(firestore, user.uid, 'timeline-creator').catch(console.warn);
        } else {
             const updatePayload: { title?: string, date?: string, imageFile?: File } = {};
             if (editedTitle && editedTitle !== currentItem.title) updatePayload.title = editedTitle;
             if (displayDate && displayDate !== currentItem.date) updatePayload.date = displayDate;
             if (editedImageFile) updatePayload.imageFile = editedImageFile;
            
            if(Object.keys(updatePayload).length > 0) {
                await updateTimelineEvent(firestore, storage, currentItem.id, currentItem.imagePath, updatePayload);
            }
        }
        toast({ title: "Sucesso!", description: "Marco salvo na linha do tempo." });
        setEditingIndex(null);
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: error.message || "Não foi possível salvar o marco.",
        });
    } finally {
        setIsUploading(false);
    }
  };

  const handleDelete = async (event: TimelineEvent) => {
    if (!firestore || !storage || !event.id || event.id.startsWith('placeholder-')) {
      return;
    }
    
    try {
      await deleteTimelineEvent(firestore, storage, event.id, event.imagePath);
      toast({ title: "Sucesso", description: "Marco excluído." });
    } catch(error: any) {
       toast({
            variant: "destructive",
            title: "Erro ao Excluir",
            description: error.message || "Não foi possível excluir o marco.",
        });
    }
    setEditingIndex(null);
  }

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedImageFile(null);
    setPreviewImageUrl(null);
  };

  const createPlaceholders = (existingEvents: TimelineEvent[]) => {
    const placeholderCount = Math.max(0, 1);
    return Array.from({ length: placeholderCount }, (_, i) => ({
      id: `placeholder-${(existingEvents || []).length + i}`,
      title: 'Novo Marco',
      date: 'Definir data',
            imageUrl: undefined,
            imagePath: undefined,
      createdAt: new Date().toISOString(),
    }));
  };

  const displayEvents = events || [];
  const allItems = [...displayEvents, ...createPlaceholders(displayEvents)];

  if (isLoading) {
      return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="w-full max-w-5xl mx-auto mb-20 px-4">
      
      <div className="mb-12 border-b border-primary/20 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-primary/30 rounded-full">
                <Milestone className="w-3.5 h-3.5" /> Histórico Operacional
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-black text-primary tracking-tighter uppercase leading-none">
                Marcos Históricos
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl text-lg font-medium italic">
                Registro cronológico das evidências estratégicas e evoluções da plataforma Voxen.
            </p>
        </div>
        
        {!editingIndex && (
             <Button 
                onClick={() => handleEditClick(allItems[allItems.length - 1], allItems.length - 1)}
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-black uppercase tracking-widest h-12 px-8 rounded-full"
            >
                <Plus className="w-5 h-5 mr-2" /> Novo Registro
            </Button>
        )}
      </div>

      <div className="relative">
        <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-[1px] bg-primary/20 -translate-x-[50%] z-0"></div>

        <div className="space-y-16 relative z-10">
          {displayEvents.map((event, index) => {
            const isEditing = editingIndex === index;
            const isEven = index % 2 === 0;
            
            if (isEditing) {
                return (
                    <div key={`edit-${index}`} className="max-w-2xl mx-auto bg-card border border-primary/40 shadow-2xl p-8 relative z-20 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center border-b border-primary/20 pb-4 mb-8">
                            <h3 className="font-headline font-black text-xl text-primary uppercase tracking-widest">
                                Editar Evento
                            </h3>
                            <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isUploading} className="h-8 w-8 text-primary">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor={`title-${index}`} className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Título do Evento</Label>
                                <Input
                                    id={`title-${index}`}
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    placeholder="Ex: Lançamento Voxen"
                                    disabled={isUploading}
                                    className="bg-background border-primary/30 text-foreground focus-visible:ring-primary h-14 text-lg font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor={`date-${index}`} className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Data</Label>
                                    <Input
                                        id={`date-${index}`}
                                        type="date"
                                        value={editedDate}
                                        onChange={(e) => setEditedDate(e.target.value)}
                                        className="bg-background border-primary/30 text-foreground focus-visible:ring-primary h-14"
                                        disabled={isUploading}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor={`image-upload-${index}`} className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Imagem</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id={`image-upload-${index}`} type="file" onChange={handleImageChange} accept="image/*" className="hidden" disabled={isUploading} />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full bg-background border-primary/30 text-primary hover:bg-primary/10 h-14 font-black text-[10px] uppercase tracking-widest"
                                            onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
                                        >
                                            <ImageIcon className="w-4 h-4 mr-3" /> Anexar Arquivo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {previewImageUrl && (
                                <div className="mt-6 border border-primary/20 relative w-full h-64 bg-black/40 overflow-hidden rounded-md">
                                    <Image src={previewImageUrl} alt="Preview" fill className="object-contain p-4" unoptimized />
                                </div>
                            )}
                        </div>
                        <div className="mt-10 pt-8 border-t border-primary/20 flex justify-between items-center">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <span className="text-[10px] font-black text-destructive hover:text-destructive/80 cursor-pointer flex items-center transition-colors uppercase tracking-widest">
                                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar Registro
                                    </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-background border-primary/40 rounded-none">
                                    <AlertDialogHeader>
                                    <AlertDialogTitle className="text-foreground font-headline uppercase tracking-widest">Confirmar Eliminação</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground italic">Ação irreversível.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-transparent border-primary/30 text-foreground">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(event)} className="bg-destructive text-white">Confirmar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button onClick={() => handleSaveChanges(index)} disabled={isUploading} className="bg-primary hover:bg-primary/80 text-primary-foreground px-10 h-14 font-black uppercase tracking-[0.2em]">
                                {isUploading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Save className="mr-3 h-5 w-5" />} Sincronizar
                            </Button>
                        </div>
                    </div>
                );
            }

            return (
              <div key={event.id} className={cn(
                  "flex flex-col md:flex-row items-center w-full group",
                  isEven ? "md:flex-row-reverse" : ""
              )}>
                  <div className={cn(
                      "w-full md:w-[45%] flex",
                      isEven ? "justify-start" : "justify-end"
                  )}>
                      <div className="bg-card border border-primary/20 rounded-xl shadow-xl hover:border-primary/60 transition-all duration-700 overflow-hidden w-full relative">
                          <div className="p-8">
                              <div className="flex items-center justify-between mb-6">
                                  <div className="flex items-center text-primary bg-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                                      <Calendar className="w-3.5 h-3.5 mr-3" />
                                      {event.date}
                                  </div>
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-9 w-9 text-primary hover:text-primary-foreground hover:bg-primary opacity-0 group-hover:opacity-100 transition-all"
                                      onClick={() => handleEditClick(event, index)}
                                    >
                                      <Pencil className="h-4.5 w-4.5" />
                                  </Button>
                              </div>
                              
                              <h3 className="text-2xl font-headline font-black text-foreground mb-6 uppercase">
                                  {event.title}
                              </h3>

                              {event.imageUrl && (
                                  <Dialog>
                                      <DialogTrigger asChild>
                                          <div className="relative w-full h-64 rounded-lg overflow-hidden cursor-zoom-in bg-black/40 border border-primary/10 group/img">
                                              <Image 
                                                  src={event.imageUrl} 
                                                  alt={event.title} 
                                                  fill 
                                                  className="object-cover opacity-80 group-hover/img:opacity-100 transition-all" 
                                              />
                                          </div>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-[100vw] h-[100vh] p-0 bg-background/95 border-none flex items-center justify-center z-[110]" aria-describedby={undefined}>
                                          <VisuallyHidden><DialogTitle>{event.title}</DialogTitle></VisuallyHidden>
                                          <div className="relative w-full h-full flex items-center justify-center p-8">
                                              <Image src={event.imageUrl} alt={event.title} fill className="object-contain" quality={100} />
                                              <div className="absolute top-8 right-8 flex gap-4 z-[120]">
                                                  <DialogClose asChild>
                                                    <Button variant="secondary" size="icon" className="bg-white/10 hover:bg-white/20 text-white h-12 w-12 rounded-full"><X className="h-6 w-6" /></Button>
                                                  </DialogClose>
                                              </div>
                                          </div>
                                      </DialogContent>
                                  </Dialog>
                              )}
                          </div>
                      </div>
                  </div>

                  <div className="hidden md:flex w-[10%] justify-center items-center relative z-10">
                      <div className="w-4 h-4 rounded-full bg-primary shadow-xl"></div>
                  </div>

                  <div className="hidden md:block w-[45%]"></div>
              </div>
            );
          })}
        </div>
      </div>

      {!editingIndex && (
          <div className="mt-20 flex justify-center">
              <Button 
                onClick={() => handleEditClick(allItems[allItems.length - 1], allItems.length - 1)}
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-black uppercase tracking-[0.2em] h-14 px-12 rounded-full shadow-xl transition-all"
            >
                <Plus className="w-6 h-6 mr-3" /> Adicionar Marco
            </Button>
          </div>
      )}
    </div>
  );
}