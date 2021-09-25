import { query, where } from 'firebase/firestore'

import { useDocs } from '@/lib/firestore'
import { booksRef } from '@/model/book'

export const useBooksPageQuery = () => {
  const [_books] = useDocs(query(booksRef(), where('published', '==', true)))
  const books = _books || []

  return { books }
}
