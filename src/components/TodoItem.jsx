import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Check, Trash2 } from 'lucide-react'
import { CATEGORIES, PRIORITIES } from '../constants'
import { dueStatus, formatDue } from '../utils/date'

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onPriority }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ text: todo.text, due: todo.due, category: todo.category })
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const startEdit = () => {
    setDraft({ text: todo.text, due: todo.due, category: todo.category })
    setEditing(true)
  }
  const save = () => {
    const text = draft.text.trim()
    if (text) onEdit(todo.id, { text, due: draft.due, category: draft.category })
    setEditing(false)
  }
  const cancel = () => setEditing(false)
  const onKey = (e) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') cancel()
  }

  const status = dueStatus(todo)
  const dueLabel =
    status === 'overdue' ? `เกินกำหนด · ${formatDue(todo.due)}` : status === 'today' ? 'วันนี้' : todo.due ? formatDue(todo.due) : ''
  const cat = CATEGORIES[todo.category]

  return (
    <li className={'item enter card flex items-start gap-3 px-3 py-3 mt-2 ' + (todo.leaving ? 'leaving' : '')} style={{ maxHeight: 220 }}>
      <button
        onClick={() => onToggle(todo.id)}
        aria-label="ทำเครื่องหมายว่าเสร็จ"
        className="shrink-0 flex items-center justify-center rounded-md mt-0.5"
        style={{
          width: 24,
          height: 24,
          border: '2px solid ' + (todo.done ? 'var(--accent)' : 'var(--line)'),
          background: todo.done ? 'var(--accent)' : 'transparent',
          color: '#fff',
        }}
      >
        {todo.done && <Check size={14} />}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2">
            <input
              ref={inputRef}
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              onKeyDown={onKey}
              className="field w-full"
            />
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={draft.due}
                onChange={(e) => setDraft({ ...draft, due: e.target.value })}
                onKeyDown={onKey}
                className="field text-sm"
              />
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="field text-sm"
              >
                {Object.entries(CATEGORIES).map(([k, c]) => (
                  <option key={k} value={k}>{c.label}</option>
                ))}
              </select>
              <button onClick={save} className="px-3 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>บันทึก</button>
              <button onClick={cancel} className="px-3 rounded-lg text-sm" style={{ color: 'var(--muted)' }}>ยกเลิก</button>
            </div>
          </div>
        ) : (
          <>
            <span
              onDoubleClick={() => !todo.done && startEdit()}
              title="ดับเบิลคลิกเพื่อแก้ไข"
              className="block break-words select-none"
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                color: todo.done ? 'var(--muted)' : 'var(--text)',
                cursor: 'text',
              }}
            >
              {todo.text}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--line)' }}>
                <span className="rounded-full" style={{ width: 6, height: 6, background: cat.dot }} />
                {cat.label}
              </span>
              {todo.due && (
                <span className={'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full due-' + status}>
                  <CalendarDays size={12} />
                  {dueLabel}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => onPriority(todo.id)}
        title="แตะเพื่อเปลี่ยนความสำคัญ"
        className={'shrink-0 text-xs font-medium px-2.5 py-1 rounded-full pri-' + todo.priority}
      >
        {PRIORITIES[todo.priority].label}
      </button>

      <button
        onClick={() => onDelete(todo.id)}
        aria-label="ลบ"
        className="shrink-0 p-1.5 rounded-md hover:opacity-70"
        style={{ color: 'var(--muted)' }}
      >
        <Trash2 size={18} />
      </button>
    </li>
  )
}
