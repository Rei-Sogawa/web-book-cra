import { BookModel } from '@/model/book'

export const useAdminBookNewPageMutation = () => {
  const addBook = BookModel.addBook

  return { addBook }
}
