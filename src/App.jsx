import { useMemo, useRef, useState } from 'react'
import { ListChecks, Plus, Search, X } from 'lucide-react'
import TodoItem from './components/TodoItem'
import CategorySidebar from './components/CategorySidebar'
import StatsCard from './components/StatsCard'
import { CATEGORIES, FILTERS, PRIORITIES } from './constants'
import { addDays, dueStatus } from './utils/date'

export default function App() {
  const [todos, setTodos] = useState(() => [
    { id: 1, text: 'ซื้อของเข้าบ้าน', done: false, priority: 'medium', category: 'shopping', due: addDays(0) },
    { id: 2, text: 'ส่งรายงานให้หัวหน้า', done: false, priority: 'high', category: 'work', due: addDays(-2) },
    { id: 3, text: 'อ่านหนังสือ 20 หน้า', done: true, priority: 'low', category: 'personal', due: '' },
    { id: 4, text: 'นัดหมอฟัน', done: false, priority: 'medium', category: 'health', due: addDays(5) },
    { id: 5, text: 'ประชุมทีมประจำสัปดาห์', done: false, priority: 'low', category: 'work', due: addDays(1) },
  ])
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('work')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [query, setQuery] = useState('')
  const nextId = useRef(6)

  const add = () => {
    const t = input.trim()
    if (!t) return
    setTodos((l) => [{ id: nextId.current++, text: t, done: false, priority, category, due }, ...l])
    setInput('')
    setDue('')
  }
  const toggle = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const edit = (id, patch) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const cyclePriority = (id) =>
    setTodos((l) => l.map((t) => (t.id === id ? { ...t, priority: PRIORITIES[t.priority].next } : t)))
  const remove = (id) => {
    setTodos((l) => l.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    setTimeout(() => setTodos((l) => l.filter((t) => t.id !== id)), 260)
  }
  const clearDone = () => {
    setTodos((l) => l.map((t) => (t.done ? { ...t, leaving: true } : t)))
    setTimeout(() => setTodos((l) => l.filter((t) => !t.done)), 260)
  }

  const stats = useMemo(() => {
    const done = todos.filter((t) => t.done).length
    const overdue = todos.filter((t) => dueStatus(t) === 'overdue').length
    return { total: todos.length, done, overdue, active: todos.length - done - overdue }
  }, [todos])

  const catCounts = useMemo(() => {
    const c = {}
    todos.forEach((t) => (c[t.category] = (c[t.category] || 0) + 1))
    return c
  }, [todos])

  const q = query.trim().toLowerCase()
  const shown = todos.filter(
    (t) =>
      (filter === 'all' ? true : filter === 'active' ? !t.done : t.done) &&
      (catFilter === 'all' || t.category === catFilter) &&
      (!q || t.text.toLowerCase().includes(q))
  )

  const remaining = todos.filter((t) => !t.done).length
  const doneCount = stats.done
  const emptyMsg = q
    ? `ไม่พบงานที่ตรงกับ "${query.trim()}"`
    : filter === 'completed'
    ? 'ยังไม่มีงานที่เสร็จ'
    : filter === 'active'
    ? 'ไม่มีงานค้าง เยี่ยมมาก!'
    : 'ยังไม่มีงาน เพิ่มงานแรกได้เลย'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <header className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 44, height: 44, background: 'var(--accent)', color: '#fff' }}
        >
          <ListChecks size={24} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold leading-tight">รายการสิ่งที่ต้องทำ</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>จัดการงานของคุณให้เป็นระเบียบ</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-[230px_1fr] items-start">
        <aside className="space-y-4 md:sticky md:top-4">
          <CategorySidebar selected={catFilter} onSelect={setCatFilter} counts={catCounts} total={todos.length} />
          <StatsCard {...stats} />
        </aside>

        <main className="min-w-0">
          <div className="card p-3 sm:p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && add()}
                placeholder="เพิ่มงานใหม่..."
                className="field flex-1 min-w-0"
              />
              <button
                onClick={add}
                className="flex items-center gap-1 px-3 sm:px-4 rounded-lg font-medium shrink-0"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">เพิ่ม</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                aria-label="วันกำหนดส่ง"
                className="field text-sm"
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="หมวดหมู่" className="field text-sm">
                {Object.entries(CATEGORIES).map(([k, c]) => (
                  <option key={k} value={k}>{c.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>ความสำคัญ:</span>
                {Object.entries(PRIORITIES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setPriority(k)}
                    className={'text-xs font-medium px-3 py-1.5 rounded-full pri-' + k}
                    style={{
                      outline: priority === k ? '2px solid var(--accent)' : '2px solid transparent',
                      outlineOffset: 1,
                      opacity: priority === k ? 1 : 0.6,
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหางาน..."
              aria-label="ค้นหา"
              className="field card w-full"
              style={{ paddingLeft: 36, paddingRight: 36 }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="ล้างการค้นหา"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'var(--muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-1 mt-3 p-1 rounded-xl" style={{ background: 'var(--line)' }}>
            {FILTERS.map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className="flex-1 py-2 text-sm rounded-lg font-medium"
                style={{
                  background: filter === k ? 'var(--card)' : 'transparent',
                  boxShadow: filter === k ? 'var(--shadow)' : 'none',
                  color: filter === k ? 'var(--text)' : 'var(--muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="list-none p-0 m-0 mt-2">
            {shown.map((t) => (
              <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={remove} onEdit={edit} onPriority={cyclePriority} />
            ))}
          </ul>
          {shown.length === 0 && (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--muted)' }}>{emptyMsg}</div>
          )}

          <div className="flex items-center justify-between mt-4 px-1 text-sm" style={{ color: 'var(--muted)' }}>
            <span>เหลืออีก {remaining} งาน</span>
            <button
              onClick={clearDone}
              disabled={doneCount === 0}
              className="font-medium"
              style={{
                color: doneCount ? 'var(--accent)' : 'var(--muted)',
                opacity: doneCount ? 1 : 0.5,
                cursor: doneCount ? 'pointer' : 'default',
              }}
            >
              ล้างงานที่เสร็จแล้ว ({doneCount})
            </button>
          </div>
          <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
            ดับเบิลคลิกที่ข้อความเพื่อแก้ไข • แตะป้ายความสำคัญเพื่อเปลี่ยนระดับ
          </p>
        </main>
      </div>
    </div>
  )
}
