import { collection, doc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { createConvertor, WithId } from '@/lib/firestore'

// schema
export type CartData = {
  bookIds: string[]
}
export type Cart = WithId<CartData>

// ref
const cartConvertor = createConvertor<CartData>()

export const cartsRef = () => {
  return collection(db, 'carts').withConverter(cartConvertor)
}
export const cartRef = ({ userId }: { userId: string }) => {
  return doc(db, cartsRef().path, userId).withConverter(cartConvertor)
}
