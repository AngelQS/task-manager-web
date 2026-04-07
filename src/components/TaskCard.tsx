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
  onToggleChecklistItem: (taskId: number, itemId: number) => void
}

function formatScheduled(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatCreated(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskCard({ task, onStatusChange, onDelete, onToggleChecklistItem }: Props) {
  const status = STATUS_META[task.status]
  const priority = PRIORITY_META[task.priority]
  const faded = task.status === 'COMPLETED' || task.status === 'CANCELLED'
  const hasChecklist = task.checklist?.length > 0
  const completedCount = task.checklist?.filter((i) => i.completed).length ?? 0
  const totalCount = task.checklist?.length ?? 0
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

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
        opacity: faded ? 0.55 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Priority dot */}
        <div style={{ paddingTop: 4, flexShrink: 0 }}>
          <svg width="8" height="8" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="4" fill={priority.color} />
          </svg>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 6, textDecoration: faded ? 'line-through' : 'none', letterSpacing: '-0.01em', wordBreak: 'break-word' }}>
            {task.title}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            <button
              onClick={cycleStatus}
              title="Click to advance status"
              style={{ background: status.bg, color: status.text, border: 'none', borderRadius: 980, padding: '2px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}
            >
              {status.label}
            </button>
            <span style={{ color: priority.color, fontSize: 11, fontWeight: 500 }}>{priority.label}</span>
            {task.category && (
              <span style={{ background: '#f2f2f7', color: '#48484a', borderRadius: 5, padding: '2px 7px', fontSize: 11 }}>
                {task.category}
              </span>
            )}
          </div>

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
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#c7c7cc', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, fontSize: 13 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ff3b30')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#c7c7cc')}
          >
            ✕
          </button>
          <span style={{ fontSize: 11, color: '#aeaeb2' }}>{formatCreated(task.createdAt)}</span>
        </div>
      </div>

      {/* Checklist */}
      {hasChecklist && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid #f2f2f7' }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 4, background: '#f2f2f7', borderRadius: 980, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: progress === 100 ? '#34c759' : '#007aff',
                  borderRadius: 980,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: '#8e8e93', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Items */}
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {task.checklist.map((item) => (
              <li
                key={item.id}
                onClick={() => onToggleChecklistItem(task.id, item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 4px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9fb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: item.completed ? 'none' : '1.5px solid #c7c7cc',
                    background: item.completed ? '#34c759' : 'transparent',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}
                >
                  {item.completed && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3L3.5 5.5L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: item.completed ? '#8e8e93' : '#1d1d1f',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    transition: 'color 0.15s',
                  }}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
