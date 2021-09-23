import { WithId } from '@/lib/firestore'
import { createFirestoreService } from '@/service/firestore'

export type AdminData = {
  email: string
}

export type Admin = WithId<AdminData>

export const AdminService = createFirestoreService<AdminData, void>(() => 'admins')
