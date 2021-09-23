import * as admin from "firebase-admin";

export type WithId<T> = T & { id: string }

export type Timestamp = admin.firestore.Timestamp
export type FieldValue = admin.firestore.FieldValue

export type TimestampOrFieldValue<T> = {
  [key in keyof T]: T[key] extends Timestamp
    ? Timestamp | FieldValue
    : T[key] extends Timestamp | null
    ? Timestamp | null | FieldValue
    : T[key]
}
