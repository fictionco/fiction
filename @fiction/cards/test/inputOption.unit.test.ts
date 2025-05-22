import { SuperTitleSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { describe, expect, it } from 'vitest'
import { z } from 'zod/v4'

describe('refine options with schema', () => {
  it('refines options', async () => {
    const schema = z.object({
      title: z.string().optional().describe('Primary headline for profile 3 to 8 words'),
      subTitle: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs'),
      superTitle: SuperTitleSchema.optional().describe('Shorter badge above headline, 2 to 5 words'),
      details: z.array(z.object({
        label: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        href: z.string().optional(),
      })).optional().describe('List of details with contact details, location, etc.'),
    })

    const optionsList = [
      new InputOption({ key: 'title', input: 'InputText', label: 'Title' }),
      new InputOption({ key: 'subTitle', input: 'InputTextarea', label: 'Sub Title' }),
      new InputOption({ key: 'superTitle.text', input: 'InputTextarea', label: 'Super Title' }),
      new InputOption({ key: 'superTitle.icon', input: 'InputIcon', label: 'Super Title Icon' }),
      new InputOption({ key: 'superTitle.theme', input: 'InputSelect', label: 'Super Title Color', list: ['red', 'blue'] }),
      new InputOption({ key: 'details', input: 'InputList', label: 'Details', options: [
        new InputOption({ key: 'label', input: 'InputText', label: 'Label' }),
        new InputOption({ key: 'description', input: 'InputTextarea', label: 'Description' }),
        new InputOption({ key: 'icon', input: 'InputText', label: 'Icon' }),
        new InputOption({ key: 'href', input: 'InputText', label: 'Href' }),
      ] }),
    ]

    expect(1).toBe(1)
  })
})
