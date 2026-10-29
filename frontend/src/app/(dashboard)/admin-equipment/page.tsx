'use client'

import { useEffect, useState } from 'react'
import { doc, getDocs, updateDoc } from 'firebase/firestore'
import { getClientDb } from '@/lib/firebase/client'
import { getEquipmentRequestCollection } from '@/lib/firebase/firestore'
import type { EquipmentRequest } from '@/types/firestore'

export default function AdminEquipmentPage() {
  const [requests, setRequests] = useState<{ id: string; data: EquipmentRequest }[]>([])

  async function loadRequests() {
    const snapshot = await getDocs(getEquipmentRequestCollection())

    setRequests(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))
    )
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function updateStatus(requestId: string, status: 'approved' | 'rejected') {
    const requestRef = doc(getClientDb(), 'equipmentRequests', requestId)

    await updateDoc(requestRef, {
      status,
    })

    await loadRequests()
  }

  return (
    <div className="min-h-screen bg-white p-6 text-zinc-900">
      <h1 className="text-2xl font-bold">Equipment Approvals</h1>
      <p className="mt-1 text-sm text-zinc-500">Review employee equipment requests.</p>

      <div className="mt-6 space-y-3">
        {requests.map(({ id, data }) => (
          <div
            key={id}
            className="rounded-md border border-zinc-200 bg-zinc-50 p-4"
          >
            <p className="font-medium">{data.employeeName}</p>
            <p className="text-sm text-zinc-600">{data.equipmentName}</p>
            <p className="mt-1 text-sm capitalize text-zinc-600">{data.status}</p>

            {data.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(id, 'approved')}
                  className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(id, 'rejected')}
                  className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}