import { describe, expect, it, vi } from 'vitest'
import { standardCardTemplates } from '@fiction/cards'
import zodToJsonSchema from 'zod-to-json-schema'
import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import type { CardTemplate } from '../../card'
import { Card } from '../../card'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { type InputOptionGeneration, calculateTotalEstimatedTimeSeconds, generateJsonPropConfig, generateOutputProps, parseDescription, simulateProgress } from '../generation'

describe('generation utils', async () => {
  const testUtils = await createSiteTestUtils()
  const site = new Site({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' })
  const card = new Card({
    site,
    inlineTemplate: standardCardTemplates.find(t => t.settings.templateId === 'hero') as CardTemplate,
    title: 'Test Card',
  })

  const zodSchema = card.tpl.value?.settings.schema
  if (!zodSchema)
    throw new Error('No schema found')

  const jsonSchema = zodToJsonSchema(zodSchema) as JsonSchema7ObjectType

  it('gets default input config', () => {
    const inputConfig = generateJsonPropConfig({ jsonSchema, userPropConfig: {} })

    expect(Object.keys(inputConfig)).toMatchInlineSnapshot(`
      [
        "heading",
        "subHeading",
        "superHeading",
        "superIcon",
        "superColor",
        "layout",
        "splash",
        "actions",
      ]
    `)

    const outputProps = generateOutputProps({ jsonSchema, jsonPropConfig: inputConfig })

    // empty because no isEnabled
    expect(outputProps).toStrictEqual({})

    const inputConfig2 = generateJsonPropConfig({ jsonSchema, userPropConfig: { heading: { isEnabled: true }, layout: { isEnabled: true } } })
    const outputProps2 = generateOutputProps({ jsonSchema, jsonPropConfig: inputConfig2 })

    expect(Object.values(inputConfig2).filter(c => c.isEnabled).length).toBe(2)
    expect(Object.values(outputProps2).filter(c => c.description).length).toBe(2)
  })

  it('parses description correctly', () => {
    const description = 'This is a test; time:40; type:image'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'This is a test',
      meta: { time: 40, type: 'image' },
    })
  })

  it('parses description with empty meta correctly', () => {
    const description = 'Only description'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'Only description',
      meta: {},
    })
  })

  it('generates output props correctly', () => {
    const jsonSchema = {
      properties: {
        heading: { type: 'string', description: 'Primary hero headline, 3 to 13 words' },
        subHeading: { type: 'string', description: 'Secondary hero headline, 10 to 30 words' },
      },
    } as unknown as JsonSchema7ObjectType

    const jsonPropConfig = {
      heading: { isEnabled: true, prompt: 'Custom heading' },
      subHeading: { isEnabled: false, prompt: 'Custom subheading' },
    }

    const result = generateOutputProps({ jsonSchema, jsonPropConfig })

    expect(result).toEqual({
      heading: { type: 'string', description: 'Custom heading' },
    })
  })

  it('handles missing descriptions in generateJsonPropConfig', () => {
    const jsonSchema = {
      properties: {
        heading: { type: 'string' },
      },
    } as unknown as JsonSchema7ObjectType

    const userPropConfig = {
      heading: { isEnabled: true },
    }

    const result = generateJsonPropConfig({ jsonSchema, userPropConfig })

    expect(result).toEqual({
      heading: {
        key: 'heading',
        label: 'Heading',
        prompt: '',
        estimatedMs: 4000,
        cumulativeTime: 4000,
        isEnabled: true,
      },
    })
  })

  it('handles numeric meta correctly in parseDescription', () => {
    const description = 'This is a test; time:40; count:10'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'This is a test',
      meta: { time: 40, count: 10 },
    })
  })

  it('calculates total estimated time correctly', () => {
    const jsonPropConfig = {
      heading: { isEnabled: true, estimatedMs: 5000 },
      subHeading: { isEnabled: true, estimatedMs: 3000 },
      splash: { isEnabled: false, estimatedMs: 10000 },
    }

    const result = calculateTotalEstimatedTimeSeconds({ jsonPropConfig })

    expect(result).toBe(8) // (5000 + 3000) / 1000
  })

  it('returns zero for total estimated time with no enabled fields', () => {
    const jsonPropConfig = {
      heading: { isEnabled: false, estimatedMs: 5000 },
      subHeading: { isEnabled: false, estimatedMs: 3000 },
    }

    const result = calculateTotalEstimatedTimeSeconds({ jsonPropConfig })

    expect(result).toBe(0)
  })

  it('returns correct cumulative time in generateJsonPropConfig', () => {
    const jsonSchema = {
      properties: {
        heading: { type: 'string', description: 'Primary hero headline, 3 to 13 words' },
        subHeading: { type: 'string', description: 'Secondary hero headline, 10 to 30 words' },
      },
    } as unknown as JsonSchema7ObjectType

    const userPropConfig = {
      heading: { isEnabled: true },
      subHeading: { isEnabled: true },
    }

    const result = generateJsonPropConfig({ jsonSchema, userPropConfig })

    expect(result).toEqual({
      heading: {
        key: 'heading',
        label: 'Heading',
        prompt: 'Primary hero headline, 3 to 13 words',
        estimatedMs: 4000,
        cumulativeTime: 4000,
        isEnabled: true,
      },
      subHeading: {
        key: 'subHeading',
        label: 'Sub Heading',
        prompt: 'Secondary hero headline, 10 to 30 words',
        estimatedMs: 4000,
        cumulativeTime: 8000,
        isEnabled: true,
      },
    })
  })
})

describe('simulateProgress', () => {
  it('simulates progress correctly', async () => {
    const jsonPropConfig: Record<string, InputOptionGeneration> = {
      heading: { isEnabled: true, label: 'heading', cumulativeTime: 5000 },
      subHeading: { isEnabled: true, label: 'subHeading', cumulativeTime: 10000 },
    }

    const totalEstimatedTime = 15 // 15 seconds
    const updateProgress = vi.fn()
    vi.useFakeTimers()

    const { complete } = simulateProgress({
      totalEstimatedTime,
      jsonPropConfig,
      updateProgress,
    })

    // Initial call to tick
    expect(updateProgress).toHaveBeenCalledWith({ percent: 3, status: 'Generating heading' })

    // Advance time by 5 seconds (1/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 33, status: 'Generating heading' })

    // Advance time by another 5 seconds (2/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 67, status: 'Generating subHeading' })

    // Advance time by another 5 seconds (3/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 100, status: 'Wrapping up...' })

    complete()
    expect(updateProgress).toHaveBeenCalledWith({ percent: 100, status: 'Complete!' })

    vi.useRealTimers()
  })
})
