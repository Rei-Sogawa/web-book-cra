import { orderBy, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { BookData, ChapterData } from '@/domain'
import {
  BookService,
  ChapterService,
  useSubscribeCollection,
  useSubscribeDoc,
} from '@/service/firestore'

export const useAdminBookViewerQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const book = useSubscribeDoc<BookData>(BookService.getDocRef(bookId))
  const chapters = useSubscribeCollection<ChapterData>(
    query(ChapterService.getCollectionRef({ bookId }), orderBy('number'))
  )

  return { book, chapters }
}
