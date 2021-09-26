import * as functions from 'firebase-functions'

import { adminRef } from './model/admin'
import { auth } from './firebaseApp'
import { userPrivateRef } from "./model/userPrivate"
import { onWrittenConvertor } from './lib/functions'
import { chapterSummaryRef } from './model/chapterSummary'
import { Chapter } from './model/chapter'

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
      await userPrivateRef({ userId: authUser.uid }).set({ email, cart: [] })
      return authUser.uid
    } catch {
      throw new functions.https.HttpsError('invalid-argument', '')
    }
  }
)

export const onWriteChapter = functionsWithRegion.firestore
  .document('books/{bookId}/chapters/{chapterId}')
  .onWrite(async (change, context) => {
    const { bookId, chapterId } = context.params as { bookId: string; chapterId: string }
    const { onCreate, onUpdate, onDelete, afterModel } = onWrittenConvertor<Chapter>(change)
    if (onCreate || onUpdate) {
      await chapterSummaryRef({ bookId, chapterId }).set({
        number: afterModel.number,
        title: afterModel.title,
        wardCount: afterModel.wardCount,
      })
    } else if (onDelete) {
      await chapterSummaryRef({ bookId, chapterId }).delete()
    }
  })
