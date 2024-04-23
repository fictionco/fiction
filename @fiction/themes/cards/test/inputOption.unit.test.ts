import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { refineOptions } from '@fiction/site/utils/schema'
import { standardOption } from '../inputSets'

describe('refine options with schema', () => {
  it('refines options', () => {
    const schema = z.object({
      heading: z.string().optional().describe('Primary headline for profile 3 to 8 words'),
      subHeading: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs'),
      superHeading: z.string().optional().describe('Shorter badge above headline, 2 to 5 words'),
      details: z.array(z.object({
        name: z.string().optional(),
        desc: z.string().optional(),
        icon: z.string().optional(),
        href: z.string().optional(),
      })).optional().describe('List of details with contact details, location, etc.'),
    })

    const { options, unusedSchema } = refineOptions({ options: [
      standardOption.headers(),
      standardOption.navItems({ label: 'Details', key: 'details' }),
    ], schema })

    expect(unusedSchema).toMatchInlineSnapshot(`{}`)

    const option = options[0]

    expect(option.options.value.map(k => k.key.value)).toEqual(['heading', 'subHeading', 'superHeading'])

    expect(option.options.value.length, 'nav items should be title and inputList').toBe(3)
    expect(option.options.value[0].key.value).toBe('heading')
    expect(option.options.value[1].key.value).toBe('subHeading')

    const option2 = options[1]

    expect(option2.options.value.map(_ => _.key.value)).toMatchInlineSnapshot(`
      [
        "detailsTitle",
        "details",
      ]
    `)

    const detailsOptions = option2.options.value[1].options.value

    expect(detailsOptions.length).toBe(5)
  })
})

describe('navItemOptionSet Schema Generation', () => {
  afterEach(() => {

  })
  it('initializes correctly and returns all input options', () => {
    const option = standardOption.navItems({ key: 'nav', refine: {} })

    expect(option.options.value.length).toBe(2)
    expect(option.options.value[0].key.value).toBe('navTitle')
    expect(option.options.value[1].key.value).toBe('nav')
  })
})

describe('headerOptionSet', () => {
  it('initializes correctly and returns all input options', () => {
    const option = standardOption.headers()
    const subOptions = option.options.value || []
    expect(option.options.value.length).toBe(3)
    expect(subOptions[0].key.value).toBe('heading')
    expect(subOptions[1].key.value).toBe('subHeading')
    expect(subOptions[2].key.value).toBe('superHeading')
  })
})
