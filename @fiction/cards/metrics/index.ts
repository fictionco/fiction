import { numberFormats, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'metrics'
export const schema = z.object({
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    value: z.number().optional(),
    format: z.enum(numberFormats).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'heading', label: 'Heading', input: 'InputText' }),
  new InputOption({ key: 'subHeading', label: 'Sub Heading', input: 'InputText' }),
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
    new InputOption({ key: 'value', label: 'Value', input: 'InputNumber' }),
    new InputOption({ key: 'format', label: 'Format', input: 'InputSelect', list: numberFormats }),
    new InputOption({ key: 'icon', label: 'Icon', input: 'InputIcon' }),
    new InputOption({ key: 'color', label: 'Color', input: 'InputColor' }),
  ] }),
]

export const templates = [
  new CardTemplate({
    templateId,
    category: ['stats'],
    description: 'display stats/metrics',
    icon: 'i-tabler-number',
    colorTheme: 'sky',
    isPublic: false,
    schema,
    el: vue.defineAsyncComponent(async () => import('./ElMetrics.vue')),
    options,
  }),
] as const
