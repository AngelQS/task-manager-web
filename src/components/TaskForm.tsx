import { useState } from 'react'
import type { Task, TaskStatus, TaskPriority } from '../types/task'

interface Props {
  onCreated: (task: Task) => void
  onClose: () => void
}

const API_URL = import.meta.env.VITE_API_URL ?? ''

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  fontSize: 14,
  color: '#0f172a',
  background: '#f8fafc',
  boxSizing: 'border-box',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export default function TaskForm({ onCreated, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<TaskStatus>('PENDING')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [category, setCategory] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        status,
        priority,
      }
      if (category.trim()) body.category = category.trim()
      if (scheduledAt) body.scheduledAt = new Date(scheduledAt).toISOString()

      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const task: Task = await res.json()
      onCreated(task)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        padding: 24,
        marginBottom: 24,
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>New Task</h2>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={submitting}
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={submitting}
                style={inputStyle}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                disabled={submitting}
                style={inputStyle}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Category + Scheduled date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Category <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span></label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. work, personal"
                disabled={submitting}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Scheduled date <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span></label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={submitting}
                style={inputStyle}
              />
            </div>
          </div>

          {error && (
            <p style={{ margin: 0, color: '#dc2626', fontSize: 13, background: '#fef2f2', padding: '8px 12px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
                fontSize: 14,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                background: submitting || !title.trim() ? '#c7d2fe' : '#6366f1',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: submitting || !title.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Creating…' : 'Create Task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
