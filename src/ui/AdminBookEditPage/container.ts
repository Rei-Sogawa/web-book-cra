import { orderBy, query } from 'firebase/firestore'
import { curry } from 'lodash-es'
import { useParams } from 'react-router-dom'

import { useDoc, useDocs } from '@/lib/firestore'
import { Book, BookModel, bookRef } from '@/model/book'
import { Chapter, ChapterModel, chaptersRef } from '@/model/chapter'

export const useAdminBookEditPageQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const [book] = useDoc(bookRef({ bookId }))
  const [chapters] = useDocs(query(chaptersRef({ bookId }), orderBy('number')))

  return {
    book,
    chapters,
  }
}

export const useAdminBookEditPageMutation = ({
  book,
  chapters,
}: {
  book: Book
  chapters: Chapter[]
}) => {
  const saveBook = curry(BookModel.saveBook)(book)
  const saveBookDetail = curry(BookModel.saveBookDetail)(book)
  const uploadBookCover = curry(BookModel.uploadBookCover)(book)
  const deleteBookCover = () => BookModel.deleteBookCover(book)

  const addChapter = () => ChapterModel.addChapter(book, { number: chapters.length + 1 })

  return {
    saveBook,
    saveBookDetail,
    uploadBookCover,
    deleteBookCover,
    addChapter,
  }
}
