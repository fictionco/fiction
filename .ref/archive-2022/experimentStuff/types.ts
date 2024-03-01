/**
 * Experiments
 */
export interface Experiment {
  experimentId: string
  experimentStatus?: ItemStatus
  experimentName: string
  experimentDescription?: string
  variants?: Record<string, Variant>
  variantWeights?: Record<string, number>
  goals: string[]
  rules: TargetingFilter[]
}

export interface ExperimentDataTag {
  experimentId: string
  experimentName: string
  variantId: string
  variantName: string
}
export interface VariantNew {
  variantId?: string
  experimentId: string
  variantName?: string
  variantDescription?: string
}

export type ChangeRecord = Record<string, FrameChangeElement | null>

export type Variant = VariantNew & {
  variantId: string
  changes?: ChangeRecord
  weight?: number
  results?: number[]
  version?: number
}

export interface FrameChangeElement {
  html: string
  selector: string
  attrs?: { name: string, value: string }[]
  hash: string
  pathname?: string
  status: 'success' | 'error'
  message?: string
  timestamp?: number
}
