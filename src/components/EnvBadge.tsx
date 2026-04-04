export default function EnvBadge() {
  const mode = import.meta.env.MODE

  const colors: Record<string, string> = {
    development: '#f59e0b',
    production: '#10b981',
    test: '#6366f1',
  }

  const bg = colors[mode] ?? '#6b7280'

  return (
    <span
      style={{
        background: bg,
        color: '#fff',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        fontFamily: 'monospace',
      }}
    >
      {mode}
    </span>
  )
}
