import { db } from "../firebaseApp";
import { convertor, WithId } from "../lib/firestore";

// schema
export type UserData = {
  email: string
}

export type User = WithId<UserData>

// ref
const userConvertor = convertor<UserData>()

export const usersRef = () => {
  return db.collection("users").withConverter(userConvertor)
}
export const userRef = ({userId}:{userId:string}) => {
  return usersRef().doc(userId)
}
