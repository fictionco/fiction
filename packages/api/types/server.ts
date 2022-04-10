import { logCategory, logLevel } from "./basics"

export type LogHandler = (args: {
  priority: number
  color: string
  category?: keyof typeof logCategory
  level?: keyof typeof logLevel
  data: unknown
  description: string
}) => void | Promise<void>

export interface RestArguments {
  postId?: string
  postType?: string
  limit?: string
  page?: number
  category?: string[]
  tag?: string[]
  search?: string
}

export interface SiteMapConfig {
  paths: string[]
  topic: string
}
