import { arrayRemove, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { createConvertor, WithId } from '@/lib/firestore'

import { Book } from './book'

// schema
export type UserData = {
  email: string
  cart: Book['id'][]
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

// mutation
const addBookToCart = async (user: User, book: Book) => {
  await updateDoc(userRef({ userId: user.id }), { cart: arrayUnion(book.id) })
}

const deleteBookFromCart = async (user: User, book: Book) => {
  await updateDoc(userRef({ userId: user.id }), { cart: arrayRemove(book.id) })
}

export const UserModel = {
  addBookToCart,
  deleteBookFromCart,
}
