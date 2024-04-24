// @unocss-include

import type { ColorScheme } from '@fiction/core'
import { colorList, safeDirname, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'

const schemes = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'] as const

export type UserConfig = {
  flipColorMode?: boolean
  lightMode?: {
    bgColor?: string
    scheme?: ColorScheme
  }
  darkMode?: {
    bgColor?: string
    scheme?: ColorScheme
  }
}

const UserConfigSchema = z.object({
  flipColorMode: z.boolean().optional(),
  lightMode: z.object({
    bgColor: z.string().optional(),
    scheme: z.enum(schemes).optional(),
  }).optional(),
})

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
      spacing: {
        spacingClass: '',
      },
    },
    options: [],
  }),
] as const
