export const PRIORITIES = {
  low: { label: 'ต่ำ', next: 'medium' },
  medium: { label: 'กลาง', next: 'high' },
  high: { label: 'สูง', next: 'low' },
}

export const FILTERS = [
  ['all', 'ทั้งหมด'],
  ['active', 'ยังไม่เสร็จ'],
  ['completed', 'เสร็จแล้ว'],
]

export const CATEGORIES = {
  work: { label: 'งาน', dot: '#6366f1' },
  personal: { label: 'ส่วนตัว', dot: '#ec4899' },
  shopping: { label: 'ช้อปปิ้ง', dot: '#f59e0b' },
  health: { label: 'สุขภาพ', dot: '#10b981' },
}
