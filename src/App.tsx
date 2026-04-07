import { useEffect, useState } from 'react'
import type { Task, TaskStatus } from './types/task'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import EnvBadge from './components/EnvBadge'

const API_URL = import.meta.env.VITE_API_URL ?? ''

type FilterStatus = TaskStatus | 'ALL'

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'On Hold', value: 'ON_HOLD' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<FilterStatus>('ALL')

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Task[]>
      })
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  function handleCreated(task: Task) {
    setTasks((prev) => [task, ...prev])
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated: Task = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch { /* silent */ }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch { /* silent */ }
  }

  async function handleToggleChecklistItem(taskId: number, itemId: number) {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/checklist/${itemId}`, { method: 'PATCH' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated: Task = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch { /* silent */ }
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter)

  const stats = [
    { label: 'Total',       value: tasks.length },
    { label: 'In Progress', value: tasks.filter((t) => t.status === 'IN_PROGRESS').length },
    { label: 'Urgent',      value: tasks.filter((t) => t.priority === 'URGENT').length },
    { label: 'Completed',   value: tasks.filter((t) => t.status === 'COMPLETED').length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7' }}>
      {/* Sticky frosted glass header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(245,245,247,0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '0.5px solid rgba(0,0,0,0.1)',
          padding: '14px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, color: '#1d1d1f' }}>✦</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.02em' }}>
              Tasks
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <EnvBadge />
            <button
              onClick={() => setShowForm((v) => !v)}
              style={{
                background: '#0071e3',
                color: '#fff',
                border: 'none',
                borderRadius: 980,
                padding: '6px 16px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
              }}
            >
              {showForm ? 'Cancel' : '+ New'}
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '28px 16px 48px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: '#ffffff',
                borderRadius: 14,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.06)',
                padding: '14px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: '#8e8e93' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && <TaskForm onCreated={handleCreated} onClose={() => setShowForm(false)} />}

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 2, scrollbarWidth: 'none' }}>
          {FILTERS.map((f) => {
            const count = f.value === 'ALL' ? tasks.length : tasks.filter((t) => t.status === f.value).length
            const active = filter === f.value
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  background: active ? '#1d1d1f' : '#ffffff',
                  color: active ? '#ffffff' : '#48484a',
                  border: active ? 'none' : '0.5px solid rgba(0,0,0,0.12)',
                  borderRadius: 980,
                  padding: '5px 13px',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: active ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'background 0.15s, color 0.15s',
                  flexShrink: 0,
                }}
              >
                {f.label}
                {count > 0 && (
                  <span
                    style={{
                      background: active ? 'rgba(255,255,255,0.2)' : '#f2f2f7',
                      color: active ? '#fff' : '#8e8e93',
                      borderRadius: 980,
                      padding: '0 5px',
                      fontSize: 10,
                      fontWeight: 600,
                      minWidth: 16,
                      textAlign: 'center',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* List */}
        <TaskList
          tasks={filtered}
          loading={loading}
          error={error}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onToggleChecklistItem={handleToggleChecklistItem}
        />
      </main>
    </div>
  )
}
