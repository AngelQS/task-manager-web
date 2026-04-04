import type { Task } from '../types/task'

interface Props {
  tasks: Task[]
  loading: boolean
  error: string | null
}

export default function TaskList({ tasks, loading, error }: Props) {
  if (loading) return <p>Loading tasks…</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (tasks.length === 0) return <p>No tasks yet. Create one!</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{
            padding: '8px 12px',
            marginBottom: 6,
            background: '#f3f4f6',
            borderRadius: 6,
            textDecoration: task.done ? 'line-through' : 'none',
            color: task.done ? '#9ca3af' : 'inherit',
          }}
        >
          {task.title}
        </li>
      ))}
    </ul>
  )
}
