import { BookData } from '@/domain'
import { BookService } from '@/service/firestore'

export const useAdminBookNewPageCommands = () => {
  const createBook = async (newBookData: Pick<BookData, 'title'>) => {
    const docSnap = await BookService.createDoc(newBookData)
    return docSnap.id
  }

  return { createBook }
}
