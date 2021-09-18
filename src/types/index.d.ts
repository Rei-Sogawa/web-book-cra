import * as firestore from 'firebase/firestore'

type WithId<T> = T & { id: string }

type Timestamp = firestore.Timestamp

type FieldValue = firestore.FieldValue

type TimestampToFieldValue<T> = {
  [key in keyof T]: T[key] extends Timestamp ? FieldValue : T[key]
}
