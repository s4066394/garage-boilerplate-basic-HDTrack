import type { Timestamp } from 'firebase/firestore'

/**
 * Firestore collection type definitions.
 *
 * Keep in sync with:
 *   - src/lib/firebase/firestore.ts  (typed collection exports)
 *   - firebase/firestore.rules       (security rules)
 *   - docs/FIRESTORE-SCHEMA.md       (schema documentation)
 *
 * When adding a new collection, use the /firebase-collection skill.
 */

export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: 'user' | 'admin'
  createdAt: Timestamp
  updatedAt: Timestamp
  _schemaVersion: 1
}

export interface EquipmentItem {
  name: string
  available: boolean
}

export interface EquipmentRequest {
  employeeUid: string
  employeeName: string
  equipmentId: string
  equipmentName: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
}

export type CreateUserProfileInput = Omit<UserProfile, 'createdAt' | 'updatedAt'>
