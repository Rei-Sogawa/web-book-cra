import { collection, doc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { createConvertor, WithId } from '@/lib/firestore'

// schema
export type UserData = {
  email: string
}
export type User = WithId<UserData>

// ref
const userConvertor = createConvertor<UserData>()

export const usersRef = () => {
  return collection(db, 'users').withConverter(userConvertor)
}
export const userRef = ({ userId }: { userId: string }) => {
  return doc(db, usersRef().path, userId).withConverter(userConvertor)
}
