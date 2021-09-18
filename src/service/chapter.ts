import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'

import { Chapter, ChapterData, getDefaultData } from '@/domain/chapter'
import { db } from '@/firebaseApp'
import { serverTimestamp } from '@/lib/date'

// const chaptersPath = ({ bookId }: { bookId: string }) => `books/${bookId}/chapters`
const chaptersPath = ({ bookId }: { bookId: string }) => `books/bookId/chapters`

const chaptersCollectionRef = ({ bookId }: { bookId: string }) =>
  collection(db, chaptersPath({ bookId }))

const chapterDocRef = ({ bookId, chapterId }: { bookId: string; chapterId: string }) =>
  doc(db, chaptersPath({ bookId }), chapterId)

export const createChapter = ({
  bookId,
  newData,
}: {
  bookId: string
  newData: Partial<ChapterData>
}) => {
  return addDoc(chaptersCollectionRef({ bookId }), { ...getDefaultData(), ...newData })
}

export const updateChapter = ({
  bookId,
  chapterId,
  editedData,
}: {
  bookId: string
  chapterId: string
  editedData: Partial<ChapterData>
}) => {
  return updateDoc(chapterDocRef({ bookId, chapterId }), {
    updatedAt: serverTimestamp(),
    ...editedData,
  })
}

export const getChapter = async ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
  const docSnap = await getDoc(chapterDocRef({ bookId, chapterId }))
  return { id: docSnap.id, ...docSnap.data() } as Chapter
}
