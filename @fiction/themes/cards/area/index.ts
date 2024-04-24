import { colorList, colorTheme, safeDirname, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const SchemeSchema = z.object({
  bg: z.object({
    color: z.string().optional(),
  }),
  theme: z.enum(colorTheme).optional(),
})

const UserConfigSchema = z.object({
  scheme: z.object({
    reverse: z.boolean().optional(),
    light: SchemeSchema.optional(),
    dark: SchemeSchema.optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const templates = [
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId: 'area',
    category: ['basic'],
    description: 'container for other elements',
    icon: 'i-tabler-box-padding',
    iconTheme: 'blue',
    el: vue.defineAsyncComponent(() => import('./ElArea.vue')),
    isContainer: true, // ui drawer
    userConfig: {
      spacing: { spacingClass: '' },
    },
    isPublic: true,
    options: [
      new InputOption({ key: 'scheme.reverse', label: 'Reverse Color Scheme', input: 'InputCheckbox' }),
      new InputOption({ key: 'scheme.light', label: 'Light Mode', input: 'group', options: [
        new InputOption({ key: 'scheme.light.bg.color', label: 'Light Background Color', input: 'InputColor' }),
        new InputOption({ key: 'scheme.light.theme', label: 'Light Color Theme', input: 'InputSelect', props: { list: colorList } }),
      ] }),
      new InputOption({ key: 'scheme.dark', label: 'Dark Mode', input: 'group', options: [
        new InputOption({ key: 'scheme.dark.bg.color', label: 'Dark Background Color', input: 'InputColor' }),
        new InputOption({ key: 'scheme.dark.theme', label: 'Dark Color Theme', input: 'InputSelect', props: { list: colorList } }),
      ] }),
    ],
    schema: UserConfigSchema,
  }),
] as const
