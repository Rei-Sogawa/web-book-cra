import { useCallback } from 'react'

import { Book, BookData } from '@/domain'
import { deleteBook } from '@/model/book'
import { BookService, ChapterService, useSubscribeCollection } from '@/service/firestore'
import { StorageService } from '@/service/storage'

export const useAdminBooksPageQuery = () => {
  const books = useSubscribeCollection<BookData>(BookService.getCollectionRef())

  return { books }
}

export const useAdminBooksPageMutation = () => {
  const _deleteBook = useCallback(deleteBook, [])

  return { deleteBook: _deleteBook }
}
