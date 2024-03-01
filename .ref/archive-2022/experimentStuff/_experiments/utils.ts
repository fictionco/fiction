import { computed } from 'vue'
import { currentRoute } from '@factor/api'
import type { ChangeRecord, Experiment, Variant } from '@kaption/types'
import { activeProject } from '../tools/site'

export const activeExperimentId = computed<string | undefined>(() => {
  const { params, query } = currentRoute()
  const exp = params.experimentId || query.experiment
  return exp as string
})

export const activeVariantId = computed<string | undefined>(
  () => currentRoute().params.variantId as string,
)

export const activeExperiments = computed<Experiment[]>(() => {
  return Object.values(activeProject.value?.experiments ?? {}).filter(
    _ => _,
  ) as Experiment[]
})

export const activeExperiment = computed<Experiment | undefined>(() => {
  if (!activeExperimentId.value)
    return
  return (
    activeProject.value?.experiments?.[activeExperimentId.value] ?? undefined
  )
})

export const activeVariants = computed<Variant[]>(() => {
  const exp = activeExperiment.value
  if (!exp)
    return []
  const variants = Object.values(exp.variants || {})
  const variantWeights = exp.variantWeights || {}

  return variants.map((v) => {
    v.weight = variantWeights[v.variantId] || 0
    return v
  })
})

export const activeVariant = computed<Variant | undefined>(() => {
  const variantId = activeVariantId.value
  if (!variantId)
    return
  return activeExperiment.value?.variants?.[variantId]
})

export const activeChanges = computed<ChangeRecord | undefined>(() => {
  const variant = activeVariant.value
  if (!variant)
    return
  const r = variant.changes ?? {}
  return r
})
