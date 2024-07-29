import { z } from 'zod'
import { colorThemeUser, colorThemeWithInvert } from '../utils/colors.js'

export const PostStatusSchema = z.enum(['draft', 'scheduled', 'published', 'hidden', 'protected', 'deleted', 'archived', 'trashed', 'spam'])
export const ProgressStatusSchema = z.enum(['pending', 'requested', 'processing', 'ready', 'error', 'cancelled'])
export const SyndicateStatusSchema = z.enum(['active', 'unsubscribed', 'pending', 'cancelled', 'bounced', 'complained'])
export const ColorThemeSchema = z.enum(colorThemeWithInvert)
export const ImageFiltersSchema = z.enum(['brightness', 'opacity', 'contrast', 'blur', 'grayscale', 'sepia', 'saturate', 'invert', 'hue-rotate'])
export type ImageFilter = z.infer<typeof ImageFiltersSchema>
export const SizeBasicSchema = z.enum(['none', 'full', 'xs', 'sm', 'md', 'lg', 'xl'])
export const SizeSchema = z.enum(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
export type StandardSize = z.infer<typeof SizeSchema>
export const UiOriginSchema = z.enum(['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomCenter', 'bottomRight'])
export const FontWeightsSchema = z.enum(['400', '500', '600', '700', '800'])
export const BackgroundRepeatSchema = z.enum(['repeat', 'no-repeat', 'repeat-x', 'repeat-y'])
export const BackgroundPositionSchema = z.enum(['center', 'top', 'bottom', 'left', 'right'])
export const BackgroundSizeSchema = z.enum(['cover', 'contain', 'auto'])
export const BlendModesSchema = z.enum(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'])
export const HeaderLayoutSchema = z.enum(['left', 'right', 'center', 'justify'])
export const ButtonColorThemeSchema = z.enum(colorThemeUser)
export const ButtonFormatSchema = z.enum(['block', 'spread', 'default'])
export const ButtonDesignSchema = z.enum(['solid', 'ghost', 'outline', 'textOnly'])
export const ButtonRoundingSchema = z.enum(['none', 'md', 'full'])
export const ButtonHoverSchema = z.enum(['none', 'basic', 'rise', 'fade', 'slide', 'pop'])
export const ButtonShadowSchema = z.enum(['none', 'sm', 'md', 'lg'])
export const ButtonFontWeightSchema = z.enum(['normal', 'medium', 'semibold', 'bold'])
export const ButtonBorderSchema = z.enum(['none', 'normal', 'thick'])

// Inferred types
export type ButtonFormat = z.infer<typeof ButtonFormatSchema>
export type ButtonDesign = z.infer<typeof ButtonDesignSchema>
export type ButtonRounding = z.infer<typeof ButtonRoundingSchema>
export type ButtonHover = z.infer<typeof ButtonHoverSchema>
export type ButtonShadow = z.infer<typeof ButtonShadowSchema>
export type ButtonFontWeight = z.infer<typeof ButtonFontWeightSchema>
export type ButtonBorder = z.infer<typeof ButtonBorderSchema>

// So it works in node
const MouseEventType = typeof MouseEvent !== 'undefined' ? MouseEvent : class {}

const ClickHandlerSchema = z.function()
  .args(
    z.object({
      event: z.instanceof(MouseEventType).optional(),
      item: z.record(z.any()).optional(),
      props: z.record(z.string(), z.any()).optional(),
    }),
  )
  .returns(z.any())

export const ActionButtonSchema = z.object({
  name: z.string(),
  href: z.string(),
  size: SizeSchema.optional(),
  theme: ButtonColorThemeSchema.optional(),
  design: ButtonDesignSchema.optional(),
  format: ButtonFormatSchema.optional(),
  icon: z.string().optional(),
  iconAfter: z.string().optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  onClick: ClickHandlerSchema.optional(),
})

export type ActionButton = z.infer<typeof ActionButtonSchema>

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

// MediaBasic schema
export const MediaBasicSchema = z.object({
  html: z.string().optional(),
  url: z.string().optional(),
  format: z.enum(['url', 'video', 'iframe', 'html']).optional(),
})

// MediaContent schema (includes MediaBasic)
export const MediaContentSchema = MediaBasicSchema.extend({
  alt: z.string().optional(),
  caption: z.string().optional(),
  mime: z.string().optional(),
  blurhash: z.string().optional(),
  thumbUrl: z.string().optional(),
})

// MediaDisplaySchema (extends MediaContent with display properties)
export const MediaDisplaySchema = MediaContentSchema.extend({
  bgColor: z.string().optional(),
  bgGradient: GradientSettingSchema.optional(),
  bgRepeat: BackgroundRepeatSchema.optional(),
  bgPosition: BackgroundPositionSchema.optional(),
  bgSize: BackgroundSizeSchema.optional(),
  filters: z.array(ImageFilterConfigSchema).optional(),
  overlay: OverlaySettingSchema.optional(),
  width: z.number().optional(),
  height: z.number().optional(),
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
  title: z.string().optional(),
  websiteUrl: z.string().optional(),
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
