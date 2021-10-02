import { db } from '../firebaseApp'
import { createConvertor, WithId } from '../lib/firestore'
import { Book } from './book'

// schema
export type UserData = {
  email: string
  cart: Book["id"][]
}

export type User = WithId<UserData>

// ref
const userConvertor = createConvertor<UserData>()

export const usersRef = () => {
  return db.collection('users').withConverter(userConvertor)
}
export const userRef = ({ userId }: { userId: string }) => {
  return usersRef().doc(userId)
}
