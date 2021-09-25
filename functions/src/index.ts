import * as functions from 'firebase-functions'

import { adminRef } from './model/admin'
import { auth } from './firebaseApp'
import { userRef } from './model/user'

const TOKYO = 'asia-northeast1'
const functionsWithRegion = functions.region(TOKYO)

export const signUpAdmin = functionsWithRegion.https.onCall(
  async (data: { email: string; password: string }) => {
    const { email, password } = data
    try {
      const authUser = await auth.createUser({ email, password })
      await adminRef({ adminId: authUser.uid }).set({ email })
      return authUser.uid
    } catch {
      throw new functions.https.HttpsError('invalid-argument', '')
    }
  }
)

export const signUpUser = functionsWithRegion.https.onCall(
  async (data: { email: string; password: string }) => {
    const { email, password } = data
    try {
      const authUser = await auth.createUser({ email, password })
      await userRef({ userId: authUser.uid }).set({ email })
      return authUser.uid
    } catch {
      throw new functions.https.HttpsError('invalid-argument', '')
    }
  }
)

// export const onCreateChapter = functionsWithRegion.firestore
//   .document(chapterPathTemplate)
//   .onCreate(async (snap, context) => {
//     const { bookId } = context.params as { bookId: string }

//     const addedChapter = docSnapToModel<ChapterData>(snap)

//     const editedBookDataChapter: BookData['chapters'][number] = {
//       id: addedChapter.id,
//       number: addedChapter.number,
//       title: addedChapter.title,
//     }

//     const editedBookData: WithFieldValue<Pick<BookData, 'chapters'>> = {
//       chapters: firestore.FieldValue.arrayUnion(editedBookDataChapter),
//     }
//     await bookRef({ bookId }).update(editedBookData)
//   })

// export const onDeleteChapter = functionsWithRegion.firestore
//   .document(chapterPathTemplate)
//   .onDelete(async (snap, context) => {
//     const { bookId } = context.params as { bookId: string }

//     const deletedChapter = docSnapToModel<ChapterData>(snap)

//     const book = await fetchDoc<BookData>(bookRef({ bookId }))

//     const editedBookData: Pick<BookData, 'chapters'> = {
//       chapters: book.chapters.filter(({ id }) => id !== deletedChapter.id),
//     }
//     await bookRef({ bookId }).update(editedBookData)
//   })
