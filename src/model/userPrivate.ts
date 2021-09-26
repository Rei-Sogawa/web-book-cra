import { collection, doc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { createConvertor, WithId } from '@/lib/firestore'

import { Book } from './book'

// schema
export type UserPrivateData = {
  email: string
  cart: Book['id'][]
}
export type UserPrivate = WithId<UserPrivateData>

// ref
const userConvertor = createConvertor<UserPrivateData>()

export const userPrivatesRef = () => {
  return collection(db, 'userPrivates').withConverter(userConvertor)
}
export const userPrivateRef = ({ userId }: { userId: string }) => {
  return doc(db, userPrivatesRef().path, userId).withConverter(userConvertor)
}
