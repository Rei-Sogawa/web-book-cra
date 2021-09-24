import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { serverTimestamp, Timestamp, TimestampOrFieldValue, WithId } from '@/lib/firestore'
import { convertor, useSubscribeCollection, useSubscribeDoc } from '@/service/firestore'
import { StorageService } from '@/service/storage'

import { chapterRef, chaptersRef } from './chapter'

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
export const bookRef = ({ bookId }: { bookId: string }) => {
  return doc(db, booksRef().path, bookId).withConverter(bookConvertor)
}

// query
export const useBooks = () => {
  const { values: books } = useSubscribeCollection<Book>(booksRef())
  return books || []
}

export const useBook = ({ bookId }: { bookId: string }) => {
  const { value: book } = useSubscribeDoc<Book>(bookRef({ bookId }))
  return book
}

// mutation
const addBook = async ({ newBookData }: { newBookData: Pick<BookData, 'title'> }) => {
  const docSnap = await addDoc(booksRef(), { ...getDefaultBookData(), ...newBookData })
  return docSnap.id
}

const saveBook = async ({
  book,
  editedBookData,
}: {
  book: Book
  editedBookData: Pick<BookData, 'title' | 'description'>
}) => {
  await updateDoc(bookRef({ bookId: book.id }), editedBookData)
}

const saveBookDetail = async ({
  book,
  editedBookData,
}: {
  book: Book
  editedBookData: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
}) => {
  await updateDoc(bookRef({ bookId: book.id }), editedBookData)
}

const deleteBook = async (book: Book) => {
  await deleteDoc(bookRef({ bookId: book.id }))
  if (book.image) await StorageService.deleteObject(book.image.path)

  const chapters = (await getDocs(chaptersRef({ bookId: book.id }))).docs.map((snap) => ({
    id: snap.id,
    ...snap.data(),
  }))

  await Promise.all(
    chapters.map((chapter) => deleteDoc(chapterRef({ bookId: book.id, chapterId: chapter.id })))
  )
  const chapterImagePaths = chapters
    .map((chapter) => chapter.images)
    .map((images) => images.map((image) => image.path))
    .flat()
  await Promise.all(chapterImagePaths.map((path) => StorageService.deleteObject(path)))
}

const uploadBookCover = async (book: Book, file: File) => {
  const path = `books-${book.id}-image`
  await StorageService.uploadImage(path, file)
  const url = await StorageService.getDownloadURL(path)
  await updateDoc(bookRef({ bookId: book.id }), { image: { path, url } })
}

const deleteBookCover = async (book: Book) => {
  if (!book.image) return
  await StorageService.deleteObject(book.image.path)
  await updateDoc(bookRef({ bookId: book.id }), { image: null })
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
