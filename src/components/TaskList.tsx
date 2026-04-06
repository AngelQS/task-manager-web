import type { Task, TaskStatus } from '../types/task'
import TaskCard from './TaskCard'

interface Props {
  tasks: Task[]
  loading: boolean
  error: string | null
  onStatusChange: (id: number, status: TaskStatus) => void
  onDelete: (id: number) => void
}

export default function TaskList({ tasks, loading, error, onStatusChange, onDelete }: Props) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
        <p style={{ margin: 0, fontSize: 14 }}>Loading tasks…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
        <p style={{ margin: 0, fontSize: 14, color: '#dc2626' }}>Error: {error}</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>No tasks here</p>
        <p style={{ margin: '4px 0 0', fontSize: 13 }}>Create one to get started</p>
      </div>
    )
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
