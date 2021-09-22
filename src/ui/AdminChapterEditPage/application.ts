import { useParams } from 'react-router-dom'

import { BookData, Chapter, ChapterData } from '@/domain'
import { BookService, ChapterService, useSubscribeDoc } from '@/service/firestore'
import { StorageService } from '@/service/storage'

export const useAdminChapterEditPageQuery = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>()

  const book = useSubscribeDoc<BookData>(BookService.getDocRef(bookId))
  const chapter = useSubscribeDoc<ChapterData>(ChapterService.getDocRef(chapterId, { bookId }))

  return { book, chapter }
}

export const useAdminChapterEditPageMutation = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>()

  const saveChapter = async (
    editedChapterData: Pick<ChapterData, 'title' | 'content'>,
    chapter: Pick<Chapter, 'images'>
  ) => {
    const deletedFiles = chapter.images.filter((image) =>
      editedChapterData.content.includes(image.url)
    )

    await ChapterService.updateDoc(
      {
        ...editedChapterData,
        images: chapter.images.filter(
          (image) => !deletedFiles.find((deletedImage) => deletedImage.path === image.path)
        ),
      },
      chapterId,
      { bookId }
    )
    await Promise.all(deletedFiles.map((image) => StorageService.deleteImage(image.path)))
  }

  const uploadImage = async (file: File, chapter: Pick<Chapter, 'images'>) => {
    const path = `books-${bookId}-chapters-${chapterId}-${new Date().getTime()}`
    await StorageService.uploadImage(path, file)

    const url = await StorageService.getImageUrl(path)
    await ChapterService.updateDoc({ images: [...chapter.images, { path, url }] }, chapterId, {
      bookId,
    })

    return url
  }

  return { saveChapter, uploadImage }
}
