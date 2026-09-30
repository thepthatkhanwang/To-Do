// All dates are handled as local "YYYY-MM-DD" strings so time zones never shift a due date.
const pad = (n) => String(n).padStart(2, '0')

export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const todayStr = () => toDateStr(new Date())

export const addDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

// 'overdue' | 'today' | 'upcoming' | 'none'. Completed todos never count as overdue/today.
export const dueStatus = (todo) => {
  if (!todo.due || todo.done) return todo.due ? 'upcoming' : 'none'
  const t = todayStr()
  if (todo.due < t) return 'overdue'
  if (todo.due === t) return 'today'
  return 'upcoming'
}

export const formatDue = (str) => {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}
