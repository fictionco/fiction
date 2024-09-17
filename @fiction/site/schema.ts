import { ButtonDesignSchema, ButtonHoverSchema, ButtonRoundingSchema, ColorThemeSchema, colorThemeUser, FontConfigValSchema, FontStyleSchema, HeaderLayoutSchema, MediaDisplaySchema, SizeSchemaComplete, UiOriginSchema } from '@fiction/core'
import { z } from 'zod'

export type SizeBasic = z.infer<typeof SizeSchemaComplete>

const KnownFontKeys = ['mono', 'input', 'title', 'sans', 'body', 'serif', 'highlight'] as const

const BaseFontsSchema = z.object(
  Object.fromEntries(KnownFontKeys.map(key => [key, FontConfigValSchema.optional()])),
)

// .catchall(). This method allows the schema to accept any additional properties of the specified type.
const FontsSchema = BaseFontsSchema.catchall(FontConfigValSchema)

const Scheme = z.object({
  bg: MediaDisplaySchema.optional(),
  theme: ColorThemeSchema.optional(),
  primary: ColorThemeSchema.optional(),
})

// Main schema
export const CardStandardSchema = z.object({

  handling: z.object({
    hideOnPage: z.boolean().optional(),
    showOnSingle: z.boolean().optional(),
  }).optional(),

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
    contentWidth: SizeSchemaComplete.optional(),
    contentPad: SizeSchemaComplete.optional(),
    verticalSpacing: SizeSchemaComplete.optional(),
  }).optional(),

  headers: z.object({
    layout: HeaderLayoutSchema.optional(),
    size: SizeSchemaComplete.optional(),
    superTitle: z.string().optional(),
    superIcon: z.string().optional(),
    superColor: z.enum(colorThemeUser).optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
  }).optional(),

  effect: z.object({
    origin: UiOriginSchema.optional(),
    size: SizeSchemaComplete.optional(),
    rotation: z.number().min(0).max(360).optional(),
  }).optional(),
})

export const CardOptionsWithStandardSchema = z.object({
  standard: CardStandardSchema.optional(),
})

export type CardStandardOptions = z.infer<typeof CardStandardSchema>

export type CardOptionsWithStandard = z.infer<typeof CardOptionsWithStandardSchema>

const ButtonTypeSchema = z.object({
  rounding: ButtonRoundingSchema.optional(),
  design: ButtonDesignSchema.optional(),
  hover: ButtonHoverSchema.optional(),
})

export const SiteUserConfigSchema = z.object({
  branding: z.object({
    favicon: MediaDisplaySchema.optional(),
    icon: MediaDisplaySchema.optional(),
    shareImage: MediaDisplaySchema.optional(),
    logo: MediaDisplaySchema.optional(),
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
    buttons: ButtonTypeSchema.optional(),

  }).optional(),
  standard: CardStandardSchema.optional(),
})

export type SiteUserConfig = z.infer<typeof SiteUserConfigSchema>
