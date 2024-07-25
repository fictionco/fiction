import { z } from 'zod'
import { colorTheme } from '@fiction/core'

// Enums
const colorThemeSchema = z.enum(colorTheme)
const imageFilters = z.enum(['brightness', 'opacity', 'contrast', 'blur', 'grayscale', 'sepia', 'saturate', 'invert', 'hue-rotate'])
const sizeBasic = z.enum(['none', 'full', 'xs', 'sm', 'md', 'lg'])
const fontWeights = z.enum(['400', '500', '600', '700', '800'])
const backgroundRepeat = z.enum(['repeat', 'no-repeat', 'repeat-x', 'repeat-y'])
const backgroundPosition = z.enum(['center', 'top', 'bottom', 'left', 'right'])
const backgroundSize = z.enum(['cover', 'contain', 'auto'])
const blendModes = z.enum(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'])
const headerLayout = z.enum(['left', 'right', 'center', 'justify'])

export type SizeBasic = z.infer<typeof sizeBasic>

const MediaSchema = z.object({
  format: z.enum(['url', 'video', 'iframe', 'html']).optional(),
  url: z.string().optional(),
  html: z.string().optional(),
  alt: z.string().optional(),
})

const FontConfigValSchema = z.object({
  fontKey: z.string().optional(),
  stack: z.enum(['monospace', 'sans', 'serif']),
})

const FontStyleSchema = z.object({
  family: z.string().optional(),
  weight: fontWeights.optional(),
})

const KnownFontKeys = ['mono', 'input', 'title', 'sans', 'body', 'serif', 'highlight'] as const

const BaseFontsSchema = z.object(
  Object.fromEntries(KnownFontKeys.map(key => [key, FontConfigValSchema.optional()])),
)

// .catchall(). This method allows the schema to accept any additional properties of the specified type.
const FontsSchema = BaseFontsSchema.catchall(FontConfigValSchema)

// Reusable schemas
const GradientItem = z.object({
  color: z.string().optional(),
  percent: z.number().min(0).max(100).optional(),
})

const GradientSetting = z.object({
  angle: z.number().min(0).max(360).optional(),
  stops: z.array(GradientItem).optional(),
  css: z.string().optional(),
})

const OverlaySetting = z.object({
  gradient: GradientSetting.optional(),
  opacity: z.number().min(0).max(1).optional(),
  blendMode: blendModes.optional(),
  color: z.string().optional(),
})

const ImageFilterConfig = z.object({
  filter: imageFilters.optional(),
  percent: z.number().min(0).max(100).optional(),
  value: z.string().optional(),
})

const BackgroundDisplay = z.object({
  color: z.string().optional(),
  gradient: GradientSetting.optional(),
  repeat: backgroundRepeat.optional(),
  position: backgroundPosition.optional(),
  size: backgroundSize.optional(),
  filters: z.array(ImageFilterConfig).optional(),
  overlay: OverlaySetting.optional(),
  html: z.string().optional(),
  format: z.enum(['url', 'video', 'iframe', 'html']).optional(),
})

const Scheme = z.object({
  bg: z.object({
    color: z.string().optional(),
    gradient: GradientSetting.optional(),
    media: BackgroundDisplay.optional(),
  }).optional(),
  theme: colorThemeSchema.optional(),
  primary: colorThemeSchema.optional(),
})

// Main schema
export const CardStandardSchema = z.object({

  scheme: z.object({
    light: Scheme.optional(),
    base: Scheme.optional(),
    reverse: z.boolean().optional(),
  }).optional(),

  fontStyle: z.object({
    title: FontStyleSchema.optional(),
    body: FontStyleSchema.optional(),
    highlight: FontStyleSchema.optional(),
  }).optional(),

  spacing: z.object({
    contentWidth: sizeBasic.optional(),
    verticalSpacing: sizeBasic.optional(),
  }).optional(),

  headers: z.object({
    layout: headerLayout.optional(),
    size: sizeBasic.optional(),
    superHeader: z.string().optional(),
    superIcon: z.string().optional(),
    superColor: z.string().optional(),
    header: z.string().optional(),
    subHeader: z.string().optional(),
  }).optional(),
})

export const CardOptionsWithStandardSchema = z.object({
  standard: CardStandardSchema.optional(),
})

export type CardStandardOptions = z.infer<typeof CardStandardSchema>

export type CardOptionsWithStandard = z.infer<typeof CardOptionsWithStandardSchema>

export const SiteUserConfigSchema = z.object({
  branding: z.object({
    favicon: MediaSchema.optional(),
    shareImage: MediaSchema.optional(),
    logo: MediaSchema.optional(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    robotsTxt: z.string().optional(),
    locale: z.string().optional(),
    titleTemplate: z.string().optional(),
  }).optional(),
  customCode: z.object({
    gtmContainerId: z.string().optional(),
  }).optional(),
  ai: z.object({
    baseInstruction: z.string().optional(),
    objectives: z.object({
      about: z.string().optional(),
      targetCustomer: z.string().optional(),
      imageStyle: z.string().optional(),
    }).optional(),
  }).optional(),
  styling: z.object({
    isLightMode: z.boolean().optional(),
    fonts: FontsSchema.optional(),
  }).optional(),
  standard: CardStandardSchema.optional(),
})

export type SiteUserConfig = z.infer<typeof SiteUserConfigSchema>
