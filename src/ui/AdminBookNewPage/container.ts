import { BookModel } from '@/model/book'

export const useAdminBookNewPageMutation = () => {
  const createBook = BookModel.createBook

  return { createBook }
}
