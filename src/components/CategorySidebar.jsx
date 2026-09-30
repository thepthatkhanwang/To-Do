import { CATEGORIES } from '../constants'

export default function CategorySidebar({ selected, onSelect, counts, total }) {
  const items = [
    { key: 'all', label: 'ทั้งหมด', dot: 'var(--muted)', count: total },
    ...Object.entries(CATEGORIES).map(([key, c]) => ({ key, label: c.label, dot: c.dot, count: counts[key] || 0 })),
  ]

  return (
    <nav className="card p-2" aria-label="หมวดหมู่">
      <h2 className="text-sm font-semibold px-2 pt-2 pb-1 hidden md:block">หมวดหมู่</h2>
      <ul className="list-none p-0 m-0 flex md:flex-col gap-1 overflow-x-auto">
        {items.map((it) => {
          const active = selected === it.key
          return (
            <li key={it.key} className="shrink-0">
              <button
                onClick={() => onSelect(it.key)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                style={{
                  background: active ? 'var(--line)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span className="rounded-full" style={{ width: 8, height: 8, background: it.dot }} />
                <span>{it.label}</span>
                <span
                  className="md:ml-auto text-xs px-1.5 rounded-full"
                  style={{ background: 'var(--card)', color: 'var(--muted)', minWidth: 20, textAlign: 'center' }}
                >
                  {it.count}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
