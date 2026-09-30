// Small donut built from SVG circles. r = 100 / (2π) so the circumference is exactly 100.
const R = 15.9155

export default function DonutChart({ segments, size = 96 }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  let offset = 25 // start at 12 o'clock

  return (
    <svg width={size} height={size} viewBox="0 0 42 42" role="img" aria-label="สัดส่วนสถานะงาน">
      <circle cx="21" cy="21" r={R} fill="none" stroke="var(--line)" strokeWidth="5" />
      {total > 0 &&
        segments.map((s) => {
          if (s.value === 0) return null
          const pct = (s.value / total) * 100
          const el = (
            <circle
              key={s.key}
              cx="21"
              cy="21"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="5"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={offset}
            />
          )
          offset -= pct
          return el
        })}
    </svg>
  )
}
