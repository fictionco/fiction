import type { vue } from './libraries.js'

export interface StepActions {
  changeStep: (dir: 'prev' | 'next') => Promise<void>
  setStepIndex: (index: number) => void
  setStepKey: (key: string) => void
  setComplete: () => Promise<void>
}

export interface StepItem {
  key: string
  el?: vue.Component
  name: string
  desc: string
  placeholder?: string
  class?: string
  actionText?: string
  isNeeded?: boolean
  isSkipped?: boolean
  isLoading?: boolean
  noAction?: boolean
  onClick?: (args: StepActions) => Promise<void>
}

export interface StepConfig {
  onComplete: () => Promise<void>
  steps: vue.ComputedRef<StepItem[]>
  form: vue.Ref<Record<string, unknown>>
}
