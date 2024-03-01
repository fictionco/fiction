import type { DataPointChart } from '@factor/api/plugin-dashboards'

export type ActiveUserResponse = {
  views: string
  uniqueVisitors: string
  goal: string[]
  conversion: string[]
  value: number
} & DataPointChart
