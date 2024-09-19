import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import { type ShortcodeMatch, Shortcodes, toLabel } from '@fiction/core'

export type InputOptionGeneration = {
  prompt?: string
  isUserEnabled?: boolean
  hasTag?: boolean
  estimatedMs?: number
  key?: string
  label?: string
  cumulativeTime?: number
}

const shortcodes = new Shortcodes()
type AiShortcodeAttributes = { seconds?: number, label?: string }
// remove shortcode from description
shortcodes.addShortcode<AiShortcodeAttributes>('ai', () => '')

export function parseDescription(text: string): { label?: string, description: string, attributes: AiShortcodeAttributes, hasTag: boolean } {
  const result = shortcodes.parseStringSync(text)

  const description = result.text.trim()

  const aiTagMatch = result.matches.find(match => match.shortcode === 'ai') as ShortcodeMatch<AiShortcodeAttributes>

  const attributes = aiTagMatch?.attributes || {}

  const label = attributes.label

  return { label, description, attributes, hasTag: !!aiTagMatch }
}

type GenerateOutputPropsArgs = {
  jsonSchema?: JsonSchema7ObjectType
  jsonPropConfig: Record<string, InputOptionGeneration>
}

export function generateOutputProps({ jsonSchema, jsonPropConfig }: GenerateOutputPropsArgs): Record<string, JsonSchema7ObjectType['properties']> {
  const props = jsonSchema?.properties || {}
  const entries = Object.entries(props).map(([key, value]) => {
    const userConfig = jsonPropConfig[key]
    if (!userConfig?.isUserEnabled)
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
    const { label, description, attributes, hasTag } = parseDescription(value.description || '')

    if (!hasTag) {
      return [key, undefined]
    }

    const userValue = userPropConfig[key] || {}
    const { seconds = 4 } = attributes || {}
    const estimatedMs = seconds * 1000

    if (userValue.isUserEnabled)
      cumulativeTime += estimatedMs

    return [key, {
      key,
      label: label || toLabel(key),
      prompt: description,
      estimatedMs,
      cumulativeTime,
      hasTag,
      ...userValue,
    }]
  }).filter(entry => entry[1]))
}

export function calculateTotalEstimatedTimeSeconds({ jsonPropConfig }: { jsonPropConfig: Record<string, InputOptionGeneration> }): number {
  const total = Object.values(jsonPropConfig)
    .filter(opt => opt.isUserEnabled)
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
      opt => opt.isUserEnabled && opt.cumulativeTime && (currentInterval * interval) <= opt.cumulativeTime,
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
