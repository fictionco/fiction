import { BlendModesSchema, UiOriginSchema, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'effectShape'

const ShapeSchema = z.object({
  shape: z.enum(['square', 'circle', 'triangle', 'hexagon', 'star', 'heart', 'pentagon', 'diamond', 'cross', 'octagon']).optional(),
  opacity: z.number().min(0).max(100).optional(),
  color: z.string().optional(),
  rotation: z.string().optional(),
  scale: z.number().positive().optional(),
  position: z.object({
    origin: UiOriginSchema.optional(),
    offsetX: z.number().default(0).optional(),
    offsetY: z.number().default(0).optional(),
  }),
  blendMode: BlendModesSchema.optional(),
})

export type Shape = z.infer<typeof ShapeSchema>

const UserConfigSchema = z.object({
  shapes: z.array(ShapeSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getUserConfig(): Promise<UserConfig> {
  return { }
}

const options: InputOption[] = [
  new InputOption({
    input: 'InputList',
    key: `shapes`,
    options: [
    ],
  }),
]

export const templates = [
  new CardTemplate({
    templateId,
    category: ['effect'],
    description: 'Shape background effect',
    icon: 'i-tabler-message-bolt',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElEffect.vue')),
    isPublic: false,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ }),
    getUserConfig: () => getUserConfig(),
    demoPage: async () => {
      const userConfig = await getUserConfig()
      return { cards: [{ templateId, userConfig }] }
    },
  }),
] as const
