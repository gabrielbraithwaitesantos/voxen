'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, doc } from '@/firebase';
import { createUserProfile, updateUserProfile } from '@/firebase/actions';
import { UserProfile } from '@/models/types';
import { UserCircle, Calendar, Zap, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const userProfileQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'voxen_v2_users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading } = useDoc<UserProfile>(userProfileQuery);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user && !profile && !isLoading) {
      // Create profile if it doesn't exist
      createUserProfile(firestore!, user.uid, {}).catch(console.error);
    }
  }, [user, profile, isLoading, firestore]);

  const handleSave = async () => {
    if (!firestore || !user) return;
    try {
      await updateUserProfile(firestore, undefined as any, user.uid, profile?.avatarPath, {
        displayName: displayName.trim() || undefined,
        avatarFile: avatarFile || undefined,
      });
      setIsEditing(false);
      setAvatarFile(null);
      toast({ title: "Perfil atualizado", description: "Suas informações foram salvas." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar perfil." });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDisplayName(profile?.displayName || '');
    setAvatarFile(null);
  };

  if (isLoading) {
    return <div className="p-8 text-white">Carregando perfil...</div>;
  }

  const userProfile = profile || {
    voxenId: 'VXN-2024-007',
    joinDate: new Date().toISOString(),
    level: 'Nível 1: Discípulo',
    avatarUrl: undefined,
    displayName: '',
  };

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-300">🆔 Meu Voxen ID</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
      </div>
      
      <div className="mt-8 max-w-md bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-16 h-16 text-gray-500" />
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Nome de Exibição</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">
                  {userProfile.voxenId}
                </h2>
                {userProfile.displayName && (
                  <p className="text-lg text-gray-300">{userProfile.displayName}</p>
                )}
                <div className="mt-4 space-y-2 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Membro desde: {new Date(userProfile.joinDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Nível Atual: {userProfile.level}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
