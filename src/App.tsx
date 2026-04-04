import { useEffect, useState } from 'react'
import type { Task } from './types/task'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import EnvBadge from './components/EnvBadge'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = import.meta.env.VITE_API_URL ?? ''

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
    setTasks((prev) => [...prev, task])
  }

  return (
    <div style={{ maxWidth: 600, margin: '48px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Task Manager</h1>
        <EnvBadge />
      </header>

      <TaskForm onCreated={handleCreated} />
      <TaskList tasks={tasks} loading={loading} error={error} />
    </div>
  )
}
