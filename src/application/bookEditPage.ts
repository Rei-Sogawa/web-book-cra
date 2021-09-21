import { orderBy, query } from 'firebase/firestore'

import { Book, BookData } from '@/domain/book'
import { assertIsDefined } from '@/lib/assert'
import {
  BookService,
  ChapterService,
  useSubscribeCollection,
  useSubscribeDoc,
} from '@/service/firestore'
import { StorageService } from '@/service/storage'

import { ChapterData } from './../domain/chapter'

export const useBookEditPageQuery = (bookId: string) => {
  const book = useSubscribeDoc<BookData>(BookService.getDocRef(bookId))

  const chapters = useSubscribeCollection<ChapterData>(
    query(ChapterService.getCollectionRef({ bookId }), orderBy('number'))
  )

  return {
    book,
    chapters,
  }
}

export const useBookEditPageCommand = () => {
  const saveBook = async (
    editedBookData: Pick<BookData, 'title' | 'description'>,
    bookId: string
  ) => {
    await BookService.updateDoc(editedBookData, bookId)
  }

  const saveBookDetail = async (
    editedBookData: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>,
    bookId: string
  ) => {
    await BookService.updateDoc(editedBookData, bookId)
  }

  const uploadBookCover = async (file: File, bookId: string) => {
    const path = `books-${bookId}`
    await StorageService.uploadImage(path, file)
    const url = await StorageService.getImageUrl(path)
    await BookService.updateDoc({ image: { path, url } }, bookId)
  }

  const deleteBookCover = async (book: Book) => {
    if (!window.confirm('削除します。よろしいですか？')) return
    assertIsDefined(book?.image)
    await StorageService.deleteImage(book.image.path)
    await BookService.updateDoc({ image: null }, book.id)
  }

  const addChapter = async (chaptersLength: number, bookId: string) => {
    await ChapterService.createDoc({ number: chaptersLength + 1 }, { bookId })
  }

  return {
    saveBook,
    saveBookDetail,
    uploadBookCover,
    deleteBookCover,
    addChapter,
  }
}
