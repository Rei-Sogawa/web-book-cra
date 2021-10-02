import { orderBy, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { useDoc, useDocs } from '@/lib/firestore'
import { Book, bookRef } from '@/model/book'
import { chapterSummariesRef } from '@/model/chapterSummary'
import { UserModel } from '@/model/user'
import { useAuth } from '@/service/auth'

export const useBookShowPageQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const [book] = useDoc(bookRef({ bookId }))
  const [_chapterSummaries] = useDocs(query(chapterSummariesRef({ bookId }), orderBy('number')))
  const chapterSummaries = _chapterSummaries || []

  return { book, chapterSummaries }
}

export const useBookShowPageMutation = (book: Book) => {
  const { user } = useAuth()

  const addBookToCart = async () => {
    if (!user) return
    await UserModel.addBookToCart(user, book)
  }

  return {
    addBookToCart,
  }
}
