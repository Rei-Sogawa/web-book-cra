import { orderBy, query } from 'firebase/firestore'

import { serverTimestamp } from '@/lib/date'
import {
  createFirestoreService,
  useSubscribeCollection,
  useSubscribeDoc,
} from '@/service/firestore'
import { StorageService } from '@/service/storage'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

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

export const getDefaultChapterData = (): TimestampToFieldValue<ChapterData> => ({
  number: 0,
  title: '',
  content: '',
  images: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})

// service
export const ChapterService = createFirestoreService(
  getDefaultChapterData,
  (bookId: string) => `books/${bookId}/chapters`
)

// query
export const useChapter = ({ chapterId, bookId }: { chapterId: string; bookId: string }) => {
  const chapter = useSubscribeDoc<Chapter>(ChapterService.getDocRef(chapterId, bookId))
  return chapter
}

export const useChapters = (bookId: string) => {
  const chapters = useSubscribeCollection<Chapter>(
    query(ChapterService.getCollectionRef(bookId), orderBy('number'))
  )
  return chapters
}

// mutation
const addChapter = async (book: Book, chaptersLength: number) => {
  await ChapterService.createDoc({ number: chaptersLength + 1 }, book.id)
}

const saveChapter = async (
  {
    chapter,
    book,
  }: {
    chapter: Chapter
    book: Book
  },
  editedChapterData: Pick<ChapterData, 'title' | 'content'>
) => {
  const deletedFiles = chapter.images.filter((image) =>
    editedChapterData.content.includes(image.url)
  )

  await ChapterService.updateDoc(
    {
      ...editedChapterData,
      images: chapter.images.filter(
        (image) => !deletedFiles.find((deletedImage) => deletedImage.path === image.path)
      ),
    },
    chapter.id,
    book.id
  )

  await Promise.all(deletedFiles.map((image) => StorageService.deleteImage(image.path)))
}

const uploadImage = async (
  {
    chapter,
    book,
  }: {
    chapter: Chapter
    book: Book
  },
  file: File
) => {
  const path = `books-${book.id}-chapters-${chapter.id}-${new Date().getTime()}`
  await StorageService.uploadImage(path, file)

  const url = await StorageService.getImageUrl(path)
  await ChapterService.updateDoc(
    { images: [...chapter.images, { path, url }] },
    chapter.id,
    book.id
  )

  return url
}

export const ChapterModel = {
  // mutation
  addChapter,
  saveChapter,
  uploadImage,
}
