import { z } from 'zod/v4'
import { colorThemeUser, colorThemeWithInvert } from '../utils'
import { functionSchema } from './helpers'

export const PostStatusSchema = z.enum(['draft', 'scheduled', 'processing', 'failed', 'published', 'archived', 'deleted', 'active', 'pending'])
export type PostStatus = z.infer<typeof PostStatusSchema>
export const ProgressStatusSchema = z.enum(['pending', 'requested', 'processing', 'ready', 'error', 'cancelled', 'skipped'])
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>
export const SyndicateStatusSchema = z.enum(['active', 'unsubscribed', 'pending', 'bounced', 'spam_complaint', 'blocked', 'deleted'])
export type SyndicateStatus = z.infer<typeof SyndicateStatusSchema>

export const ButtonColorThemeSchema = z.enum(colorThemeUser)
export const ButtonFormatSchema = z.enum(['block', 'spread', 'default'])
export const ButtonDesignSchema = z.enum(['solid', 'ghost', 'outline', 'link'])
export const ButtonRoundingSchema = z.enum(['none', 'md', 'full'])
export const ButtonHoverSchema = z.enum(['none', 'basic', 'rise', 'fade', 'slide', 'pop'])
export const ButtonShadowSchema = z.enum(['none', 'sm', 'md', 'lg'])
export const ButtonFontWeightSchema = z.enum(['normal', 'medium', 'semibold', 'bold'])
export const ButtonBorderSchema = z.enum(['none', 'normal', 'thick'])

export type ButtonFormat = z.infer<typeof ButtonFormatSchema>
export type ButtonDesign = z.infer<typeof ButtonDesignSchema>
export type ButtonRounding = z.infer<typeof ButtonRoundingSchema>
export type ButtonHover = z.infer<typeof ButtonHoverSchema>
export type ButtonShadow = z.infer<typeof ButtonShadowSchema>
export type ButtonFontWeight = z.infer<typeof ButtonFontWeightSchema>
export type ButtonBorder = z.infer<typeof ButtonBorderSchema>

export const SizeSchema = z.enum(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
export const SizeSchemaComplete = z.enum(['none', 'full', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
export type StandardSize = z.infer<typeof SizeSchema>
export type StandardSizeComplete = z.infer<typeof SizeSchemaComplete>

export const ColorThemeSchema = z.enum(colorThemeWithInvert)
export const ColorThemeUserSchema = z.enum(colorThemeUser)

export const UiOriginSchema = z.enum(['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomCenter', 'bottomRight'])
export const FontWeightsSchema = z.enum(['400', '500', '600', '700', '800'])
export const HeaderLayoutSchema = z.enum(['left', 'right', 'center', 'justify', 'inline'])
export const AspectRatioSchema = z.enum(['square', 'portrait', 'landscape', 'golden', 'wide', 'tall', 'cinema', 'panorama'])
export const DecorationShapeSchema = z.enum(['none', 'circle', 'square', 'triangle', 'hexagon', 'diamond', 'star', 'star4', 'star8'])

export type DecorationShape = z.infer<typeof DecorationShapeSchema>

const MouseEventType = typeof MouseEvent !== 'undefined' ? MouseEvent : class {}

export const ValidateCallbackSchema = functionSchema(z.function({ input: [z.object({ reportValidity: z.boolean().optional() })], output: z.boolean() }))

export const ClickCallbackContextSchema = z.object({
  validate: ValidateCallbackSchema.optional(),
})

export type ClickCallbackContext = z.infer<typeof ClickCallbackContextSchema>

export const ClickCallbackArgsSchema = z.object({
  event: z.instanceof(MouseEventType).optional(),
  item: z.record(z.string(), z.any()).optional(),
  props: z.record(z.string(), z.any()).optional(),
  context: ClickCallbackContextSchema.optional(),
})

export type ClickCallbackArgs = z.infer<typeof ClickCallbackArgsSchema>

export const ClickHandlerSchema = functionSchema(z.function({
  input: [
    z.object({
      event: z.instanceof(MouseEventType).optional(),
      item: z.record(z.string(), z.any()).optional(),
      props: z.record(z.string(), z.any()).optional(),
      context: ClickCallbackContextSchema.optional(),
    }),
  ],
  output: z.any(),
}))
