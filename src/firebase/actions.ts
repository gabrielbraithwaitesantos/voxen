'use client';

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  Firestore,
  serverTimestamp,
  collection,
  DocumentReference,
} from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { uploadImage, deleteImage as deleteStorageImage } from './storage';

const sanitizeFileName = (name: string) => encodeURIComponent(name.replace(/\s+/g, '_'));

// --- Message Actions ---
export const createMessage = async (
  firestore: Firestore,
  storage: FirebaseStorage,
  newDocRef: DocumentReference,
  currentUser: string,
  data: { text?: string; imageFile?: File; audioFile?: File }
) => {
  const { text, imageFile, audioFile } = data;
  const trimmedText = text?.trim();
  const fileToUpload = imageFile || audioFile;

  if (!trimmedText && !fileToUpload) {
    throw new Error("O conteúdo do relatório está vazio.");
  }
  
  const payload: {
      sender: string;
      timestamp: any;
      likes: string[];
      text?: string;
      imageUrl?: string;
      imagePath?: string;
      audioUrl?: string;
      audioPath?: string;
  } = {
      sender: currentUser,
      timestamp: serverTimestamp(),
      likes: [],
  };

  if (trimmedText) {
      payload.text = trimmedText;
  }
  
  if (fileToUpload) {
    // Using v2 path for clean state
    const path = `voxen_v2_messages/${newDocRef.id}/${sanitizeFileName(fileToUpload.name)}`;
    try {
        const url = await uploadImage(storage, fileToUpload, path);
        
        const isImage = fileToUpload.type.startsWith('image/');
        if (isImage) {
            payload.imageUrl = url;
            payload.imagePath = path;
        } else {
            payload.audioUrl = url;
            payload.audioPath = path;
        }
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
  }
  
  await setDoc(newDocRef, payload);
};


export const deleteMessage = async (firestore: Firestore, storage: FirebaseStorage, messageId: string, imagePath?: string, audioPath?: string) => {
    const docRef = doc(firestore, 'voxen_v2_messages', messageId);
    if (imagePath) await deleteStorageImage(storage, imagePath).catch(e => console.warn("Failed to delete storage object", e));
    if (audioPath) await deleteStorageImage(storage, audioPath).catch(e => console.warn("Failed to delete storage object", e));
    return deleteDoc(docRef);
}

// --- Gallery Actions ---
export const createGalleryImage = async (firestore: Firestore, storage: FirebaseStorage, data: { description: string, imageFile: File }) => {
    const { description, imageFile } = data;
    if (!imageFile) throw new Error("O arquivo de evidência visual é obrigatório.");
    
    const newDocRef = doc(collection(firestore, 'voxen_v2_gallery'));
    const imagePath = `voxen_v2_gallery/${newDocRef.id}/${sanitizeFileName(imageFile.name)}`;
    const imageUrl = await uploadImage(storage, imageFile, imagePath);

    const finalPayload = {
        description: description || 'Arquivo de Evidência',
        createdAt: new Date().toISOString(),
        imageUrl: imageUrl,
        imagePath: imagePath,
    };
    await setDoc(newDocRef, finalPayload);
    return newDocRef;
}

export const updateGalleryImage = async (firestore: Firestore, storage: FirebaseStorage, imageId: string, oldImagePath: string | undefined, data: { description?: string, imageFile?: File }) => {
    const docRef = doc(firestore, 'voxen_v2_gallery', imageId);
    const updatePayload: { description?: string, imageUrl?: string, imagePath?: string } = {};

    if (data.imageFile) {
        const imagePath = `voxen_v2_gallery/${docRef.id}/${sanitizeFileName(data.imageFile.name)}`;
        const imageUrl = await uploadImage(storage, data.imageFile, imagePath);
        updatePayload.imageUrl = imageUrl;
        updatePayload.imagePath = imagePath;
        if(oldImagePath && oldImagePath !== imagePath) {
           await deleteStorageImage(storage, oldImagePath).catch(e => console.warn("Could not delete old evidence", e));
        }
    }

    if (data.description !== undefined) {
        updatePayload.description = data.description;
    }

    if (Object.keys(updatePayload).length > 0) {
        return updateDoc(docRef, updatePayload);
    }
}

export const deleteGalleryImage = async (firestore: Firestore, storage: FirebaseStorage, imageId: string, imagePath: string) => {
    const docRef = doc(firestore, 'voxen_v2_gallery', imageId);
    if (imagePath) await deleteStorageImage(storage, imagePath).catch(e => console.warn("Failed to delete storage object", e));
    return deleteDoc(docRef);
}

// --- Timeline Actions ---
export const createTimelineEvent = async (firestore: Firestore, storage: FirebaseStorage, data: { title: string, date: string, imageFile?: File }) => {
    const { title, date, imageFile } = data;
    if (!title || !date) throw new Error("Título e data são obrigatórios para o marco.");

    const newDocRef = doc(collection(firestore, 'voxen_v2_timeline'));
    
    const payload: {
        title: string;
        date: string;
        createdAt: string;
        imageUrl?: string;
        imagePath?: string;
    } = {
        title,
        date,
        createdAt: new Date().toISOString(),
    };

    if (imageFile) {
        const imagePath = `voxen_v2_timeline/${newDocRef.id}/${sanitizeFileName(imageFile.name)}`;
        const imageUrl = await uploadImage(storage, imageFile, imagePath);
        payload.imageUrl = imageUrl;
        payload.imagePath = imagePath;
    }
    
    await setDoc(newDocRef, payload);
    return newDocRef;
}

export const updateTimelineEvent = async (firestore: Firestore, storage: FirebaseStorage, eventId: string, oldImagePath: string | undefined, data: { title?: string, date?: string, imageFile?: File }) => {
    const docRef = doc(firestore, 'voxen_v2_timeline', eventId);
    const updatePayload: { title?: string, date?: string, imageUrl?: string, imagePath?: string } = {};
    
    if(data.title !== undefined) updatePayload.title = data.title;
    
    if (data.date !== undefined) {
        updatePayload.date = data.date;
    }

    if (data.imageFile) {
        const imagePath = `voxen_v2_timeline/${docRef.id}/${sanitizeFileName(data.imageFile.name)}`;
        const imageUrl = await uploadImage(storage, data.imageFile, imagePath);
        updatePayload.imageUrl = imageUrl;
        updatePayload.imagePath = imagePath;
        if(oldImagePath && oldImagePath !== imagePath) {
            await deleteStorageImage(storage, oldImagePath).catch(e => console.warn("Failed to delete old image", e));
        }
    }

    if(Object.keys(updatePayload).length > 0) {
        return updateDoc(docRef, updatePayload);
    }
}

export const deleteTimelineEvent = async (firestore: Firestore, storage: FirebaseStorage, eventId: string, imagePath?: string) => {
    const docRef = doc(firestore, 'voxen_v2_timeline', eventId);
    if(imagePath) await deleteStorageImage(storage, imagePath).catch(e => console.warn("Failed to delete storage object", e));
    return deleteDoc(docRef);
}

// --- Music Actions ---
export const updateBackgroundMusic = async (firestore: Firestore, storage: FirebaseStorage, file: File) => {
    const docRef = doc(firestore, 'config', 'backgroundMusic');
    const path = `voxen_v2_music/operational_bg.mp3`; 
    const url = await uploadImage(storage, file, path);
    
    await setDoc(docRef, { url }, { merge: true });
    return url;
};

// --- User Actions ---
export const createUserProfile = async (
  firestore: Firestore,
  uid: string,
  data: { displayName?: string; avatarFile?: File },
  storage?: FirebaseStorage
) => {
  const docRef = doc(firestore, 'voxen_v2_users', uid);
  const payload: any = {
    uid,
    voxenId: `VXN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    joinDate: new Date().toISOString(),
    level: 'Nível 1: Discípulo',
  };

  if (data.displayName) payload.displayName = data.displayName;

  if (data.avatarFile) {
    if (!storage) {
      throw new Error("Storage não inicializado para upload de avatar.");
    }
    const avatarPath = `voxen_v2_users/${uid}/avatar/${sanitizeFileName(data.avatarFile.name)}`;
    const avatarUrl = await uploadImage(storage, data.avatarFile, avatarPath);
    payload.avatarUrl = avatarUrl;
    payload.avatarPath = avatarPath;
  }

  await setDoc(docRef, payload);
  return docRef;
};

export const updateUserProfile = async (
  firestore: Firestore,
  storage: FirebaseStorage,
  uid: string,
  oldAvatarPath: string | undefined,
  data: { displayName?: string; avatarFile?: File }
) => {
  const docRef = doc(firestore, 'voxen_v2_users', uid);
  const updatePayload: any = {};

  if (data.displayName !== undefined) updatePayload.displayName = data.displayName;

  if (data.avatarFile) {
    const avatarPath = `voxen_v2_users/${uid}/avatar/${sanitizeFileName(data.avatarFile.name)}`;
    const avatarUrl = await uploadImage(storage, data.avatarFile, avatarPath);
    updatePayload.avatarUrl = avatarUrl;
    updatePayload.avatarPath = avatarPath;
    if (oldAvatarPath) await deleteStorageImage(storage, oldAvatarPath).catch(e => console.warn("Failed to delete old avatar", e));
  }

  if (Object.keys(updatePayload).length > 0) {
    return updateDoc(docRef, updatePayload);
  }
};

// --- Achievement Actions ---
export const unlockAchievement = async (firestore: Firestore, userId: string, achievementId: string) => {
  const docRef = doc(firestore, 'voxen_v2_user_achievements', `${userId}_${achievementId}`);
  await setDoc(docRef, {
    userId,
    achievementId,
    unlockedAt: new Date().toISOString(),
  });
};
