import * as firestore from 'firebase/firestore'

export type WithId<T> = T & { id: string }

export type Timestamp = firestore.Timestamp
export type FieldValue = firestore.FieldValue

export type TimestampToFieldValue<T> = {
  [key in keyof T]: T[key] extends Timestamp
    ? FieldValue
    : T[key] extends Timestamp | null
    ? FieldValue | null
    : T[key]
}

export const serverTimestamp = firestore.serverTimestamp
export const fromDate = firestore.Timestamp.fromDate
