import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { InputOption } from '@fiction/ui'
import { logoSchema, NavListItemSchema } from '@fiction/core'
import { z } from 'zod/v4'

export const schema = z.object({
  logo: logoSchema.optional(),
  layout: z.enum(['navCenter', 'logoCenter', 'justified']).optional(),
  nav: z.object({
    primary: z.array(NavListItemSchema).optional(),
  }).optional(),
  hideSubscribe: z.boolean().optional(),
  hideLogin: z.boolean().optional(),
  redirectAfterLogin: z.string().optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

function getOptions(): InputOption[] {
  return []
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
    options: getOptions(),
  }
}
