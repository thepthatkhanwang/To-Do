import { useRef, useState } from 'react'
import { ListChecks, Plus } from 'lucide-react'
import TodoItem from './components/TodoItem'
import { FILTERS, PRIORITIES } from './constants'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'ซื้อของเข้าบ้าน', done: false, priority: 'medium' },
    { id: 2, text: 'ส่งรายงานให้หัวหน้า', done: false, priority: 'high' },
    { id: 3, text: 'อ่านหนังสือ 20 หน้า', done: true, priority: 'low' },
  ])
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const nextId = useRef(4)

  const add = () => {
    const t = input.trim()
    if (!t) return
    setTodos((l) => [{ id: nextId.current++, text: t, done: false, priority }, ...l])
    setInput('')
  }
  const toggle = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const edit = (id, text) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, text } : t)))
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

  const remaining = todos.filter((t) => !t.done).length
  const doneCount = todos.filter((t) => t.done).length
  const shown = todos.filter((t) => (filter === 'all' ? true : filter === 'active' ? !t.done : t.done))
  const emptyMsg =
    filter === 'completed'
      ? 'ยังไม่มีงานที่เสร็จ'
      : filter === 'active'
      ? 'ไม่มีงานค้าง เยี่ยมมาก!'
      : 'ยังไม่มีงาน เพิ่มงานแรกได้เลย'

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
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

      <div className="card p-3 sm:p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="เพิ่มงานใหม่..."
            className="flex-1 min-w-0 bg-transparent outline-none px-3 py-2.5 rounded-lg"
            style={{ border: '1px solid var(--line)' }}
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
        <div className="flex items-center gap-2 mt-3 flex-wrap">
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

      <div className="flex gap-1 mt-5 p-1 rounded-xl" style={{ background: 'var(--line)' }}>
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
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={toggle}
            onDelete={remove}
            onEdit={edit}
            onPriority={cyclePriority}
          />
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
    </div>
  )
}
