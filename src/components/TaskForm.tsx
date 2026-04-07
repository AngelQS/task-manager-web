import { useState, useRef } from 'react'
import type { Task, TaskStatus, TaskPriority } from '../types/task'

interface Props {
  onCreated: (task: Task) => void
  onClose: () => void
}

const API_URL = import.meta.env.VITE_API_URL ?? ''

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: 'none',
  background: '#f2f2f7',
  fontSize: 15,
  color: '#1d1d1f',
  appearance: 'none',
  WebkitAppearance: 'none',
  transition: 'background 0.15s, box-shadow 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#6e6e73',
  marginBottom: 5,
  letterSpacing: '0.01em',
}

function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.background = '#fff'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.3)'
}

function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.background = '#f2f2f7'
  e.currentTarget.style.boxShadow = 'none'
}

export default function TaskForm({ onCreated, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<TaskStatus>('PENDING')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [category, setCategory] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [checklist, setChecklist] = useState<string[]>([])
  const [checklistInput, setChecklistInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const checklistInputRef = useRef<HTMLInputElement>(null)

  function addChecklistItem() {
    const text = checklistInput.trim()
    if (!text) return
    setChecklist((prev) => [...prev, text])
    setChecklistInput('')
    checklistInputRef.current?.focus()
  }

  function removeChecklistItem(index: number) {
    setChecklist((prev) => prev.filter((_, i) => i !== index))
  }

  function handleChecklistKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addChecklistItem()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const body: Record<string, unknown> = { title: title.trim(), status, priority }
      if (category.trim()) body.category = category.trim()
      if (scheduledAt) body.scheduledAt = new Date(scheduledAt).toISOString()
      if (checklist.length) body.checklist = checklist.map((text) => ({ text }))

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
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.07)',
        padding: '22px 22px 20px',
        marginBottom: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.02em' }}>
          New Task
        </h2>
        <button
          onClick={onClose}
          style={{ background: '#f2f2f7', border: 'none', borderRadius: 980, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#48484a', fontSize: 13 }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={submitting}
              style={fieldStyle}
              autoFocus
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} disabled={submitting} style={fieldStyle}>
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
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} disabled={submitting} style={fieldStyle}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Category + Scheduled */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Category <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(optional)</span></label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="work, personal…" disabled={submitting} style={fieldStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>Scheduled <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(optional)</span></label>
              <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} disabled={submitting} style={fieldStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>

          {/* Checklist */}
          <div>
            <label style={labelStyle}>Checklist <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(optional)</span></label>

            {checklist.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {checklist.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#f2f2f7',
                      borderRadius: 8,
                      padding: '7px 10px',
                      fontSize: 14,
                      color: '#1d1d1f',
                    }}
                  >
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #c7c7cc', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aeaeb2', fontSize: 12, padding: 0 }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: 'flex', gap: 6 }}>
              <input
                ref={checklistInputRef}
                type="text"
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
                onKeyDown={handleChecklistKeyDown}
                placeholder="Add item and press Enter"
                disabled={submitting}
                style={{ ...fieldStyle, flex: 1 }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <button
                type="button"
                onClick={addChecklistItem}
                disabled={!checklistInput.trim()}
                style={{
                  background: checklistInput.trim() ? '#f2f2f7' : '#f9f9fb',
                  border: 'none',
                  borderRadius: 10,
                  padding: '0 14px',
                  fontSize: 18,
                  color: checklistInput.trim() ? '#1d1d1f' : '#c7c7cc',
                  cursor: checklistInput.trim() ? 'pointer' : 'not-allowed',
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#ff3b30', background: 'rgba(255,59,48,0.07)', borderRadius: 8, padding: '8px 12px' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 2 }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 18px', borderRadius: 980, border: 'none', background: '#f2f2f7', color: '#1d1d1f', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              style={{ padding: '8px 18px', borderRadius: 980, border: 'none', background: submitting || !title.trim() ? '#a0c4f1' : '#0071e3', color: '#fff', fontSize: 14, fontWeight: 500, cursor: submitting || !title.trim() ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Adding…' : 'Add Task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
