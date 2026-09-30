import DonutChart from './DonutChart'

export default function StatsCard({ total, done, active, overdue }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const segments = [
    { key: 'done', label: 'เสร็จแล้ว', value: done, color: '#10b981' },
    { key: 'active', label: 'กำลังทำ', value: active, color: '#6366f1' },
    { key: 'overdue', label: 'เกินกำหนด', value: overdue, color: '#ef4444' },
  ]

  return (
    <section className="card p-4">
      <h2 className="text-sm font-semibold mb-3">สถิติ</h2>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
          <DonutChart segments={segments} />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{pct}%</div>
        </div>
        <div className="min-w-0 text-sm space-y-1">
          <div>
            <span style={{ color: 'var(--muted)' }}>งานทั้งหมด </span>
            <span className="font-semibold">{total}</span>
          </div>
          <div>
            <span style={{ color: 'var(--muted)' }}>เสร็จแล้ว </span>
            <span className="font-semibold">{pct}%</span>
          </div>
        </div>
      </div>
      <ul className="list-none p-0 m-0 mt-3 space-y-1.5 text-xs">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span className="rounded-full" style={{ width: 8, height: 8, background: s.color }} />
            <span style={{ color: 'var(--muted)' }}>{s.label}</span>
            <span className="ml-auto font-medium">{s.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
