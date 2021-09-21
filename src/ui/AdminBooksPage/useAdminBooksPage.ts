import { Book, BookData } from '@/domain'
import { BookService, ChapterService, useSubscribeCollection } from '@/service/firestore'
import { StorageService } from '@/service/storage'

export const useAdminBooksPageQuery = () => {
  const books = useSubscribeCollection<BookData>(BookService.getCollectionRef())

  return { books }
}

export const useAdminBooksPageCommand = () => {
  const deleteBook = async (book: Pick<Book, 'id' | 'image'>) => {
    if (!window.confirm('削除します。よろしいですか？')) return

    await BookService.deleteDoc(book.id)
    if (book.image) await StorageService.deleteImage(book.image.path)

    const chapters = await ChapterService.getDocs({ bookId: book.id })
    await Promise.all(
      chapters.map((chapter) => ChapterService.deleteDoc(chapter.id, { bookId: book.id }))
    )
    const chapterImagePaths = chapters
      .map((chapter) => chapter.images)
      .map((images) => images.map((image) => image.path))
      .flat()
    await Promise.all(
      chapterImagePaths.map((chapterImagePath) => StorageService.deleteImage(chapterImagePath))
    )
  }

  return { deleteBook }
}
