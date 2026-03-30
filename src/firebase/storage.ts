
'use client';

import { FirebaseStorage, ref, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';

export const uploadImage = (storage: FirebaseStorage, file: File, path: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Optional: Observe state change events like progress, pause, and resume
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle unsuccessful uploads by rejecting the promise with the original error
        // This is where Firebase SDK reports errors (e.g. permissions, network issues)
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            // This could happen if getting the URL fails after upload
            reject(error);
          });
      }
    );
  });
};

export const deleteImage = async (storage: FirebaseStorage, path: string): Promise<void> => {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
};
