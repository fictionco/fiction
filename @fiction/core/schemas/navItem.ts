import { z } from 'zod/v4'
import { colorThemeUser } from '../utils/colors.js'
import { ActionAreaSchema } from './actions.js'
import { MediaSchema } from './media.js'
import { ButtonDesignSchema, ClickHandlerSchema } from './standard.js'

const emphasisSchema = z.enum(['default', 'highlighted', 'muted'])

type SchemaOptions = {
  generate?: boolean
}

function createNavListItemSchema({ generate = false }: SchemaOptions = {}) {
  const NavListItem = z.object({
    // Core content
    key: z.string().optional(),
    id: z.string().optional(),
    label: z.string().optional().meta({ generate, description: 'Primary text displayed for the item (e.g., "Products")' }),
    srLabel: z.string().optional().meta({ generate, description: 'Screen reader label for accessibility' }),
    subLabel: z.string().optional().meta({ description: 'Secondary text shown below label for additional context' }),
    value: z.union([z.string(), z.number()]).optional().meta({ description: 'Value associated with the item' }),
    description: z.string().optional().meta({ description: 'Longer description or explanation of the item' }),
    info: z.string().optional(),
    count: z.number().optional(),
    className: z.string().optional(),

    // Visual
    media: MediaSchema.optional().meta({ description: 'Media content shown with the item' }),
    icon: MediaSchema.optional().meta({ description: 'Leading icon shown before the label' }),
    iconAfter: MediaSchema.optional(),
    badge: z.object({
      content: z.union([z.string(), z.number()]).optional().meta({ description: 'Badge text or number' }),
      color: z.enum(colorThemeUser).optional(),
    }).optional(),

    // Navigation behavior
    href: z.string().optional().meta({ description: 'Navigation URL - internal path or external link' }),
    target: z.enum(['_self', '_blank']).optional().meta({ description: 'Link target - "_blank" opens in new tab' }),
    onClick: ClickHandlerSchema.optional(),

    // Visual & behavioral variants
    variant: z.enum(['default', 'button', 'avatar']).optional(),
    emphasis: emphasisSchema.optional(),
    theme: z.enum(colorThemeUser).optional().meta({ description: 'Color theme for the item' }),
    design: ButtonDesignSchema.optional(),

    action: ActionAreaSchema.optional().meta({ description: 'Interactive buttons or subscribe form' }),
    dateAt: z.string().optional(),

    // State management
    onAuthState: z.enum(['loggedIn', 'loggedOut', 'all']).optional(),
    isActive: z.boolean().optional(),
    isDisabled: z.boolean().optional(),
    isHidden: z.boolean().optional(),

    // Organization & editing
    basePath: z.string().optional(),
    priority: z.number().optional(),
    testId: z.string().optional(),

    // Recursive navigation support
    get list() {
      return createNavListSchema({ generate }).optional().meta({ description: 'Nested navigation list (e.g., dropdown menu)' })
    },
  })

  return NavListItem
}

function createNavListSchema({ generate = false }: SchemaOptions = {}) {
  return z.object({
    title: z.string().optional().meta({ generate, description: 'Optional section/group title' }),
    description: z.string().optional().meta({ generate, description: 'Optional section/group description' }),
    items: z.array(createNavListItemSchema({ generate })).optional().meta({ description: 'Navigation items in this section' }),
    variant: z.enum(['default', 'expanded']).optional(),
  })
}

// Standard exports
export const NavListItemSchema = createNavListItemSchema()
export const NavListSchema = createNavListSchema()

// AI-enabled exports
export const NavListItemSchemaWithAi = createNavListItemSchema({ generate: true })
export const NavListSchemaWithAi = createNavListSchema({ generate: true })

// Factory functions
export { createNavListItemSchema, createNavListSchema }

// Types
export type NavListItem = z.infer<typeof NavListItemSchema>
export type NavList = z.infer<typeof NavListSchema>

// Re-export related enums
export { emphasisSchema }
