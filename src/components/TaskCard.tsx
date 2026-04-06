import type { Task, TaskStatus } from '../types/task'

const STATUS_CYCLE: TaskStatus[] = [
  'PENDING', 'IN_PROGRESS', 'SCHEDULED', 'ON_HOLD', 'COMPLETED', 'CANCELLED',
]

const STATUS_META: Record<TaskStatus, { label: string; bg: string; text: string }> = {
  PENDING:     { label: 'Pending',     bg: 'rgba(255,159,10,0.12)',  text: '#b25000' },
  IN_PROGRESS: { label: 'In Progress', bg: 'rgba(0,122,255,0.10)',   text: '#0055cc' },
  SCHEDULED:   { label: 'Scheduled',   bg: 'rgba(88,86,214,0.10)',   text: '#3634a3' },
  ON_HOLD:     { label: 'On Hold',     bg: 'rgba(255,107,0,0.10)',   text: '#c04800' },
  COMPLETED:   { label: 'Completed',   bg: 'rgba(52,199,89,0.10)',   text: '#1a7f37' },
  CANCELLED:   { label: 'Cancelled',   bg: 'rgba(142,142,147,0.12)', text: '#48484a' },
}

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  LOW:    { label: 'Low',    color: '#8e8e93' },
  MEDIUM: { label: 'Medium', color: '#007aff' },
  HIGH:   { label: 'High',   color: '#ff9500' },
  URGENT: { label: 'Urgent', color: '#ff3b30' },
}

interface Props {
  task: Task
  onStatusChange: (id: number, status: TaskStatus) => void
  onDelete: (id: number) => void
}

function formatScheduled(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatCreated(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const status = STATUS_META[task.status]
  const priority = PRIORITY_META[task.priority]
  const faded = task.status === 'COMPLETED' || task.status === 'CANCELLED'

  function cycleStatus() {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length]
    onStatusChange(task.id, next)
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.07)',
        padding: '14px 16px',
        marginBottom: 8,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        opacity: faded ? 0.55 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Priority dot */}
      <div style={{ paddingTop: 4, flexShrink: 0 }}>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="4" fill={priority.color} />
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: '#1d1d1f',
            marginBottom: 6,
            textDecoration: faded ? 'line-through' : 'none',
            letterSpacing: '-0.01em',
            wordBreak: 'break-word',
          }}
        >
          {task.title}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
          {/* Status pill — clickable */}
          <button
            onClick={cycleStatus}
            title="Click to advance status"
            style={{
              background: status.bg,
              color: status.text,
              border: 'none',
              borderRadius: 980,
              padding: '2px 9px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            {status.label}
          </button>

          {/* Priority label */}
          <span style={{ color: priority.color, fontSize: 11, fontWeight: 500 }}>
            {priority.label}
          </span>

          {/* Category */}
          {task.category && (
            <span
              style={{
                background: '#f2f2f7',
                color: '#48484a',
                borderRadius: 5,
                padding: '2px 7px',
                fontSize: 11,
              }}
            >
              {task.category}
            </span>
          )}
        </div>

        {/* Scheduled date */}
        {task.scheduledAt && (
          <p style={{ marginTop: 5, fontSize: 12, color: '#5856d6', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
              <rect x="0.5" y="1.5" width="10" height="10" rx="2.5" stroke="#5856d6"/>
              <path d="M3 0.5V2.5M8 0.5V2.5" stroke="#5856d6" strokeLinecap="round"/>
              <path d="M0.5 5H10.5" stroke="#5856d6"/>
            </svg>
            {formatScheduled(task.scheduledAt)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onDelete(task.id)}
          title="Delete"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#c7c7cc',
            width: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            fontSize: 13,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ff3b30')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#c7c7cc')}
        >
          ✕
        </button>
        <span style={{ fontSize: 11, color: '#aeaeb2' }}>{formatCreated(task.createdAt)}</span>
      </div>
    </div>
  )
}
