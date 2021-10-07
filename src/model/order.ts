import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  WithFieldValue,
} from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { createConvertor, WithId } from '@/lib/firestore'

import { Book, bookRef } from './book'

// schema
export type OrderData = {
  userId: string
  books: Pick<Book, 'id' | 'price'>[]
  status: 'pending' | 'fulfilled'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Order = WithId<OrderData>

export const getDefaultOrderData = (): WithFieldValue<OrderData> => ({
  userId: '',
  books: [],
  status: 'pending',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})

// ref
const orderConvertor = createConvertor<OrderData>()

export const ordersRef = () => {
  return collection(db, 'orders').withConverter(orderConvertor)
}
export const orderRef = ({ orderId }: { orderId: string }) => {
  return doc(db, ordersRef().path, orderId).withConverter(orderConvertor)
}

// mutation
const createOrder = async (newOrderData: Pick<OrderData, 'userId' | 'books'>) => {
  await addDoc(ordersRef(), { ...getDefaultOrderData(), ...newOrderData })
}

const acceptOrder = async (order: Order) => {
  for (const book of order.books) {
    await updateDoc(bookRef({ bookId: book.id }), { purchaserIds: arrayUnion(order.userId) })
    await updateDoc(orderRef({ orderId: order.id }), {
      status: 'fulfilled',
      updatedAt: serverTimestamp(),
    })
  }
}

const cancelOrder = async (order: Order) => {
  await deleteDoc(orderRef({ orderId: order.id }))
}

export const OrderModel = {
  createOrder,
  acceptOrder,
  cancelOrder,
}
