import { z } from 'zod'
import { ColorThemeSchema, FontConfigValSchema, FontStyleSchema, HeaderLayoutSchema, MediaDisplaySchema, SizeBasicSchema } from '@fiction/core'

export type SizeBasic = z.infer<typeof SizeBasicSchema>

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
    contentWidth: SizeBasicSchema.optional(),
    contentPad: SizeBasicSchema.optional(),
    verticalSpacing: SizeBasicSchema.optional(),
  }).optional(),

  headers: z.object({
    layout: HeaderLayoutSchema.optional(),
    size: SizeBasicSchema.optional(),
    superTitle: z.string().optional(),
    superIcon: z.string().optional(),
    superColor: z.string().optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
  }).optional(),
})

export const CardOptionsWithStandardSchema = z.object({
  standard: CardStandardSchema.optional(),
})

export type CardStandardOptions = z.infer<typeof CardStandardSchema>

export type CardOptionsWithStandard = z.infer<typeof CardOptionsWithStandardSchema>

export const SiteUserConfigSchema = z.object({
  branding: z.object({
    favicon: MediaDisplaySchema.optional(),
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
  }).optional(),
  standard: CardStandardSchema.optional(),
})

export type SiteUserConfig = z.infer<typeof SiteUserConfigSchema>
