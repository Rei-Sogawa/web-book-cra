import { serverTimestamp } from '@/lib/date'
import {
  createFirestoreService,
  useSubscribeCollection,
  useSubscribeDoc,
} from '@/service/firestore'
import { StorageService } from '@/service/storage'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

import { ChapterService } from './chapter'

// Schema
export type BookData = {
  title: string
  description: string
  authorNames: string[]
  image: { path: string; url: string } | null
  price: number
  published: boolean
  releasedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Book = WithId<BookData>

const getDefaultBookData = (): TimestampToFieldValue<BookData> => ({
  title: '',
  description: '',
  authorNames: [],
  image: null,
  price: 0,
  published: false,
  releasedAt: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})

// Service
export const BookService = createFirestoreService<BookData, void>(
  getDefaultBookData,
  () => '/books'
)

// Query
export const useBook = (bookId: string) => {
  const book = useSubscribeDoc<BookData>(BookService.getDocRef(bookId))
  return book
}

export const useBooks = () => {
  const books = useSubscribeCollection<BookData>(BookService.getCollectionRef())
  return books
}

// Mutation
const saveBook = async (book: Book, editedBookData: Pick<BookData, 'title' | 'description'>) => {
  await BookService.updateDoc(editedBookData, book.id)
}

const saveBookDetail = async (
  book: Book,
  editedBookData: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
) => {
  await BookService.updateDoc(editedBookData, book.id)
}

const deleteBook = async (book: Book) => {
  await BookService.deleteDoc(book.id)
  if (book.image) await StorageService.deleteImage(book.image.path)

  const chapters = await ChapterService.getDocs({ bookId: book.id })
  await Promise.all(
    chapters.map((chapter) => ChapterService.deleteDoc(chapter.id, { bookId: book.id }))
  )
  const chapterImagePaths = chapters
    .map((chapter) => chapter.images)
    .map((images) => images.map((image) => image.path))
    .flat()
  await Promise.all(chapterImagePaths.map((path) => StorageService.deleteImage(path)))
}

const uploadBookCover = async (book: Book, file: File) => {
  const path = `books-${book.id}`
  await StorageService.uploadImage(path, file)
  const url = await StorageService.getImageUrl(path)
  await BookService.updateDoc({ image: { path, url } }, book.id)
}

const deleteBookCover = async (book: Book) => {
  if (!book.image) return
  await StorageService.deleteImage(book.image.path)
  await BookService.updateDoc({ image: null }, book.id)
}

const addChapter = async (book: Book, chaptersLength: number) => {
  await ChapterService.createDoc({ number: chaptersLength + 1 }, { bookId: book.id })
}

export const BookModel = {
  saveBook,
  saveBookDetail,
  deleteBook,
  uploadBookCover,
  deleteBookCover,
  addChapter,
}
