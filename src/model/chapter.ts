import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  WithFieldValue,
} from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { WithId } from '@/lib/firestore'
import { convertor } from '@/lib/firestore'
import { StorageService } from '@/service/storage'

import { Book } from './book'

// schema
export type ChapterData = {
  number: number
  title: string
  content: string
  images: { path: string; url: string }[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Chapter = WithId<ChapterData>

export const getDefaultChapterData = (): WithFieldValue<ChapterData> => ({
  number: 0,
  title: '',
  content: '',
  images: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})

// ref
const chapterConvertor = convertor<ChapterData>()

export const chaptersRef = ({ bookId }: { bookId: string }) => {
  return collection(db, `books/${bookId}/chapters`).withConverter(chapterConvertor)
}
export const chapterRef = ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
  return doc(db, chaptersRef({ bookId }).path, chapterId).withConverter(chapterConvertor)
}

// mutation
const addChapter = async (book: Book, newChapterData: Pick<ChapterData, 'number'>) => {
  await addDoc(chaptersRef({ bookId: book.id }), {
    ...getDefaultChapterData(),
    ...newChapterData,
  })
}

const saveChapter = async (
  book: Book,
  chapter: Chapter,
  editedChapterData: Pick<ChapterData, 'title' | 'content'>
) => {
  const deletedImages: ChapterData['images'] = chapter.images.filter(
    (image) => !editedChapterData.content.includes(image.url)
  )

  await updateDoc(chapterRef({ bookId: book.id, chapterId: chapter.id }), {
    ...editedChapterData,
    images: arrayRemove(...deletedImages),
  })

  await Promise.all(deletedImages.map((image) => StorageService.deleteObject(image.path)))
}

const uploadImage = async (book: Book, chapter: Chapter, file: File) => {
  const path = `books-${book.id}-chapters-${chapter.id}-images-${new Date().getTime()}`
  await StorageService.uploadImage(path, file)
  const url = await StorageService.getDownloadURL(path)

  const addedImage: ChapterData['images'][number] = { path, url }

  await updateDoc(chapterRef({ bookId: book.id, chapterId: chapter.id }), {
    images: arrayUnion(addedImage),
  })

  return url
}

export const ChapterModel = {
  // mutation
  addChapter,
  saveChapter,
  uploadImage,
}
