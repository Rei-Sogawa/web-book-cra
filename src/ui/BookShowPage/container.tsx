import { useParams } from 'react-router-dom'

import { useDoc } from '@/lib/firestore'
import { bookRef } from '@/model/book'

export const useBookShowPageQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const [book] = useDoc(bookRef({ bookId }))

  return { book }
}
