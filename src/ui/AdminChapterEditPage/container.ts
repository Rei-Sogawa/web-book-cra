import { curry } from 'lodash-es'
import { useParams } from 'react-router-dom'

import { useDoc } from '@/lib/firestore'
import { Book, bookRef } from '@/model/book'
import { Chapter, ChapterModel, chapterRef } from '@/model/chapter'

export const useAdminChapterEditPageQuery = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>()

  const [book] = useDoc(bookRef({ bookId }))
  const [chapter] = useDoc(chapterRef({ bookId, chapterId }))

  return { book, chapter }
}

export const useAdminChapterEditPageMutation = (book: Book, chapter: Chapter) => {
  const saveChapter = curry(ChapterModel.saveChapter)(book, chapter)
  const uploadImage = curry(ChapterModel.uploadImage)(book, chapter)

  return { saveChapter, uploadImage }
}
