import type { ListItem, vue } from '@factor/api'
import type { Project } from '@factor/api/plugin-admin'
import { KaptionDbCol } from '../utils/db'

interface TaskItem {
  text: string
  value: string | number | boolean | undefined
  completed: boolean
}

export type OnboardItem = ListItem & {
  tasks: vue.ComputedRef<TaskItem[]>
  completed?: vue.ComputedRef<boolean>
  icon: string
  link?: string
  priority?: number
}

export interface OnboardStoredSettings {
  hidePanel?: boolean
  [key: string]: unknown
}

export type ProjectWithOnboard = Project & {
  onboard: OnboardStoredSettings
}

export const onboardColumns = [
  new KaptionDbCol({
    key: 'onboard',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OnboardStoredSettings),
    prepare: ({ value }) => JSON.stringify(value),
    isPrivate: true,
  }),
] as const
