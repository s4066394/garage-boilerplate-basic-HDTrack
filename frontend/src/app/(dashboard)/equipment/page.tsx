'use client'

import { useEffect, useState } from 'react'
import { addDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { getEquipmentCollection, getEquipmentRequestCollection } from '@/lib/firebase/firestore'
import type { EquipmentItem, EquipmentRequest } from '@/types/firestore'

export default function EquipmentPage() {
  const { user, profile } = useAuth()
  const [equipment, setEquipment] = useState<{ id: string; data: EquipmentItem }[]>([])
  const [requests, setRequests] = useState<EquipmentRequest[]>([])

  async function loadRequests() {
    if (!user) return
    const requestQuery = query(getEquipmentRequestCollection(), where('employeeUid', '==', user.uid))
    const snapshot = await getDocs(requestQuery)
    setRequests(snapshot.docs.map((doc) => doc.data()))
  }

  useEffect(() => {
    async function loadData() {
      const snapshot = await getDocs(getEquipmentCollection())
      setEquipment(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      await loadRequests()
    }

    loadData()
  }, [user])

  async function requestEquipment(item: EquipmentItem, equipmentId: string) {
    if (!user) return

    const duplicate = requests.some(
        (request) => request.equipmentId === equipmentId && request.status === 'pending'
    )

    if (duplicate) {
        alert('You already have a pending request for this item.')
        return
    }

    await addDoc(getEquipmentRequestCollection(), {
        employeeUid: user.uid,
        employeeName: profile?.displayName ?? user.email ?? 'Employee',
        equipmentId,
        equipmentName: item.name,
        status: 'pending',
        createdAt: serverTimestamp(),
    })

    await loadRequests()
    }

  return (
    <div>
      <h1 className="text-2xl font-bold">Equipment Requests</h1>
      <p className="mt-1 text-sm text-zinc-500">Request equipment for your role.</p>

      <div className="mt-6 space-y-3">
        {equipment.map(({ id, data }) => (
          <div key={id} className="flex items-center justify-between rounded-md border p-4">
            <p className="font-medium">{data.name}</p>
            <button onClick={() => requestEquipment(data, id)} className="rounded-md border px-3 py-1.5 text-sm">
              Request
            </button>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-semibold">My Requests</h2>

      <div className="mt-3 space-y-3">
        {requests.map((request) => (
          <div key={`${request.equipmentId}-${request.employeeUid}`} className="flex items-center justify-between rounded-md border p-4">
            <p>{request.equipmentName}</p>
            <p className="text-sm capitalize">{request.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}