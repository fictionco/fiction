import type { Project } from '@factor/api/plugin-admin'
import type { CreateObjectType } from '../utils/db'
import type { analyticsProjectColumns } from './tables'

export interface AggregationResponse {
  count: string | number
  name: string
  total: string | number
  percent: number
  niceName?: string
  icon?: string
  list?: string[]
}

export interface BlockIp {
  ipName?: string
  ipAddress?: string
}

export type ProjectWithAnalytics = Project &
  CreateObjectType<typeof analyticsProjectColumns>
