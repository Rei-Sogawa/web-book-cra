import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { serverTimestamp, Timestamp, TimestampOrFieldValue, WithId } from '@/lib/firestore'
import {
  convertor,
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

export const getDefaultBookData = (): TimestampOrFieldValue<BookData> => ({
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

// ref
const bookConvertor = convertor<BookData>()

export const booksRef = () => {
  return collection(db, 'books').withConverter(bookConvertor)
}
export const bookRef = (bookId: string) => {
  return doc(db, booksRef().path, bookId).withConverter(bookConvertor)
}

// service
export const BookService = createFirestoreService<BookData, void>(() => '/books')

// query
export const useBook = (bookId: string) => {
  const { value: book } = useSubscribeDoc<Book>(bookRef(bookId))
  return book
}

export const useBooks = () => {
  const { values: books } = useSubscribeCollection<Book>(booksRef())
  return books ?? []
}

// mutation
const addBook = async (newBookData: Pick<BookData, 'title'>) => {
  const docSnap = await addDoc(booksRef(), { ...getDefaultBookData(), ...newBookData })
  return docSnap.id
}

const saveBook = async (book: Book, editedBookData: Pick<BookData, 'title' | 'description'>) => {
  await updateDoc(bookRef(book.id), editedBookData)
}

const saveBookDetail = async (
  book: Book,
  editedBookData: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
) => {
  await updateDoc(bookRef(book.id), editedBookData)
}

const deleteBook = async (book: Book) => {
  await deleteDoc(bookRef(book.id))
  if (book.image) await StorageService.deleteImage(book.image.path)

  const chapters = await ChapterService.getDocs(book.id)
  if (!chapters) return

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
  await updateDoc(bookRef(book.id), { image: { path, url } })
}

const deleteBookCover = async (book: Book) => {
  if (!book.image) return
  await StorageService.deleteImage(book.image.path)
  await updateDoc(bookRef(book.id), { image: null })
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
