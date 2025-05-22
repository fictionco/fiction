import type { IconName } from '@fiction/ui/lib/systemIcons.js'
import type { vue } from '../utils/libraries.js'
import { z } from 'zod/v4'
import { ColorScaleSchema, colorThemeUser, colorThemeWithInvert } from '../utils/colors.js'
import { MediaSchema } from './media.js'

export * from './media.js'

export const PostStatusSchema = z.enum([
  'draft', // Initial state
  'scheduled', // Ready for future publication
  'processing', // Currently being worked on
  'failed', // Error during processing
  'published', // Live content
  'archived', // No longer active
  'deleted', // Soft deleted
  'active', // Alt to published
  'pending', // Awaiting approval
])

export function functionSchema<T extends z.core.$ZodFunction>(schema: T) {
  return z.custom<Parameters<T['implement']>[0]>(fn => schema.implement(fn))
}

export function createAsyncFunctionSchema<T extends z.core.$ZodFunction>(schema: T) {
  return z.custom<Parameters<T['implementAsync']>[0]>(fn => schema.implementAsync(fn))
}

export const ProgressStatusSchema = z.enum(['pending', 'requested', 'processing', 'ready', 'error', 'cancelled', 'skipped'])
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>
export const SyndicateStatusSchema = z.enum(['active', 'unsubscribed', 'pending', 'complained', 'deleted', 'cleaned'])
export const ColorThemeSchema = z.enum(colorThemeWithInvert)
export const ColorThemeUserSchema = z.enum(colorThemeUser)
export const ImageFiltersSchema = z.enum(['brightness', 'opacity', 'contrast', 'blur', 'grayscale', 'sepia', 'saturate', 'invert', 'hue-rotate'])
export type ImageFilter = z.infer<typeof ImageFiltersSchema>

