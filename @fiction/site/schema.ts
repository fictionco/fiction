import {
  ButtonDesignSchema,
  ButtonHoverSchema,
  ButtonRoundingSchema,
  ColorThemeSchema,
  fontFamilySchema,
  HeaderLayoutSchema,
  logoSchema,
  MediaSchema,
  NavListItemSchema,
  NavListSchema,
  SizeSchemaComplete,
  SuperTitleSchema,
} from '@fiction/core'
import { z } from 'zod/v4'

export type SizeBasic = z.infer<typeof SizeSchemaComplete>
export const prefersColorScheme = ['light', 'dark', 'auto', ''] as const

const baseFontsSchema = z.object({
  title: fontFamilySchema.optional(),
  body: fontFamilySchema.optional(),
  sans: fontFamilySchema.optional(),
  serif: fontFamilySchema.optional(),
  mono: fontFamilySchema.optional(),
  input: fontFamilySchema.optional(),
  highlight: fontFamilySchema.optional(),
})
// .catchall(). This method allows the schema to accept any additional properties of the specified type.
const fontsSchema = baseFontsSchema.catchall(fontFamilySchema)

const ButtonTypeSchema = z.object({
  rounding: ButtonRoundingSchema.optional(),
  design: ButtonDesignSchema.optional(),
  hover: ButtonHoverSchema.optional(),
})

// Navigation schema
const NavigationItemSchema = NavListItemSchema.extend({
  cardId: z.string().optional(), // Reference to the card/page ID for ordering
})

const NavigationSchema = z.object({
  primary: z.array(NavigationItemSchema).optional(),
  secondary: z.array(NavigationItemSchema).optional(),
})

export type SiteNav = z.infer<typeof NavigationSchema>

// Main schema
export const CardStandardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fonts: fontsSchema.optional(),
  buttons: ButtonTypeSchema.optional(),
  background: MediaSchema.optional(),
  themeColor: ColorThemeSchema.optional(),
  primaryColor: ColorThemeSchema.optional(),
  widthSize: SizeSchemaComplete.optional(),
  spaceSize: SizeSchemaComplete.optional(),
  hideOnPage: z.boolean().optional(),
  showOnSingle: z.boolean().optional(),
  headers: z.object({
    layout: HeaderLayoutSchema.optional(),
    size: SizeSchemaComplete.optional(),
    superTitle: SuperTitleSchema.optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
  }).optional(),
  ai: z.object({
    prompt: z.string().optional(),
    fields: z.record(z.string(), z.object({
      prompt: z.string().optional(),
      isUserEnabled: z.boolean().optional(),
    })).optional(),
  }).optional(),
})

export const CardOptionsWithStandardSchema = z.object({
  standard: CardStandardSchema.optional(),
})

export type CardStandardOptions = z.infer<typeof CardStandardSchema>
export type CardOptionsWithStandard = z.infer<typeof CardOptionsWithStandardSchema>



const siteGlobalConfigSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  favicon: MediaSchema.optional(),
  icon: MediaSchema.optional(),
  shareImage: MediaSchema.optional(),
  titleTemplate: z.string().optional(),
  robotsTxt: z.string().optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  logo: logoSchema.optional(),
  standard: CardStandardSchema.optional(),

})

export const StandardUserConfigSchema = z.object({
  standard: CardStandardSchema.optional(),
})

export type SiteGlobalUserConfig = z.infer<typeof siteGlobalConfigSchema>
export type StandardUserConfig = z.infer<typeof StandardUserConfigSchema>

export const SiteSchema = z.object({
  siteId: z.string(),
  userId: z.string().optional(),
  orgId: z.string(),
  title: z.string().optional(),
  themeId: z.string().optional(),
  subDomain: z.string().optional(),
  customDomains: z.array(z.any()).optional(),
  status: z.enum(['pending', 'active', 'inactive']).optional().default('pending'),
  userConfig: siteGlobalConfigSchema.optional(),
}).strict()

export const PageSchema = z.object({
  cardId: z.string(),
  siteId: z.string(),
  userId: z.string().optional(),
  orgId: z.string().optional(),
  regionId: z.string().optional(),
  layoutId: z.string().optional(),
  templateId: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  cards: z.array(z.any()).optional(),
  userConfig: StandardUserConfigSchema.optional(),
  isHome: z.boolean().optional(),
  nav: z.enum(['show', 'hide']).optional(),
}).strict()

// Export navigation types
export type NavigationItem = z.infer<typeof NavigationItemSchema>
export type Navigation = z.infer<typeof NavigationSchema>
