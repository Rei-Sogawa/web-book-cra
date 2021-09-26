import { db } from '../firebaseApp'
import { createConvertor, WithId } from '../lib/firestore'
import { Book } from './book'

// schema
export type UserPrivateData = {
  email: string
  cart: Book["id"][]
}

export type UserPrivate = WithId<UserPrivateData>

// ref
const userConvertor = createConvertor<UserPrivateData>()

export const userPrivatesRef = () => {
  return db.collection('userPrivates').withConverter(userConvertor)
}
export const userPrivateRef = ({ userId }: { userId: string }) => {
  return userPrivatesRef().doc(userId)
}
