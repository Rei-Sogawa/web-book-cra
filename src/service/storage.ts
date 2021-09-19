import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { storage } from '@/firebaseApp'

const uploadImage = ({ path, blob }: { path: string; blob: Blob }) => {
  return uploadBytes(ref(storage, `images/${path}`), blob, { contentType: 'image/*' })
}

const getImageUrl = ({ path }: { path: string }) => {
  return getDownloadURL(ref(storage, `images/${path}`))
}

const deleteImage = ({ path }: { path: string }) => {
  return deleteObject(ref(storage, `images/${path}`))
}

export const StorageService = {
  uploadImage,
  getImageUrl,
  deleteImage,
}
