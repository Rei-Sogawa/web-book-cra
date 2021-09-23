import { BookModel, useBooks } from '@/model/book'

export const useAdminBooksPageQuery = () => {
  const books = useBooks()

  return { books }
}

export const useAdminBooksPageMutation = () => {
  const deleteBook = BookModel.deleteBook

  return { deleteBook }
}
