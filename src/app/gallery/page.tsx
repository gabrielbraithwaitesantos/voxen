'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { useUser, useFirestore, useCollection, useMemoFirebase, collection, query, orderBy, useStorage } from '@/firebase';
import { createGalleryImage, updateGalleryImage, deleteGalleryImage, unlockAchievement } from '@/firebase/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, ImageIcon, Loader2, Trash2, Maximize2, Pencil, Download, Images, UploadCloud, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useToast } from '@/hooks/use-toast';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export interface GalleryImage {
  id: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  createdAt: string; // ISO 8601 string
}

function PhotoGrid() {
  const firestore = useFirestore();
  const storage = useStorage();
  const { user } = useUser();
  const { toast } = useToast();
  
  const galleryImagesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'voxen_v2_gallery'), orderBy('createdAt', 'desc'));
  }, [firestore]);
  
  const { data: images, isLoading: imagesLoading } = useCollection<GalleryImage>(galleryImagesQuery);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedImageFile, setEditedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEditClick = (image: GalleryImage, index: number) => {
    setEditingIndex(index);
    setEditedDescription(image.description === 'Adicionar nova mídia' ? '' : image.description);
    setPreviewImageUrl(image.imageUrl || null);
    setEditedImageFile(null);
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
    if (!firestore || !storage || !user || isUploading) return;

    setIsUploading(true);
    
    try {
        const allItems = [...(images || []), ...createPlaceholders(images || [])];
        const currentItem = allItems[index];
        const isNewImage = currentItem.id.startsWith('placeholder-');

        if (isNewImage) {
            if (!editedImageFile) {
                throw new Error("Por favor, selecione uma imagem para adicionar.");
            }
            await createGalleryImage(firestore, storage, {
                description: editedDescription,
                imageFile: editedImageFile,
            });
            // Unlock gallery contributor achievement
            await unlockAchievement(firestore, user.uid, 'gallery-contributor').catch(console.warn);
        } else {
            const updatePayload: { description?: string, imageFile?: File } = {};
            if (editedImageFile) updatePayload.imageFile = editedImageFile;
            if (editedDescription !== currentItem.description) updatePayload.description = editedDescription;

            if (Object.keys(updatePayload).length > 0) {
                await updateGalleryImage(firestore, storage, currentItem.id, currentItem.imagePath, updatePayload);
            }
        }
        
        toast({ title: "Sucesso!", description: "Arquivo catalogado no sistema." });
        setEditingIndex(null);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro de Operação",
            description: error.message || "Falha ao processar arquivo de mídia.",
        });
    } finally {
        setIsUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!firestore || !storage || !image.id || image.id.startsWith('placeholder-')) {
      return;
    }
    
    try {
      await deleteGalleryImage(firestore, storage, image.id, image.imagePath);
      toast({ title: "Sucesso", description: "Mídia eliminada permanentemente." });
    } catch(error: any) {
       toast({
            variant: "destructive",
            title: "Erro Crítico",
            description: "Não foi possível remover o arquivo de mídia.",
        });
    }
    setEditingIndex(null);
  }

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedImageFile(null);
    setPreviewImageUrl(null);
  };

  const createPlaceholders = (existingImages: GalleryImage[]) => {
    const placeholderCount = Math.max(0, 1);
    return Array.from({ length: placeholderCount }, (_, i) => ({
        id: `placeholder-${existingImages.length + i}`,
        description: 'Catalogar nova evidência',
        imageUrl: '',
        imagePath: '',
        createdAt: ''
    }));
  };

  const displayImages = images || [];
  const allItems = [...displayImages, ...createPlaceholders(displayImages)];

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-primary/20 pb-12">
        <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-6 border border-primary/30 shadow-sm">
                <Images className="w-3.5 h-3.5" /> Repositório Visual
            </div>
            <h2 className="text-5xl md:text-7xl font-headline font-black text-foreground tracking-tighter leading-none uppercase drop-shadow-lg">
                Evidências Visuais
            </h2>
            <p className="text-primary mt-6 text-lg font-medium italic leading-relaxed max-w-xl">
                Dossiê central de ativos digitais, registros de eventos estratégicos e material institucional da unidade Voxen.
            </p>
        </div>
        {!editingIndex && (
            <Button 
                onClick={() => handleEditClick(allItems[allItems.length - 1], allItems.length - 1)}
                className="bg-primary hover:bg-foreground hover:text-background text-primary-foreground font-black uppercase tracking-widest h-14 px-10 rounded-none shadow-2xl transition-all"
            >
                <Plus className="w-5 h-5 mr-3" /> Catalogar Mídia
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-32">
        {imagesLoading && displayImages.length === 0 
          ? [...Array(8)].map((_, i) => (
               <div key={i} className="rounded-none overflow-hidden shadow-2xl border border-primary/10 bg-black/20 h-[400px] flex flex-col animate-pulse">
                  <div className="flex-grow bg-primary/5"></div>
                  <div className="h-20 bg-black/40 flex items-center px-8 border-t border-primary/10">
                      <div className="h-2 w-2/3 bg-primary/20 rounded-none"></div>
                  </div>
              </div>
            ))
          : allItems.map((image, idx) => {
          const isEditing = editingIndex === idx;
          const isPlaceholder = image.id.startsWith('placeholder-');
          
          if (isEditing) {
              return (
                  <div key={`edit-${idx}`} className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-card border border-primary/40 shadow-2xl p-10 animate-in fade-in slide-in-from-bottom-6 duration-700 z-30 rounded-none">
                      <div className="flex justify-between items-center mb-10 border-b border-primary/20 pb-8">
                            <h3 className="font-headline font-black text-2xl text-foreground uppercase tracking-widest">
                                {isPlaceholder ? 'Fazer Upload de Evidência' : 'Propriedades do Arquivo'}
                            </h3>
                            <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isUploading} className="h-10 w-10 text-primary hover:text-foreground rounded-none hover:bg-white/5">
                                <X className="h-7 w-7" />
                            </Button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                          <div className="lg:col-span-2 space-y-10">
                              <div className="space-y-4">
                                  <Label htmlFor={`image-upload-${idx}`} className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Fonte da Mídia</Label>
                                  <div className="relative group">
                                      <Input id={`image-upload-${idx}`} type="file" onChange={handleImageChange} accept="image/*" className="hidden" disabled={isUploading} />
                                      <div 
                                        className="w-full h-56 rounded-none border-2 border-dashed border-primary/20 bg-black/40 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group-hover:shadow-inner"
                                        onClick={() => document.getElementById(`image-upload-${idx}`)?.click()}
                                      >
                                          <UploadCloud className="w-12 h-12 text-primary/20 mb-4 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                                          <span className="text-[11px] font-black text-primary uppercase tracking-widest group-hover:text-foreground">Capturar Arquivo</span>
                                          <span className="text-[8px] text-primary/40 mt-2 uppercase tracking-[0.3em] font-bold italic">PNG, JPG ou WEBP (Max 5MB)</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <Label htmlFor={`description-${idx}`} className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Título / Descrição Forense</Label>
                                  <Input
                                      id={`description-${idx}`}
                                      value={editedDescription}
                                      onChange={(e) => setEditedDescription(e.target.value)}
                                      placeholder="Ex: Workshop de Liderança - Operação SP"
                                      disabled={isUploading}
                                      className="bg-background border-primary/30 text-foreground focus-visible:ring-primary h-14 rounded-none font-medium italic shadow-lg"
                                  />
                              </div>
                               <div className="pt-8 flex gap-6">
                                  <Button onClick={() => handleSaveChanges(idx)} disabled={isUploading} className="bg-primary hover:bg-foreground hover:text-background flex-1 h-14 font-black uppercase tracking-widest rounded-none shadow-xl">
                                    {isUploading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <Save className="mr-3 h-6 w-6" />} {isPlaceholder ? 'Sincronizar Agora' : 'Atualizar Dossiê'}
                                  </Button>
                                  {!isPlaceholder && (
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                           <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 h-14 w-14 rounded-none" disabled={isUploading}>
                                              <Trash2 className="h-6 w-6" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-background border-primary/40 rounded-none p-10">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle className="text-3xl font-headline font-black text-foreground uppercase tracking-widest">Remover Evidência?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-primary text-lg py-4 leading-relaxed italic">Essa ação é definitiva e removerá o arquivo permanentemente do nosso acervo institucional criptografado.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter className="mt-10 gap-6">
                                            <AlertDialogCancel className="h-14 px-8 rounded-none font-black text-[10px] uppercase tracking-widest bg-transparent border-primary/30 text-foreground">Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(image)} className="bg-destructive text-white h-14 px-10 rounded-none font-black text-[10px] uppercase tracking-widest shadow-xl">Confirmar Eliminação</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                  )}
                              </div>
                          </div>
                          <div className="lg:col-span-3 bg-black/40 rounded-none border border-primary/10 flex items-center justify-center min-h-[400px] relative overflow-hidden shadow-inner">
                               {previewImageUrl ? (
                                    <Image src={previewImageUrl} alt="Preview" fill className="object-contain p-10" unoptimized />
                               ) : (
                                   <div className="text-center text-primary/20">
                                       <ImageIcon className="w-24 h-24 mx-auto mb-6 opacity-10" />
                                       <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Aguardando Transmissão</p>
                                   </div>
                               )}
                          </div>
                      </div>
                  </div>
              );
          }

          if (isPlaceholder) {
              return (
                  <div key={image.id} className="h-[400px] rounded-none border border-primary/20 bg-black/10 hover:border-primary hover:bg-black/30 transition-all duration-700 flex flex-col items-center justify-center cursor-pointer group shadow-2xl relative" onClick={() => handleEditClick(image, idx)}>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="bg-primary/5 p-8 rounded-none mb-8 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-700 border border-transparent group-hover:border-primary/40">
                         <Plus className="w-12 h-12 text-primary/40 group-hover:text-primary group-hover:rotate-180 transition-all duration-1000" />
                      </div>
                      <span className="font-black text-primary/40 group-hover:text-foreground text-xl tracking-[0.3em] uppercase transition-all">Nova Evidência</span>
                      <span className="text-[8px] text-primary/20 mt-4 uppercase tracking-[0.6em] font-black group-hover:text-primary transition-all">Institutional Asset</span>
                  </div>
              );
          }

          return (
            <div key={image.id} className="group relative rounded-none overflow-hidden bg-black border border-primary/10 h-[400px] shadow-2xl transition-all duration-1000 hover:-translate-y-3">
                <Image
                    src={image.imageUrl}
                    alt={image.description || 'Voxen Dossiê'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-60 transition-all duration-[3s] group-hover:scale-110 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-all duration-700"></div>

                <div className="absolute inset-0 flex flex-col justify-between p-8">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform -translate-y-6 group-hover:translate-y-0">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="secondary" className="h-11 w-11 bg-black/40 hover:bg-primary backdrop-blur-xl text-foreground hover:text-background border border-primary/30 rounded-none shadow-2xl transition-all hover:scale-110">
                                    <Maximize2 className="h-6 w-6" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[100vw] h-[100vh] p-0 bg-background/98 border-none shadow-none flex items-center justify-center z-[110]" aria-describedby={undefined}>
                                <VisuallyHidden><DialogTitle>Evidência Visual Expandida</DialogTitle></VisuallyHidden>
                                <div className="relative w-full h-full p-10">
                                    <Image src={image.imageUrl} alt={image.description || ''} fill className="object-contain" quality={100} />
                                    <div className="absolute top-10 right-10 flex gap-6 z-[120]">
                                        <a href={image.imageUrl} download target="_blank" rel="noopener noreferrer">
                                            <Button size="icon" variant="secondary" className="bg-primary text-background hover:bg-foreground h-14 w-14 rounded-none border-none shadow-2xl transition-all"><Download className="h-7 w-7" /></Button>
                                        </a>
                                        <DialogClose asChild>
                                            <Button size="icon" variant="secondary" className="bg-white/10 hover:bg-white/20 text-foreground h-14 w-14 rounded-none border-none backdrop-blur-md transition-all"><X className="h-7 w-7" /></Button>
                                        </DialogClose>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-11 w-11 bg-black/40 hover:bg-primary backdrop-blur-xl text-foreground hover:text-background border border-primary/30 rounded-none shadow-2xl transition-all hover:scale-110"
                            onClick={() => handleEditClick(image, idx)}
                        >
                            <Pencil className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="mt-auto transform translate-y-12 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                        <div className="h-[2px] w-12 bg-primary mb-5 rounded-none"></div>
                        <p className="text-white font-black text-xl line-clamp-2 tracking-tight leading-tight uppercase italic drop-shadow-2xl">
                            "{image.description || 'Sem descrição forense'}"
                        </p>
                        <p className="text-primary text-[9px] uppercase tracking-[0.4em] font-black mt-3">
                             Voxen Intelligence Asset
                        </p>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-background font-body selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className={cn("flex-grow container mx-auto pt-16 animate-fade-in transition-opacity duration-1000", loading ? "opacity-0" : "opacity-100")}>
        <PhotoGrid />
      </main>
      <footer className="py-12 border-t border-primary/10 text-center bg-black/20 mt-24">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 italic">
              Voxen Intelligence Systems &bull; Proteger e Analisar
          </p>
      </footer>
    </div>
  );
}
