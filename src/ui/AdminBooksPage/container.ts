import { BookModel, useBooks } from '@/model/book'
import { AuthService } from '@/service/auth'

export const useAdminBooksPageQuery = () => {
  const books = useBooks()

  return { books }
}

export const useAdminBooksPageMutation = () => {
  const signOut = AuthService.signOut

  const deleteBook = async () => {
    if (!window.confirm('削除します。よろしいですか？')) return
    await BookModel.deleteBook
  }

  return { signOut, deleteBook }
}
