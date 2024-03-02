import type { ListItem, ProgressStatus } from '@factor/api'

export type OnboardItem = ListItem & {
  stepId: string
  completed?: boolean
  onClick?: () => void | Promise<void>
  priority?: number
  value?: string | number | boolean | undefined
  allowSkip?: boolean
  status?: ProgressStatus
}

export interface OnboardStoredSettings {
  hidePanel?: boolean
  [key: string]: unknown
}
