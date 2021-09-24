import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { storage } from '@/firebaseApp'

const uploadImage = (path: string, blob: Blob) => {
  return uploadBytes(ref(storage, path), blob, { contentType: 'image/*' })
}

const _getDownloadURL = (path: string) => {
  return getDownloadURL(ref(storage, path))
}

const _deleteObject = (path: string) => {
  return deleteObject(ref(storage, path))
}

export const StorageService = {
  uploadImage,
  getDownloadURL: _getDownloadURL,
  deleteObject: _deleteObject,
}
