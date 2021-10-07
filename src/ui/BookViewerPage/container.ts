import { orderBy, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { useDoc, useDocs } from '@/lib/firestore'
import { bookRef } from '@/model/book'
import { chaptersRef } from '@/model/chapter'

export const useBookViewerQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const [book] = useDoc(bookRef({ bookId }))
  const [_chapters] = useDocs(query(chaptersRef({ bookId }), orderBy('number')))
  const chapters = _chapters || []

  return { book, chapters }
}
