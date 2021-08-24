import { logCategory } from "./basics"

export type DataProcessor<
  T = unknown,
  U extends Record<string, any> = Record<string, any>,
> = {
  name: string
  handler: (data: T, meta?: U) => T | Promise<T>
}

export type LogHandler = (args: {
  priority: number
  color: string
  category: keyof typeof logCategory
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
