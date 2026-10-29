'use client'

import { useEffect, useState } from 'react'
import { addDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { getEquipmentCollection, getEquipmentRequestCollection } from '@/lib/firebase/firestore'
import type { EquipmentItem, EquipmentRequest } from '@/types/firestore'

export default function EquipmentPage() {
  const { user, profile } = useAuth()
  const [equipment, setEquipment] = useState<{ id: string; data: EquipmentItem }[]>([])
  const [requests, setRequests] = useState<{ id: string; data: EquipmentRequest }[]>([])

  async function loadRequests() {
    if (!user) return

    try {
      const q = query(
        getEquipmentRequestCollection(),
        where('employeeUid', '==', user.uid)
      )

      const snapshot = await getDocs(q)

      setRequests(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    } catch {
      return
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        const snapshot = await getDocs(getEquipmentCollection())

        setEquipment(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )

        await loadRequests()
      } catch {
        return
      }
    }

    loadData()
  }, [user])

  async function requestEquipment(item: EquipmentItem, equipmentId: string) {
    if (!user) return

    const duplicate = requests.some(
      ({ data }) => data.equipmentId === equipmentId
    )

    if (duplicate) {
      alert('You have already requested this item.')
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
    <div className="min-h-screen bg-white p-6 text-zinc-900">
      <h1 className="text-2xl font-bold">Equipment Requests</h1>
      <p className="mt-1 text-sm text-zinc-500">Request equipment for your role.</p>

      <div className="mt-6 space-y-3">
        {equipment.map(({ id, data }) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-4"
          >
            <p className="font-medium">{data.name}</p>

            <button
              onClick={() => requestEquipment(data, id)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100"
            >
              Request
            </button>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-semibold">My Requests</h2>

      <div className="mt-3 space-y-3">
        {requests.map(({ id, data }) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-4"
          >
            <p>{data.equipmentName}</p>
            <p className="text-sm capitalize text-zinc-600">{data.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}