import { useEffect, useRef, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { PRIORITIES } from '../constants'

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onPriority }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const save = () => {
    const t = text.trim()
    if (t) onEdit(todo.id, t)
    else setText(todo.text)
    setEditing(false)
  }
  const cancel = () => {
    setText(todo.text)
    setEditing(false)
  }

  return (
    <li className={'item enter card flex items-center gap-3 px-3 py-3 mt-2 ' + (todo.leaving ? 'leaving' : '')}>
      <button
        onClick={() => onToggle(todo.id)}
        aria-label="ทำเครื่องหมายว่าเสร็จ"
        className="shrink-0 flex items-center justify-center rounded-md"
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
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') cancel()
            }}
            className="w-full bg-transparent outline-none px-2 py-1 rounded-md"
            style={{ border: '1px solid var(--accent)' }}
          />
        ) : (
          <span
            onDoubleClick={() => !todo.done && setEditing(true)}
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
