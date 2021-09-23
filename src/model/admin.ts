import { serverTimestamp, Timestamp, TimestampToFieldValue, WithId } from '@/lib/firestore'
import { createFirestoreService } from '@/service/firestore'

export type AdminData = {
  email: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt: Timestamp | null
}

export type Admin = WithId<AdminData>

const getDefaultAdminData = (): TimestampToFieldValue<AdminData> => ({
  email: '',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  deletedAt: null,
})

export const AuthService = createFirestoreService(getDefaultAdminData, () => 'admins')
