import { orderBy, query } from 'firebase/firestore'

import { Book, BookData } from '@/domain/book'
import { Chapter } from '@/domain/chapter'
import { assertIsDefined } from '@/lib/assert'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'
import { useSubscribeCollection, useSubscribeDoc } from '@/service/firestore'
import { StorageService } from '@/service/storage'

const useBookEditPageQuery = (bookId: string) => {
  const book = useSubscribeDoc(BookService.getDocRef(bookId))

  const chapters = useSubscribeCollection(
    query(ChapterService.getCollectionRef({ bookId }), orderBy('number'))
  )

  return {
    book,
    chapters,
  }
}

const useBookEditPageCommand = () => {
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
    await StorageService.uploadImage({ path, blob: file })
    const url = await StorageService.getImageUrl({ path })
    await BookService.updateDoc({ image: { path, url } }, bookId)
  }

  const deleteBookCover = async (book: Book) => {
    if (!window.confirm('削除します。よろしいですか？')) return
    assertIsDefined(book?.image)
    await StorageService.deleteImage({ path: book.image.path })
    await BookService.updateDoc({ image: null }, book.id)
  }

  const addChapter = async (chapters: Chapter[], bookId: string) => {
    await ChapterService.createDoc({ number: chapters.length + 1 }, { bookId })
  }

  return {
    saveBook,
    saveBookDetail,
    uploadBookCover,
    deleteBookCover,
    addChapter,
  }
}

export const useBookEditPageContainer = (bookId: string) => {
  const q = useBookEditPageQuery(bookId)
  const c = useBookEditPageCommand()

  return {
    ...q,
    ...c,
  }
}
