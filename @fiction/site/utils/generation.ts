import { toLabel } from '@fiction/core'
import type { JsonSchema7ObjectType } from 'zod-to-json-schema'

export type InputOptionGeneration = {
  prompt?: string
  isEnabled?: boolean
  estimatedMs?: number
  key?: string
  label?: string
  cumulativeTime?: number
}

export function parseDescription(description: string): { description: string, meta: Record<string, any> } {
  const meta: Record<string, any> = {}
  const parts = description.split(';').map(part => part.trim())
  const desc = parts.shift() || ''

  parts.forEach((part) => {
    const [key, value] = part.split(':').map(s => s.trim())
    meta[key] = Number.isNaN(+value) ? value : Number(value)
  })

  return { description: desc, meta }
}

type GenerateOutputPropsArgs = {
  jsonSchema?: JsonSchema7ObjectType
  jsonPropConfig: Record<string, InputOptionGeneration>
}

export function generateOutputProps({ jsonSchema, jsonPropConfig }: GenerateOutputPropsArgs): Record<string, JsonSchema7ObjectType['properties']> {
  const props = jsonSchema?.properties || {}
  const entries = Object.entries(props).map(([key, value]) => {
    const userConfig = jsonPropConfig[key]
    if (!userConfig?.isEnabled)
      return [key, undefined]
    const description = userConfig.prompt || value.description
    return [key, { ...value, description }]
  }).filter(entry => entry[1])

  return Object.fromEntries(entries)
}

type GenerateJsonPropConfigArgs = {
  jsonSchema?: JsonSchema7ObjectType
  userPropConfig: Record<string, InputOptionGeneration | undefined>
}

export function generateJsonPropConfig({ jsonSchema, userPropConfig }: GenerateJsonPropConfigArgs): Record<string, InputOptionGeneration> {
  let cumulativeTime = 0
  const props = jsonSchema?.properties || {}
  return Object.fromEntries(Object.entries(props).map(([key, value]) => {
    const { description, meta } = parseDescription(value.description || '')
    const userValue = userPropConfig[key] || {}
    const estimatedMs = +meta.time || 4000
    if (userValue.isEnabled)
      cumulativeTime += estimatedMs
    return [key, { key, label: toLabel(key), prompt: description, estimatedMs, cumulativeTime, ...userValue }]
  }))
}

export function calculateTotalEstimatedTimeSeconds({ jsonPropConfig }: { jsonPropConfig: Record<string, InputOptionGeneration> }): number {
  const total = Object.values(jsonPropConfig)
    .filter(opt => opt.isEnabled)
    .reduce((acc, opt) => acc + (opt.estimatedMs ?? 3000), 0)
  return Math.round(total / 1000)
}

export type ProgressState = {
  percent: number
  status: string
}

export function simulateProgress({
  totalEstimatedTime,
  jsonPropConfig,
  updateProgress,
}: {
  totalEstimatedTime: number
  jsonPropConfig: Record<string, InputOptionGeneration>
  updateProgress: (state: ProgressState) => void
}): { complete: () => void } {
  let completed = false
  const interval = 500
  const totalIntervals = (totalEstimatedTime * 1000) / interval
  let currentInterval = 0

  const tick = () => {
    if (currentInterval >= totalIntervals || completed) {
      updateProgress({ percent: 100, status: 'Wrapping up...' })
      return
    }

    currentInterval++
    const percent = Math.round((currentInterval / totalIntervals) * 100)
    const currentSetting = Object.values(jsonPropConfig).find(
      opt => opt.isEnabled && opt.cumulativeTime && (currentInterval * interval) <= opt.cumulativeTime,
    )
    updateProgress({ percent, status: `Generating ${currentSetting?.label || ''}` })

    setTimeout(tick, interval)
  }

  tick()

  return {
    complete: () => {
      completed = true
      updateProgress({ percent: 100, status: 'Complete!' })
    },
  }
}
