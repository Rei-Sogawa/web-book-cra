import { orderBy, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { Book, BookData, ChapterData } from '@/domain'
import { assertIsDefined } from '@/lib/assert'
import {
  BookService,
  ChapterService,
  useSubscribeCollection,
  useSubscribeDoc,
} from '@/service/firestore'
import { StorageService } from '@/service/storage'

export const useAdminBookEditPageQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const book = useSubscribeDoc<BookData>(BookService.getDocRef(bookId))
  const chapters = useSubscribeCollection<ChapterData>(
    query(ChapterService.getCollectionRef({ bookId }), orderBy('number'))
  )

  return {
    book,
    chapters,
  }
}

export const useAdminBookEditPageCommand = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const saveBook = async (editedBookData: Pick<BookData, 'title' | 'description'>) => {
    await BookService.updateDoc(editedBookData, bookId)
  }

  const saveBookDetail = async (
    editedBookData: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
  ) => {
    await BookService.updateDoc(editedBookData, bookId)
  }

  const uploadBookCover = async (file: File) => {
    const path = `books-${bookId}`
    await StorageService.uploadImage(path, file)
    const url = await StorageService.getImageUrl(path)
    await BookService.updateDoc({ image: { path, url } }, bookId)
  }

  const deleteBookCover = async (bookImage: Book['image']) => {
    if (!window.confirm('削除します。よろしいですか？')) return
    assertIsDefined(bookImage)
    await StorageService.deleteImage(bookImage.path)
    await BookService.updateDoc({ image: null }, bookId)
  }

  const addChapter = async (chaptersLength: number) => {
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
