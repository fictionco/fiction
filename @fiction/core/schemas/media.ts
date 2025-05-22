import type { IconName } from '@fiction/ui/lib/systemIcons.js'
import type { vue } from '../utils/libraries.js'
import { z } from 'zod/v4'
import { ColorScaleSchema } from '../utils/colors.js'
import { AspectRatioSchema, ColorThemeSchema } from './standard.js'

export const MediaFormatSchema = z.enum(['image', 'video', 'icon', 'html', 'component', 'iframe'])

export const ImageFiltersSchema = z.enum(['brightness', 'opacity', 'contrast', 'blur', 'grayscale', 'sepia', 'saturate', 'invert', 'hue-rotate'])
export type ImageFilter = z.infer<typeof ImageFiltersSchema>
export const BlendModeSchema = z.enum(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'])
export const BackgroundSizeSchema = z.enum(['cover', 'contain', 'auto'])
export const BackgroundPositionSchema = z.enum(['center', 'top', 'bottom', 'left', 'right'])
export const BackgroundRepeatSchema = z.enum(['repeat', 'no-repeat', 'repeat-x', 'repeat-y'])

export const ImageFilterValueSchema = z.object({
  type: ImageFiltersSchema,
  value: z.number().min(0).max(100),
})

export const GradientPointSchema = z.object({
  color: z.string().optional(),
  theme: ColorThemeSchema.optional(),
  scale: ColorScaleSchema.optional(),
  position: z.number().min(0).max(100).optional(),
  opacity: z.number().min(0).max(1).optional(),
})
export type GradientPoint = z.infer<typeof GradientPointSchema>
export const GradientSettingSchema = z.object({
  angle: z.number().min(0).max(360).optional(),
  stops: z.array(GradientPointSchema).optional(),
  type: z.enum(['linear', 'radial', 'conic']).optional(),
  css: z.string().optional(),
})
export type GradientSetting = z.infer<typeof GradientSettingSchema>

type GenerateType = 'image' | 'video' | 'text'

export function getMediaSchema(args: { generate?: boolean, format?: GenerateType } = {}) {
  const { generate = false, format = 'image' } = args

  const aiImage = () => ({
    generate: !!generate && format === 'image',
    description: 'output a shortcode describing image subject: [@image_url subject="description"]',
  })

  const aiVideo = () => ({
    generate: !!generate && format === 'video',
    description: 'output a shortcode describing short video subject: [@video_url subject="description"]',
  })

  return z.object({
    // Content source
    url: z.string().optional().meta(format === 'video' ? aiVideo() : aiImage()),
    html: z.string().optional(),
    iconId: z.string().optional() as z.ZodOptional<z.ZodType<IconName>>,
    class: z.string().optional(),
    el: z.custom<vue.AsyncComponentLoader | vue.Component>(val => typeof val === 'function' || val instanceof Promise).optional(),

    // Properties
    format: MediaFormatSchema.optional(),
    alt: z.string().optional().meta({ generate, description: 'Alt text for the image' }),
    caption: z.string().optional().meta({ generate, description: 'Caption text for the image' }),

    // Dimensions
    aspect: AspectRatioSchema.optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    displayWidthPercent: z.number().optional(),
    displayHeightPercent: z.number().optional(),

    // Background
    backgroundColor: z.string().optional(),
    backgroundRepeat: BackgroundRepeatSchema.optional(),
    backgroundPosition: BackgroundPositionSchema.optional(),
    backgroundSize: BackgroundSizeSchema.optional(),
    gradient: GradientSettingSchema.optional(),
    blurhash: z.string().optional(),

    // Video
    video: z.object({
      autoplay: z.boolean().optional(),
      loop: z.boolean().optional(),
      muted: z.boolean().optional(),
      controls: z.boolean().optional(),
      playbackRate: z.number().min(0.1).max(16).optional(),
      preload: z.enum(['none', 'metadata', 'auto']).optional(),
      playsinline: z.boolean().optional(),
      freeze: z.object({
        time: z.number().optional(),
        playOnHover: z.boolean().optional(),
      }).optional(),
    }).optional(),

    // Effects
    effects: z.object({
      filters: z.array(ImageFilterValueSchema).optional(),
      overlay: z.object({
        color: z.string().optional(),
        opacity: z.number().min(0).max(100).optional(),
        blendMode: BlendModeSchema.optional(),
        gradient: GradientSettingSchema.optional(),
      }).optional(),
      flip: z.enum(['horizontal', 'vertical']).optional(),
    }).optional(),

    // Meta
    tags: z.array(z.string()).optional(),
    props: z.record(z.string(), z.any()).optional(),
  })
}

// Schemas
export const MediaSchema = getMediaSchema()
export const MediaSchemaAI = getMediaSchema({ generate: true })
export const MediaSchemaVideoAI = getMediaSchema({ generate: true, format: 'video' })

export type MediaObject = z.infer<typeof MediaSchema>

// Helpers
export function media(args: { url: string, alt?: string, format?: 'image' | 'video' }): MediaObject {
  const { url, alt, format = 'image' } = args
  return format === 'video' ? { url, format, video: {} } : { url, format, alt }
}

export function icon(args: { iconId: IconName }): MediaObject {
  return { iconId: args.iconId, format: 'icon' }
}
