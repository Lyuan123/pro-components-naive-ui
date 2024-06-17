export interface ProDateQuarterRangeSlots {
  'footer': any
  'prev-year': any
  'next-year': any
  'separator': any
  'date-icon': any
  'next-month': any
  'prev-month': any
  // 扩展的
  'empty': { value: any }
  'readonly': { value: any }
}

export const proDateQuarterRangeExtendSlotKeys = [
  'empty',
  'readonly',
] as const
