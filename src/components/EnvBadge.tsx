export default function EnvBadge() {
  const mode = import.meta.env.MODE

  const colors: Record<string, { bg: string; text: string }> = {
    development: { bg: 'rgba(255,159,10,0.14)', text: '#b25000' },
    production:  { bg: 'rgba(52,199,89,0.14)',  text: '#1a7f37' },
    test:        { bg: 'rgba(88,86,214,0.14)',   text: '#3634a3' },
  }

  const { bg, text } = colors[mode] ?? { bg: 'rgba(142,142,147,0.14)', text: '#48484a' }

  return (
    <span
      style={{
        background: bg,
        color: text,
        padding: '3px 10px',
        borderRadius: 980,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.01em',
      }}
    >
      {mode}
    </span>
  )
}
