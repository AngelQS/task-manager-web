import { useState } from 'react'
import type { Task } from '../types/task'

interface Props {
  onCreated: (task: Task) => void
}

export default function TaskForm({ onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const task: Task = await res.json()
      onCreated(task)
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task…"
        disabled={submitting}
        style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}
      />
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        style={{
          padding: '6px 16px',
          borderRadius: 6,
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {submitting ? 'Adding…' : 'Add'}
      </button>
      {error && <span style={{ color: 'red', alignSelf: 'center' }}>{error}</span>}
    </form>
  )
}