export const SizeSchema = z.enum(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
export const SizeSchemaComplete = z.enum(['none', 'full', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
export type StandardSize = z.infer<typeof SizeSchema>
export type StandardSizeComplete = z.infer<typeof SizeSchemaComplete>
export const UiOriginSchema = z.enum(['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomCenter', 'bottomRight'])
export const FontWeightsSchema = z.enum(['400', '500', '600', '700', '800'])
export const BackgroundRepeatSchema = z.enum(['repeat', 'no-repeat', 'repeat-x', 'repeat-y'])
export const BackgroundPositionSchema = z.enum(['center', 'top', 'bottom', 'left', 'right'])
export const BackgroundSizeSchema = z.enum(['cover', 'contain', 'auto'])
export const BlendModesSchema = z.enum(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'])
export const HeaderLayoutSchema = z.enum(['left', 'right', 'center', 'justify', 'inline'])
export const ButtonColorThemeSchema = z.enum(colorThemeUser)
export const ButtonFormatSchema = z.enum(['block', 'spread', 'default'])
export const ButtonDesignSchema = z.enum(['solid', 'ghost', 'outline', 'link'])
export const ButtonRoundingSchema = z.enum(['none', 'md', 'full'])
export const ButtonHoverSchema = z.enum(['none', 'basic', 'rise', 'fade', 'slide', 'pop'])
export const ButtonShadowSchema = z.enum(['none', 'sm', 'md', 'lg'])
export const ButtonFontWeightSchema = z.enum(['normal', 'medium', 'semibold', 'bold'])
export const ButtonBorderSchema = z.enum(['none', 'normal', 'thick'])
export const AspectRatioSchema = z.enum(['square', 'portrait', 'landscape', 'golden', 'wide', 'tall', 'cinema', 'panorama'])
export const DecorationShapeSchema = z.enum(['none', 'circle', 'square', 'triangle', 'hexagon', 'diamond', 'star', 'star4', 'star8'])

export type DecorationShape = z.infer<typeof DecorationShapeSchema>

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

export const ValidateCallbackSchema = functionSchema(z.function({ input: z.object({ reportValidity: z.boolean().optional() }), output: z.boolean() }))

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

const ClickHandlerSchema = z.function({
  input: z.object({
    event: z.instanceof(MouseEventType).optional(),
    item: z.record(z.string(), z.any()).optional(),
    props: z.record(z.string(), z.any()).optional(),
    context: ClickCallbackContextSchema.optional(),
  }),
  output: z.any(),
})

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

// // For specifying a color point in the gradient with maximum flexibility
// export const GradientPointSchema = z.object({
//   // For direct hex/rgba colors
//   color: z.string().optional(),

//   // For using theme colors (e.g. 'blue', 'emerald')
//   theme: ColorThemeSchema.optional(),

//   // For theme color intensity (e.g. 500, 600)
//   scale: ColorScaleSchema.optional(),

//   // Position in gradient (0-100)
//   position: z.number().min(0).max(100).optional(),

//   // Opacity as 0-1 float
//   opacity: z.number().min(0).max(1).optional(),
// })

// export type GradientPoint = z.infer<typeof GradientPointSchema>

// // Main gradient definition
// export const GradientSettingSchema = z.object({
//   // Angle in degrees
//   angle: z.number().min(0).max(360).optional(),

//   // Array of color stops
//   stops: z.array(GradientPointSchema).optional(),

//   // Type of gradient
//   type: z.enum(['linear', 'radial', 'conic']).optional(),

//   // Pre-computed CSS (for caching/performance)
//   css: z.string().optional(),
// })

// export type GradientSetting = z.infer<typeof GradientSettingSchema>

// // For overlay effects
// export const OverlaySettingSchema = z.object({
//   // Full gradient definition
//   gradient: GradientSettingSchema.optional(),

//   // Overall opacity
//   opacity: z.number().min(0).max(100).optional(),

//   // CSS blend mode
//   blendMode: BlendModesSchema.optional(),

//   // Solid color fallback
//   color: z.string().optional(),
// })
// export const ImageFilterConfigSchema = z.object({
//   filter: ImageFiltersSchema.optional(),
//   percent: z.number().min(0).max(100).optional(),
//   value: z.string().optional(),
// })
// export type ImageFilterConfig = z.infer<typeof ImageFilterConfigSchema>

// export const MediaFormat = z.enum(['url', 'image', 'video', 'iframe', 'html', 'component', 'iconId', 'iconClass', 'typography'])
// // MediaBasic schema
// export const MediaBasicSchema = z.object({
//   html: z.string().optional().meta({ ai: false, description: 'Raw HTML content' }),
//   url: z.string().optional().meta({ ai: true, description: 'Return a shortcode for URL example: [@image_url subject="a boulder rolling down a hill" orientation="squarish"] that will be replaced with the actual url.' }),
//   format: MediaFormat.optional().meta({ ai: false, description: 'Media format type, e.g. image, video' }),
//   alt: z.string().optional().meta({ ai: true, description: 'Image alt text' }),
//   el: z.custom<vue.AsyncComponentLoader | vue.Component>(val => typeof val === 'function' || val instanceof Promise, { message: 'Must be an async component or Promise' }).optional().meta({ ai: false, description: 'Vue component or async loader' }),
//   props: z.record(z.string(), z.any()).optional().meta({ ai: false, description: 'Component props' }),
//   aspect: AspectRatioSchema.optional().meta({ ai: false, description: 'Aspect ratio setting' }),
// })

// export const MediaIconSchema = MediaBasicSchema.extend({
//   iconId: z.string().optional().meta({ ai: true, description: 'iconId is common icon name (e.g. user, check, lock)' }) as z.ZodOptional<z.ZodType<IconName>>,
//   class: z.string().optional().meta({ ai: true, description: 'tabler iconify class i-tabler-[icon-name]' }),
// })

// // MediaContent schema (includes MediaBasic)
// export const MediaContentSchema = MediaIconSchema.extend({
//   caption: z.string().optional().meta({ ai: true }),
//   mime: z.string().optional().meta({ ai: false }),
//   blurhash: z.string().optional().meta({ ai: false }),
//   thumbUrl: z.string().optional().meta({ ai: false }),
// })

// export const VideoControlsSchema = z.object({
//   playbackRate: z.number().min(0.1).max(16).optional().meta({ ai: false }),
//   autoplay: z.boolean().optional().meta({ ai: false }),
//   loop: z.boolean().optional().meta({ ai: false }),
//   muted: z.boolean().optional().meta({ ai: false }),
//   controls: z.boolean().optional().meta({ ai: false }),
//   preload: z.enum(['none', 'metadata', 'auto']).optional().meta({ ai: false }),
//   poster: z.string().optional().meta({ ai: false }),
//   playsinline: z.boolean().optional().meta({ ai: false }),
//   freeze: z.object({
//     time: z.number().optional().meta({ ai: false, description: 'Time in seconds to freeze video' }),
//     playOnHover: z.boolean().optional().meta({ ai: false, description: 'Play on hover, freeze on blur' }),
//   }).optional().meta({ ai: false, description: 'Video freeze settings' }),
// }).meta({ description: 'Video playback controls' })

// // MediaDisplaySchema (extends MediaContent with display properties)
// export const MediaDisplaySchema = MediaContentSchema.extend({
//   backgroundColor: z.string().optional().meta({ ai: false }),
//   backgroundRepeat: BackgroundRepeatSchema.optional().meta({ ai: false }),
//   backgroundPosition: BackgroundPositionSchema.optional().meta({ ai: false }),
//   backgroundSize: BackgroundSizeSchema.optional().meta({ ai: false }),
//   gradient: GradientSettingSchema.optional().meta({ ai: false }),
//   filters: z.array(ImageFilterConfigSchema).optional().meta({ ai: false }),
//   overlay: OverlaySettingSchema.optional().meta({ ai: false }),
//   width: z.number().optional().meta({ ai: false }),
//   height: z.number().optional().meta({ ai: false }),
//   tags: z.array(z.string()).optional().meta({ ai: false }),
//   displayWidthPercent: z.number().optional().meta({ ai: false }),
//   displayHeightPercent: z.number().optional().meta({ ai: false }),
//   videoControls: VideoControlsSchema.optional().meta({ ai: false }),
//   modify: z.object({
//     flip: z.enum(['horizontal', 'vertical']).optional().meta({ ai: false }),
//   }).optional().meta({ ai: false }),
// })

// export type MediaObject = z.infer<typeof MediaDisplaySchema & typeof MediaIconSchema>

export const typographySchema = z.object({
  label: z.string().optional().meta({ ai: true }),
  weight: z.string().optional().meta({ ai: false }),
  lineHeight: z.string().optional().meta({ ai: false }),
  letterSpacing: z.string().optional().meta({ ai: false }),
  font: fontFamilySchema.optional().meta({ ai: false }),
})

export type TypographyObject = z.infer<typeof typographySchema>

export const ActionButtonSchema = z.object({
  key: z.string().optional().meta({ ai: false, description: 'Unique key for the button' }),
  label: z.string().optional().meta({ ai: true, description: 'Button text' }),
  href: z.string().optional().meta({ ai: true, description: 'Button link URL or /path' }),
  size: SizeSchema.optional().meta({ ai: false, description: 'Button size' }),
  theme: ButtonColorThemeSchema.optional().meta({ ai: true, description: 'Button color scheme' }),
  design: ButtonDesignSchema.optional().meta({ ai: true, description: 'Button visual style' }),
  format: ButtonFormatSchema.optional().meta({ ai: false }),
  rounding: ButtonRoundingSchema.optional().meta({ ai: false }),
  icon: z.union([z.string(), MediaSchema]).optional().meta({ ai: false }),
  iconAfter: z.union([z.string(), MediaSchema]).optional().meta({ ai: false }),
  loading: z.boolean().optional().meta({ ai: false }),
  disabled: z.boolean().optional().meta({ ai: false }),
  onClick: functionSchema(ClickHandlerSchema).optional().meta({ ai: false }),
  testId: z.string().optional().meta({ ai: false }),
  target: z.enum(['_blank', '_self']).optional().meta({ ai: true, description: 'Link target' }),
  hover: ButtonHoverSchema.optional().meta({ ai: false }),
  type: z.enum(['button', 'submit', 'reset']).optional().meta({ ai: false }),
  animate: z.boolean().optional().meta({ ai: false, description: 'Enable button animation' }),
})

export type ActionButton = z.infer<typeof ActionButtonSchema>

export const ActionAreaSchema = z.object({
  buttons: z.array(ActionButtonSchema).optional().meta({ ai: true, description: 'Interactive buttons' }),
  size: SizeSchema.optional().meta({ ai: false, description: 'Component size' }),
  theme: ButtonColorThemeSchema.optional().meta({ ai: false, description: 'Color scheme' }),
  design: ButtonDesignSchema.optional().meta({ ai: false, description: 'Visual style' }),
})

export type ActionArea = z.infer<typeof ActionAreaSchema>

/**
 * NAV LIST
 */
const emphasisSchema = z.enum(['default', 'highlighted', 'muted'])

// First define base schema without recursive parts
const BaseNavListItemSchema = z.object({
  // Core content
  key: z.string().optional().meta({ ai: false, description: 'Unique index key for the item' }),
  id: z.string().optional().meta({ ai: false, description: 'Globally unique identifier for the item' }),
  label: z.string().optional().meta({ ai: true, description: 'Primary text displayed for the item (e.g., "Products")' }),
  srLabel: z.string().optional().meta({ ai: true, description: 'Screen reader label for accessibility' }),
  subLabel: z.string().optional().meta({ ai: true, description: 'Secondary text shown below label for additional context' }),
  value: z.union([z.string(), z.number()]).optional().meta({ ai: true, description: 'Value associated with the item' }),
  description: z.string().optional().meta({ ai: true, description: 'Longer description or explanation of the item' }),
  info: z.string().optional().meta({ ai: false, description: 'Tertiary text, often used for metadata like "5 min read" or counts' }),
  count: z.number().optional().meta({ ai: false, description: 'Numeric count or value associated with the item' }),
  className: z.string().optional().meta({ ai: false, description: 'Custom CSS class for styling the item' }),

  // Visual
  media: MediaSchema.optional().meta({ ai: true, description: 'Media content shown with the item' }),
  icon: MediaSchema.optional().meta({ ai: true, description: 'Leading icon shown before the label' }),
  iconAfter: MediaSchema.optional().meta({ ai: false, description: 'Trailing icon shown after the label' }),
  badge: z.object({
    content: z.union([z.string(), z.number()]).optional().meta({ ai: true }),
    color: z.enum(colorThemeUser).optional().meta({ ai: false }),
  }).optional().meta({ ai: false, description: 'Badge shown near label (e.g., "New" or count)' }),

  // Navigation behavior
  href: z.string().optional().meta({ ai: true, description: 'Navigation URL - internal path or external link' }),
  target: z.enum(['_self', '_blank']).optional().meta({ ai: true, description: 'Link target - "_blank" opens in new tab' }),
  onClick: functionSchema(ClickHandlerSchema).optional().meta({ ai: false, description: 'Click handler - use for custom navigation or actions' }),

  // Visual & behavioral variants
  variant: z.enum([
    'default', // Standard link
    'button', // Button-like appearance
    'avatar', // User avatar display
  ]).optional().meta({ ai: false }),

  emphasis: emphasisSchema.optional().meta({ ai: false }),

  theme: z.enum(colorThemeUser).optional().meta({ ai: true, description: 'Color theme for the item' }),
  design: ButtonDesignSchema.optional().meta({ ai: false, description: 'Design style for the item' }),

  action: ActionAreaSchema.optional().meta({ ai: true, description: 'Interactive buttons or subscribe form' }),
  dateAt: z.string().optional().meta({ ai: false, description: 'Date associated with the item' }),

  // State management
  onAuthState: z.enum([
    'loggedIn', // Only shown when user is logged in
    'loggedOut', // Only shown when user is logged out
    'all', // Always shown
  ]).optional().meta({ ai: false }),

  isActive: z.boolean().optional().meta({ ai: false, description: 'Marks the item as active or selected' }),
  isDisabled: z.boolean().optional().meta({ ai: false, description: 'Disables the item from interaction' }),
  isHidden: z.boolean().optional().meta({ ai: false, description: 'Hides the item from view' }),

  // Editing
  basePath: z.string().optional().meta({ ai: false }),

  // Organization
  priority: z.number().optional().meta({ ai: false, description: 'Priority for sorting items default is 100. Less is higher priority' }),

  // Development
  testId: z.string().optional().meta({ ai: false }),
  figure: z.object({
    el: z.custom<vue.AsyncComponentLoader | vue.Component>((val) => {
      return typeof val === 'function' || val instanceof Promise
    }).meta({ ai: false }),
    props: z.record(z.string(), z.any()).optional().meta({ ai: false }),
  }).optional().meta({ ai: false }),
})

// Navigation list container
export const NavListSchema = z.object({
  title: z.string().optional().meta({ ai: true, description: 'Optional section/group title' }),
  description: z.string().optional().meta({ ai: true, description: 'Optional section/group description' }),
  items: z.array(z.record(z.string(), z.any())).optional().meta({ ai: true, description: 'Navigation items in this section' }),
  variant: z.enum(['default', 'expanded']).optional().meta({ ai: false, description: 'Variant of the list' }),
})

// Full navigation item with recursive list support
export const NavListItemSchema = BaseNavListItemSchema.extend({
  list: z.lazy(() => NavListSchema).optional().meta({ ai: true, description: 'Nested navigation list (e.g., dropdown menu)' }),
})

export type NavList = Omit<z.infer<typeof NavListSchema>, 'items'> & { items?: NavListItem[] }

// Define the complete type including recursive items property
export type NavListItem = z.infer<typeof BaseNavListItemSchema> & {
  list?: NavList
}

/**
 * LOGO / BRAND
 */

export const logoSchema = z.object({
  variant: z.enum(['media', 'typography', 'brandLogo', 'brandName']).optional().meta({ ai: false }),
  media: MediaSchema.optional().meta({ ai: true }),
  typography: typographySchema.optional().meta({ ai: false }),
  scale: z.number().optional().meta({ ai: false }),
})

export const brandSchema = z.object({
  logo: logoSchema.optional().meta({ ai: true }),
  href: z.string().optional().meta({ ai: true }),
  tagline: z.string().optional().meta({ ai: true }),
  action: ActionAreaSchema.optional().meta({ ai: true }),
})

export type BrandObject = z.infer<typeof brandSchema>

export type LogoObject = z.infer<typeof logoSchema>

export const SuperTitleSchema = z.object({
  text: z.string().optional().meta({ ai: true, description: 'Short text above main title' }),
  icon: MediaSchema.optional().meta({ ai: true, description: 'Visual indicator icon' }),
  theme: z.enum(colorThemeUser).optional().meta({ ai: false, description: 'Color style' }),
  href: z.string().optional().meta({ ai: true, description: 'Link URL' }),
})

export type SuperTitle = z.infer<typeof SuperTitleSchema>

/**
 * POSTS
 */

export const PostSEOSchema = z.object({
  title: z.string().optional().meta({ ai: true, description: 'Custom SEO title, defaults to post title if not specified' }),
  description: z.string().optional().meta({ ai: true, description: 'Meta description for search engines and social sharing' }),
}).meta({ description: 'SEO metadata for the post' })

const PostUserConfigSchema = z.object({
  seo: PostSEOSchema.optional().meta({ ai: false, description: 'Search engine and social media optimization settings' }),
  isContentCompletionDisabled: z.boolean().optional().meta({ ai: false }),
})

export const AuthorSchema = z.object({
  fullName: z.string().optional().meta({ ai: true }),
  email: z.string().optional().meta({ ai: false }),
  avatar: MediaSchema.optional().meta({ ai: true }),
  title: z.string().optional().meta({ ai: true }),
  headline: z.string().optional().meta({ ai: true }),
  about: z.string().optional().meta({ ai: true }),
  websiteUrl: z.string().optional().meta({ ai: false }),
})

export const PostSchema = z.object({
  // Core Content
  title: z.string().optional().meta({ ai: true, description: 'Primary headline' }),
  subTitle: z.string().optional().meta({ ai: true, description: 'Supporting headline' }),
  superTitle: SuperTitleSchema.optional().meta({ ai: true, description: 'Small header text above title' }),
  content: z.string().optional().meta({ ai: true, description: 'Main content in HTML/Markdown' }),
  excerpt: z.string().optional().meta({ ai: true, description: 'Brief summary for previews' }),

  // Meta Information
  status: PostStatusSchema.optional().meta({ ai: false, description: 'Publication state' }),
  emphasis: emphasisSchema.optional().meta({ ai: false, description: 'Display prominence level' }),
  dateAt: z.string().optional().meta({ ai: false, description: 'Publish date' }),
  publishAt: z.string().optional().meta({ ai: false, description: 'Scheduled publish date' }),

  // Visual Elements
  media: MediaSchema.optional().meta({ ai: true, description: 'Featured image/video' }),
  icon: MediaSchema.optional().meta({ ai: true, description: 'List view icon' }),
  theme: z.enum(colorThemeUser).optional().meta({ ai: true, description: 'Color theme' }),

  // Taxonomy & Organization
  slug: z.string().optional().meta({ ai: false, description: 'URL-friendly title' }),
  href: z.string().optional().meta({ ai: false, description: 'Content permalink' }),
  tags: z.array(z.string()).optional().meta({ ai: true, description: 'Topic labels' }),
  categories: z.array(z.string()).optional().meta({ ai: true, description: 'Content groupings' }),

  // Associated Data
  authors: z.array(AuthorSchema).optional().meta({ ai: false, description: 'Content creators' }),
  action: ActionAreaSchema.optional().meta({ ai: true, description: 'Interactive buttons' }),

  userConfig: PostUserConfigSchema.optional().meta({ ai: false, description: 'Custom settings' }),

  testId: z.string().optional().meta({ ai: false, description: 'Test ID for automated testing' }),
})

export type PostObject = z.infer<typeof PostSchema>
