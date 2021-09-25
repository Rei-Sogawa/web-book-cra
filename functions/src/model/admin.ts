import { db } from "../firebaseApp";
import {convertor, WithId} from "../lib/firestore";

export type AdminData = {
  email: string
}

export type Admin = WithId<AdminData>

// ref
const adminConvertor = convertor<AdminData>()

export const adminsRef = () => {
  return db.collection("admins").withConverter(adminConvertor)
} 
export const adminRef = ({adminId}: {adminId: string}) => {
  return adminsRef().doc(adminId)
}
