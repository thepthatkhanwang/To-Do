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
