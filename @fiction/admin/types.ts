import { z } from 'zod/v4'

export const NavCardUserConfigSchema = z.object({
  isNavItem: z.boolean().optional(),
  navIcon: z.string().optional(),
  navIconAlt: z.string().optional(),
  parentItemId: z.string().optional(),
  priority: z.number().optional(),
  query: z.record(z.string(), z.string()).optional(),
})

export type NavCardUserConfig = z.infer<typeof NavCardUserConfigSchema>

export type WidgetLocation = 'homeMain' | string
