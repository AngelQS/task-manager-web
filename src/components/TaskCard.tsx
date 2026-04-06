import type { Task, TaskStatus } from '../types/task'

const STATUS_CYCLE: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'SCHEDULED', 'ON_HOLD', 'COMPLETED', 'CANCELLED']

const STATUS_LABEL: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  SCHEDULED: 'Scheduled',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const STATUS_COLOR: Record<TaskStatus, { bg: string; text: string }> = {
  PENDING:     { bg: '#fef9c3', text: '#854d0e' },
  IN_PROGRESS: { bg: '#dbeafe', text: '#1d4ed8' },
  SCHEDULED:   { bg: '#ede9fe', text: '#6d28d9' },
  ON_HOLD:     { bg: '#ffedd5', text: '#c2410c' },
  COMPLETED:   { bg: '#dcfce7', text: '#15803d' },
  CANCELLED:   { bg: '#f1f5f9', text: '#64748b' },
}

const PRIORITY_BORDER: Record<string, string> = {
  LOW:    '#94a3b8',
  MEDIUM: '#3b82f6',
  HIGH:   '#f97316',
  URGENT: '#ef4444',
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent',
}

interface Props {
  task: Task
  onStatusChange: (id: number, status: TaskStatus) => void
  onDelete: (id: number) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const statusStyle = STATUS_COLOR[task.status]
  const borderColor = PRIORITY_BORDER[task.priority]
  const isCompleted = task.status === 'COMPLETED'
  const isCancelled = task.status === 'CANCELLED'
  const faded = isCompleted || isCancelled

  function cycleStatus() {
    const idx = STATUS_CYCLE.indexOf(task.status)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    onStatusChange(task.id, next)
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        borderLeft: `4px solid ${borderColor}`,
        padding: '14px 16px',
        marginBottom: 10,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        opacity: faded ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Priority dot */}
      <div style={{ paddingTop: 3 }}>
        <div
          title={`Priority: ${PRIORITY_LABEL[task.priority]}`}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: borderColor,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 15,
            fontWeight: 600,
            color: '#0f172a',
            textDecoration: faded ? 'line-through' : 'none',
            wordBreak: 'break-word',
          }}
        >
          {task.title}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {/* Status badge — clickable to cycle */}
          <button
            onClick={cycleStatus}
            title="Click to change status"
            style={{
              background: statusStyle.bg,
              color: statusStyle.text,
              border: 'none',
              borderRadius: 20,
              padding: '2px 10px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {STATUS_LABEL[task.status]}
          </button>

          {/* Priority badge */}
          <span
            style={{
              background: '#f8fafc',
              color: borderColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 20,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {PRIORITY_LABEL[task.priority]}
          </span>

          {/* Category tag */}
          {task.category && (
            <span
              style={{
                background: '#f1f5f9',
                color: '#475569',
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 11,
              }}
            >
              #{task.category}
            </span>
          )}
        </div>

        {/* Scheduled date */}
        {task.scheduledAt && (
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>📅</span>
            <span>{formatDate(task.scheduledAt)}</span>
          </p>
        )}
      </div>

      {/* Right: created date + delete */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onDelete(task.id)}
          title="Delete task"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: 16,
            padding: 2,
            lineHeight: 1,
            borderRadius: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          ✕
        </button>
        <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}
