import { query, where } from 'firebase/firestore'

import { useDocs } from '@/lib/firestore'
import { booksRef } from '@/model/book'

export const useBooksPageQuery = () => {
  const [books] = useDocs(query(booksRef(), where('published', '==', true)))

  return { books }
}
