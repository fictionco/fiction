import type { Variant } from '@kaption/types'

export type QueryFormat = 'variantResults' | 'variantTable'

export interface GoalResultRow {
  date: string
  uniqueVisitors: number
  totalSessions: number

  variants: (Variant & {
    session: string | number
    conversion: string | number
    rate: string | number
  })[]
}

export interface VariantSet {
  variant: Variant
  users: string | number
  conversion: string | number
  rate: string | number
}

export interface GoalResult {
  date: string
  uniqueVisitors: number
  totalSessions: number
  variantSet: VariantSet[]
}

export interface RawGoalResult {
  date: string
  uniqueVisitors: number
  totalSessions: number
  [key: string]: string | number
}
