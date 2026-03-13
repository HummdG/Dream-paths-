'use client'

import { useState } from 'react'

type Submission = {
  id: string
  name: string
  email: string
  type: string
  message: string
  isRead: boolean
  createdAt: Date
}

export function ContactList({ submissions }: { submissions: Submission[] }) {
  const [items, setItems] = useState(submissions)

  async function markRead(id: string) {
    await fetch(`/api/admin/contact/${id}/read`, { method: 'PATCH' })
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, isRead: true } : s)))
  }

  if (items.length === 0) {
    return <p className="text-gray-500">No submissions yet.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((s) => (
        <div
          key={s.id}
          className={`rounded-xl border p-5 ${s.isRead ? 'border-gray-800 bg-gray-900' : 'border-indigo-700 bg-gray-900'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{s.name}</span>
                <span className="text-gray-400 text-sm">{s.email}</span>
                <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-300 capitalize">
                  {s.type}
                </span>
                {!s.isRead && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                    Unread
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{s.message}</p>
              <p className="mt-2 text-xs text-gray-500">
                {new Date(s.createdAt).toLocaleString()}
              </p>
            </div>
            {!s.isRead && (
              <button
                onClick={() => markRead(s.id)}
                className="shrink-0 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:border-indigo-500 hover:text-white transition-colors"
              >
                Mark read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
