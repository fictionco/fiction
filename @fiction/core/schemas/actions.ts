import { z } from 'zod/v4'
import { MediaSchema } from './media.js'
import { ButtonColorThemeSchema, ButtonDesignSchema, ButtonFormatSchema, ButtonHoverSchema, ButtonRoundingSchema, ClickHandlerSchema, SizeSchema } from './standard.js'

function createActionButtonSchema({ generate = false }: { generate?: boolean } = {}) {
  return z.object({
    key: z.string().optional(),
    label: z.string().optional().meta({ generate }),
    href: z.string().optional().meta({ generate }),
    size: SizeSchema.optional(),
    theme: ButtonColorThemeSchema.optional(),
    design: ButtonDesignSchema.optional(),
    format: ButtonFormatSchema.optional(),
    rounding: ButtonRoundingSchema.optional(),
    icon: z.union([z.string(), MediaSchema]).optional().meta({ generate }),
    iconAfter: z.union([z.string(), MediaSchema]).optional(),
    loading: z.boolean().optional(),
    disabled: z.boolean().optional(),
    onClick: ClickHandlerSchema.optional(),
    testId: z.string().optional(),
    target: z.enum(['_blank', '_self']).optional().meta({ generate }),
    hover: ButtonHoverSchema.optional(),
    type: z.enum(['button', 'submit', 'reset']).optional(),
    animate: z.boolean().optional(),
  })
}

function createActionAreaSchema({ generate = false }: { generate?: boolean } = {}) {
  return z.object({
    buttons: z.array(createActionButtonSchema({ generate })).optional(),
    size: SizeSchema.optional(),
    theme: ButtonColorThemeSchema.optional(),
    design: ButtonDesignSchema.optional(),
  })
}

// Standard exports
export const ActionButtonSchema = createActionButtonSchema()
export const ActionAreaSchema = createActionAreaSchema()

// AI-enabled exports
export const ActionButtonSchemaWithAi = createActionButtonSchema({ generate: true })
export const ActionAreaSchemaWithAi = createActionAreaSchema({ generate: true })

// Factory functions
export { createActionAreaSchema, createActionButtonSchema }

// Types
export type ActionButton = z.infer<typeof ActionButtonSchema>
export type ActionArea = z.infer<typeof ActionAreaSchema>
