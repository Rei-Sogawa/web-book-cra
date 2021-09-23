import * as admin from "firebase-admin";

export type WithId<T> = T & { id: string }

export type Timestamp = admin.firestore.Timestamp
export type FieldValue = admin.firestore.FieldValue

export type TimestampToFieldValue<T> = {
  [key in keyof T]: T[key] extends Timestamp
    ? FieldValue
    : T[key] extends Timestamp | null
    ? FieldValue | null
    : T[key]
}
