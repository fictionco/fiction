import type { ActionButton, SuperTitle } from '../schemas/schemas.js'
import type { vue } from './libraries.js'

export interface StepActions {
  changeStep: (args: { dir?: 'prev' | 'next', step?: string, index?: number, needsValidation?: boolean }) => Promise<void>
}

export interface StepItem {
  testId?: string
  key: string
  el?: vue.Component
  superTitle?: SuperTitle
  title: string
  subTitle?: string
  placeholder?: string
  class?: string
  isLoading?: boolean
  isJumped?: boolean
  noButton?: boolean
  onClick?: (args: StepActions) => Promise<void>
  button?: ActionButton
  allowSkip?: boolean
  skipButton?: ActionButton
}

export interface StepConfig {
  onComplete: () => Promise<void>
  steps: vue.ComputedRef<StepItem[]>
  form: vue.Ref<Record<string, unknown>>
}
