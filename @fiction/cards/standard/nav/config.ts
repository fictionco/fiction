import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { brandSchema, NavListItemSchema } from '@fiction/core'
import { z } from 'zod/v4'

const NavBrandSchema = brandSchema.pick({
  logo: true,
})

export const schema = z.object({
  brand: NavBrandSchema.optional(),
  nav: z.object({
    primary: z.array(NavListItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
  }
}
