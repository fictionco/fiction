import { z } from 'zod'
import { colorThemeWithInvert } from '../utils/colors.js'

export const PostStatusSchema = z.enum(['draft', 'scheduled', 'published', 'hidden', 'protected', 'deleted', 'archived', 'trashed', 'spam'])
export const ProgressStatusSchema = z.enum(['pending', 'requested', 'processing', 'ready', 'error', 'cancelled'])
export const SyndicateStatusSchema = z.enum(['active', 'unsubscribed', 'pending', 'cancelled', 'bounced', 'complained'])
export const ColorThemeSchema = z.enum(colorThemeWithInvert)
export const ImageFiltersSchema = z.enum(['brightness', 'opacity', 'contrast', 'blur', 'grayscale', 'sepia', 'saturate', 'invert', 'hue-rotate'])
export type ImageFilter = z.infer<typeof ImageFiltersSchema>
export const SizeBasicSchema = z.enum(['none', 'full', 'xs', 'sm', 'md', 'lg'])
export const FontWeightsSchema = z.enum(['400', '500', '600', '700', '800'])
export const BackgroundRepeatSchema = z.enum(['repeat', 'no-repeat', 'repeat-x', 'repeat-y'])
export const BackgroundPositionSchema = z.enum(['center', 'top', 'bottom', 'left', 'right'])
export const BackgroundSizeSchema = z.enum(['cover', 'contain', 'auto'])
export const BlendModesSchema = z.enum(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'])
export const HeaderLayoutSchema = z.enum(['left', 'right', 'center', 'justify'])
export const FontConfigValSchema = z.object({
  fontKey: z.string().optional(),
  stack: z.enum(['monospace', 'sans', 'serif']),
})
export const FontStyleSchema = z.object({
  fontKey: z.string().optional(),
  weight: FontWeightsSchema.optional(),
})
export const GradientPointSchema = z.object({
  color: z.string().optional(),
  percent: z.number().min(0).max(100).optional(),
})
export type GradientPoint = z.infer<typeof GradientPointSchema>
export const GradientSettingSchema = z.object({
  angle: z.number().min(0).max(360).optional(),
  stops: z.array(GradientPointSchema).optional(),
  css: z.string().optional(),
})
export type GradientSetting = z.infer<typeof GradientSettingSchema>
export const OverlaySettingSchema = z.object({
  gradient: GradientSettingSchema.optional(),
  opacity: z.number().min(0).max(1).optional(),
  blendMode: BlendModesSchema.optional(),
  color: z.string().optional(),
})
export const ImageFilterConfigSchema = z.object({
  filter: ImageFiltersSchema.optional(),
  percent: z.number().min(0).max(100).optional(),
  value: z.string().optional(),
})
export type ImageFilterConfig = z.infer<typeof ImageFilterConfigSchema>
export const MediaDisplaySchema = z.object({
  html: z.string().optional(),
  url: z.string().optional(),
  format: z.enum(['url', 'video', 'iframe', 'html']).optional(),
  bgColor: z.string().optional(),
  bgGradient: GradientSettingSchema.optional(),
  bgRepeat: BackgroundRepeatSchema.optional(),
  bgPosition: BackgroundPositionSchema.optional(),
  bgSize: BackgroundSizeSchema.optional(),
  filters: z.array(ImageFilterConfigSchema).optional(),
  overlay: OverlaySettingSchema.optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
  blurhash: z.string().optional(),
  alt: z.string().optional(),
  thumbUrl: z.string().optional(),
  mime: z.string().optional(),
})

export type MediaObject = z.infer<typeof MediaDisplaySchema>

export const TaxonomySchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  type: z.enum(['category', 'tag']).optional(),
})

export const UserSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  avatar: MediaDisplaySchema.optional(),
})

export const PostSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  content: z.string().optional(),
  status: PostStatusSchema.optional(),
  media: MediaDisplaySchema.optional(),
  slug: z.string().optional(),
  taxonomy: z.array(TaxonomySchema).optional(),
  tags: z.array(TaxonomySchema).optional(),
  categories: z.array(TaxonomySchema).optional(),
  authors: z.array(UserSchema).optional(),
})

export const PostHandlingSchema = z.object({
  mode: z.enum(['global', 'inline']).optional(),
  limit: z.number().optional(),
  items: z.array(PostSchema).optional(),
})

export type PostObject = z.infer<typeof PostSchema>
