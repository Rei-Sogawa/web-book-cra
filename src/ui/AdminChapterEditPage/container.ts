import { curry } from 'lodash-es'
import { useParams } from 'react-router-dom'

import { Book, useBook } from '@/model/book'
import { Chapter, ChapterModel, useChapter } from '@/model/chapter'

export const useAdminChapterEditPageQuery = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>()

  const book = useBook({ bookId })
  const chapter = useChapter({ chapterId, bookId })

  return { book, chapter }
}

export const useAdminChapterEditPageMutation = (book: Book, chapter: Chapter) => {
  const saveChapter = curry(ChapterModel.saveChapter)(book, chapter)
  const uploadImage = curry(ChapterModel.uploadImage)(book, chapter)

  return { saveChapter, uploadImage }
}
