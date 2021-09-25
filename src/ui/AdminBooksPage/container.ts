import { useDocs } from '@/lib/firestore'
import { Book, BookModel, booksRef } from '@/model/book'
import { AuthService } from '@/service/auth'

export const useAdminBooksPageQuery = () => {
  const [_books] = useDocs(booksRef())
  const books = _books || []

  return { books }
}

export const useAdminBooksPageMutation = () => {
  const signOut = AuthService.signOut

  const deleteBook = async (book: Book) => {
    if (!window.confirm('削除します。よろしいですか？')) return
    await BookModel.deleteBook(book)
  }

  return { signOut, deleteBook }
}
