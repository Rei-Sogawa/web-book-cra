import { useParams } from 'react-router-dom'

import { useBook } from '@/model/book'
import { useChapters } from '@/model/chapter'

export const useAdminBookViewerQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const book = useBook({ bookId })
  const chapters = useChapters({ bookId })

  return { book, chapters }
}
