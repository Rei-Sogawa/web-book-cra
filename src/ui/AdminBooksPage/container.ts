import { BookModel, useBooks } from '@/model/book'

export const useAdminBooksPageQuery = () => {
  const books = useBooks()

  return { books }
}

export const useAdminBooksPageMutation = () => {
  const deleteBook = async () => {
    if (!window.confirm('削除します。よろしいですか？')) return
    await BookModel.deleteBook
  }

  return { deleteBook }
}
