import { z } from 'zod/v4'
import { colorThemeUser } from '../utils/colors.js'
import { MediaSchema } from './media.js'
import { FontWeightsSchema } from './standard.js'

export const SuperTitleSchema = z.object({
  text: z.string().optional().meta({ ai: true, description: 'Short text above main title' }),
  icon: MediaSchema.optional().meta({ ai: true, description: 'Visual indicator icon' }),
  theme: z.enum(colorThemeUser).optional().meta({ ai: false, description: 'Color style' }),
  href: z.string().optional().meta({ ai: true, description: 'Link URL' }),
})

export type SuperTitle = z.infer<typeof SuperTitleSchema>

export const fontFamilySchema = z.object({
  family: z.string().optional(),
  stack: z.enum(['monospace', 'sans', 'serif']).optional(),
  variants: z.array(z.string()).optional(),
  source: z.enum(['google', 'system']).optional(),
  weight: FontWeightsSchema.optional(),
})

export type FontFamily = z.infer<typeof fontFamilySchema>

export const fontStyleSchema = z.object({
  family: z.string().optional(),
  weight: FontWeightsSchema.optional(),
})

export const typographySchema = z.object({
  label: z.string().optional().meta({ ai: true }),
  weight: z.string().optional().meta({ ai: false }),
  lineHeight: z.string().optional().meta({ ai: false }),
  letterSpacing: z.string().optional().meta({ ai: false }),
  font: fontFamilySchema.optional().meta({ ai: false }),
})

export type TypographyObject = z.infer<typeof typographySchema>

export const logoSchema = z.object({
  variant: z.enum(['media', 'typography', 'brandLogo', 'brandName']).optional().meta({ ai: false }),
  media: MediaSchema.optional().meta({ ai: true }),
  typography: typographySchema.optional().meta({ ai: false }),
  scale: z.number().optional().meta({ ai: false }),
})

export type LogoObject = z.infer<typeof logoSchema>
