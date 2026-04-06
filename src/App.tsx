import { useEffect, useState } from 'react'
import type { Task, TaskStatus } from './types/task'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import EnvBadge from './components/EnvBadge'

const API_URL = import.meta.env.VITE_API_URL ?? ''

type FilterStatus = TaskStatus | 'ALL'

const FILTER_TABS: { label: string; value: FilterStatus }[] = [
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
    } catch {
      // silent — card will revert visually on next render
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch {
      // silent
    }
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter)

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    urgent: tasks.filter((t) => t.priority === 'URGENT').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>📋</span>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Task Manager
              </h1>
            </div>
            <EnvBadge />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Total', value: stats.total, color: 'rgba(255,255,255,0.2)' },
              { label: 'In Progress', value: stats.inProgress, color: 'rgba(96,165,250,0.3)' },
              { label: 'Urgent', value: stats.urgent, color: 'rgba(252,165,165,0.3)' },
              { label: 'Completed', value: stats.completed, color: 'rgba(110,231,183,0.3)' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: s.color,
                  borderRadius: 10,
                  padding: '8px 16px',
                  minWidth: 72,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>
        {/* Form toggle */}
        {showForm ? (
          <TaskForm onCreated={handleCreated} onClose={() => setShowForm(false)} />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Task
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            overflowX: 'auto',
            marginBottom: 16,
            paddingBottom: 2,
          }}
        >
          {FILTER_TABS.map((tab) => {
            const count = tab.value === 'ALL' ? tasks.length : tasks.filter((t) => t.status === tab.value).length
            const active = filter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                style={{
                  background: active ? '#6366f1' : '#fff',
                  color: active ? '#fff' : '#64748b',
                  border: `1px solid ${active ? '#6366f1' : '#e2e8f0'}`,
                  borderRadius: 20,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    style={{
                      background: active ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: active ? '#fff' : '#64748b',
                      borderRadius: 10,
                      padding: '0 6px',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Task list */}
        <TaskList
          tasks={filtered}
          loading={loading}
          error={error}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}
