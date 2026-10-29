'use client'

import { useEffect, useState } from 'react'
import { getDocs } from 'firebase/firestore'
import { getEquipmentCollection } from '@/lib/firebase/firestore'
import type { EquipmentItem } from '@/types/firestore'

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])

  useEffect(() => {
    async function loadEquipment() {
      const snapshot = await getDocs(getEquipmentCollection())
      setEquipment(snapshot.docs.map((doc) => doc.data()))
    }

    loadEquipment()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold">Equipment Requests</h1>
      <p className="mt-1 text-sm text-zinc-500">Request equipment for your role.</p>

      <div className="mt-6 space-y-3">
        {equipment.map((item) => (
        <div key={item.name} className="flex items-center justify-between rounded-md border p-4">
            <p className="font-medium">{item.name}</p>
            <button className="rounded-md border px-3 py-1.5 text-sm">Request</button>
        </div>
        ))}
      </div>
    </div>
  )
}