'use client'

import { useEffect, useState } from 'react'
import { addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { getEquipmentCollection, getEquipmentRequestCollection } from '@/lib/firebase/firestore'
import type { EquipmentItem } from '@/types/firestore'

export default function EquipmentPage() {
  const { user, profile } = useAuth()
  const [equipment, setEquipment] = useState<{ id: string; data: EquipmentItem }[]>([])

  useEffect(() => {
    async function loadEquipment() {
      const snapshot = await getDocs(getEquipmentCollection())
      setEquipment(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
    }

    loadEquipment()
  }, [])

  async function requestEquipment(item: EquipmentItem, equipmentId: string) {
    if (!user) return

    await addDoc(getEquipmentRequestCollection(), {
      employeeUid: user.uid,
      employeeName: profile?.displayName ?? user.email ?? 'Employee',
      equipmentId,
      equipmentName: item.name,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Equipment Requests</h1>
      <p className="mt-1 text-sm text-zinc-500">Request equipment for your role.</p>

      <div className="mt-6 space-y-3">
        {equipment.map(({ id, data }) => (
          <div key={id} className="flex items-center justify-between rounded-md border p-4">
            <p className="font-medium">{data.name}</p>
            <button
              onClick={() => requestEquipment(data, id)}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              Request
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}