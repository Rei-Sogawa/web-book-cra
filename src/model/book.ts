import { serverTimestamp, Timestamp, TimestampToFieldValue, WithId } from '@/lib/firestore'
import {
  createFirestoreService,
  useSubscribeCollection,
  useSubscribeDoc,
} from '@/service/firestore'
import { StorageService } from '@/service/storage'

import { ChapterService } from './chapter'

// schema
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

// service
export const BookService = createFirestoreService(getDefaultBookData, () => '/books')

// query
export const useBook = (bookId: string) => {
  const book = useSubscribeDoc<Book>(BookService.getDocRef(bookId))
  return book
}

export const useBooks = () => {
  const books = useSubscribeCollection<Book>(BookService.getCollectionRef())
  return books
}

// mutation
const addBook = async (newBookData: Pick<BookData, 'title'>) => {
  const docSnap = await BookService.createDoc(newBookData)
  return docSnap.id
}

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

  const chapters = await ChapterService.getDocs(book.id)
  await Promise.all(chapters.map((chapter) => ChapterService.deleteDoc(chapter.id, book.id)))
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

export const BookModel = {
  // mutation
  addBook,
  saveBook,
  saveBookDetail,
  deleteBook,
  uploadBookCover,
  deleteBookCover,
}
