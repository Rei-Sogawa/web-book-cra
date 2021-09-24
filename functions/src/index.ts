import * as functions from 'firebase-functions'

import { adminRef } from './model/admin'
import {  auth } from './firebaseApp'
import { userRef } from './model/user'

const TOKYO = 'asia-northeast1'
const functionsWithRegion = functions.region(TOKYO)

export const signUpAdmin = functionsWithRegion
  .https.onCall(async (data: { email: string; password: string }) => {
    const { email, password } = data

    // const isSGDomain = last(email.split('@')) === 'sonicgarden.jp'
    // if (!isSGDomain) {
    //   throw new functions.https.HttpsError("invalid-argument", "")
    // }

    try {
      const authUser = await auth.createUser({ email, password })
      await adminRef({adminId:authUser.uid}).set({email})
      return authUser.uid
    } catch {
      throw new functions.https.HttpsError("invalid-argument", "")
    }
  })

  export const signUpUser = functionsWithRegion
  .https.onCall(async (data: { email: string; password: string }) => {
    const { email, password } = data

    // const isSGDomain = last(email.split('@')) === 'sonicgarden.jp'
    // if (!isSGDomain) {
    //   throw new functions.https.HttpsError("invalid-argument", "")
    // }

    try {
      const authUser = await auth.createUser({ email, password })
      await userRef({userId: authUser.uid}).set({email})
      return authUser.uid
    } catch {
      throw new functions.https.HttpsError("invalid-argument", "")
    }
  })
