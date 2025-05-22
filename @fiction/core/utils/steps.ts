import type { ActionButton, SuperTitle } from '../schemas/index.js'
import type { vue } from './libraries.js'

export interface StepActions<T = string> {
  changeStep: (args: { dir?: 'prev' | 'next', step?: T, index?: number, needsValidation?: boolean }) => Promise<void>
}

export interface StepItem<T = string> {
  testId?: string
  key: T
  el?: vue.Component
  superTitle?: SuperTitle
  title: string
  subTitle?: string
  placeholder?: string
  class?: string
  isLoading?: boolean
  isJumped?: boolean
  noNav?: boolean
  noButton?: boolean
  onLoad?: (args: StepActions<T>) => Promise<void>
  onClick?: (args: StepActions<T>) => Promise<void>
  button?: ActionButton
  allowSkip?: boolean
  skipButton?: ActionButton
}

export interface StepConfig<T = string> {
  onComplete: () => Promise<void>
  steps: vue.ComputedRef<StepItem<T>[]>
  form: vue.Ref<Record<string, unknown>>
}
