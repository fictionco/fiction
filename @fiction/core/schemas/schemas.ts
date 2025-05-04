import type { IconName } from '@fiction/ui/lib/systemIcons.js'
import type { vue } from '../utils/libraries.js'
import { z } from 'zod'
import { ColorScaleSchema, colorThemeUser, colorThemeWithInvert } from '../utils/colors.js'

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

export const ValidateCallbackSchema = z.function().args(z.object({ reportValidity: z.boolean().optional() })).returns(z.boolean())

export const ClickCallbackContextSchema = z.object({
  validate: ValidateCallbackSchema.optional(),
})

export type ClickCallbackContext = z.infer<typeof ClickCallbackContextSchema>

export const ClickCallbackArgsSchema = z.object({
  event: z.instanceof(MouseEventType).optional(),
  item: z.record(z.any()).optional(),
  props: z.record(z.string(), z.any()).optional(),
  context: ClickCallbackContextSchema.optional(),
})

export type ClickCallbackArgs = z.infer<typeof ClickCallbackArgsSchema>

const ClickHandlerSchema = z.function()
  .args(
    z.object({
      event: z.instanceof(MouseEventType).optional(),
      item: z.record(z.any()).optional(),
      props: z.record(z.string(), z.any()).optional(),
      context: ClickCallbackContextSchema.optional(),
    }),
  )
  .returns(z.any())

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

// For specifying a color point in the gradient with maximum flexibility
export const GradientPointSchema = z.object({
  // For direct hex/rgba colors
  color: z.string().optional(),

  // For using theme colors (e.g. 'blue', 'emerald')
  theme: ColorThemeSchema.optional(),

  // For theme color intensity (e.g. 500, 600)
  scale: ColorScaleSchema.optional(),

  // Position in gradient (0-100)
  position: z.number().min(0).max(100).optional(),

  // Opacity as 0-1 float
  opacity: z.number().min(0).max(1).optional(),
})

export type GradientPoint = z.infer<typeof GradientPointSchema>

// Main gradient definition
export const GradientSettingSchema = z.object({
  // Angle in degrees
  angle: z.number().min(0).max(360).optional(),

  // Array of color stops
  stops: z.array(GradientPointSchema).optional(),

  // Type of gradient
  type: z.enum(['linear', 'radial', 'conic']).optional(),

  // Pre-computed CSS (for caching/performance)
  css: z.string().optional(),
})

export type GradientSetting = z.infer<typeof GradientSettingSchema>

// For overlay effects
export const OverlaySettingSchema = z.object({
  // Full gradient definition
  gradient: GradientSettingSchema.optional(),

  // Overall opacity
  opacity: z.number().min(0).max(100).optional(),

  // CSS blend mode
  blendMode: BlendModesSchema.optional(),

  // Solid color fallback
  color: z.string().optional(),
})
export const ImageFilterConfigSchema = z.object({
  filter: ImageFiltersSchema.optional(),
  percent: z.number().min(0).max(100).optional(),
  value: z.string().optional(),
})
export type ImageFilterConfig = z.infer<typeof ImageFilterConfigSchema>

export const MediaFormat = z.enum(['url', 'image', 'video', 'iframe', 'html', 'component', 'iconId', 'iconClass', 'typography'])

// MediaBasic schema
export const MediaBasicSchema = z.object({
  html: z.string().optional(),
  url: z.string().optional(),
  format: MediaFormat.optional(),
  alt: z.string().optional(),

  el: z.custom<vue.AsyncComponentLoader | vue.Component>((val) => {
    return typeof val === 'function' || val instanceof Promise
  }, { message: 'Must be an async component or Promise' }).optional(),
  props: z.record(z.string(), z.any()).optional(),
  aspect: AspectRatioSchema.optional(),
}, { description: 'MediaBasicSchema' })

export const MediaIconSchema = MediaBasicSchema.extend({
  iconId: z.string().optional().describe('iconId is common icon name (e.g. user, check, lock)') as z.Schema<IconName | undefined>,
  class: z.string().optional().describe('tabler iconify class i-tabler-[icon-name]'),
})

export const typographySchema = z.object({
  label: z.string().optional(),
  weight: z.string().optional(),
  lineHeight: z.string().optional(),
  letterSpacing: z.string().optional(),
  font: fontFamilySchema.optional(),
})

export type TypographyObject = z.infer<typeof typographySchema>

// MediaContent schema (includes MediaBasic)
export const MediaContentSchema = MediaIconSchema.extend({

  caption: z.string().optional(),
  mime: z.string().optional(),
  blurhash: z.string().optional(),
  thumbUrl: z.string().optional(),
})

export const VideoControlsSchema = z.object({
  playbackRate: z.number().min(0.1).max(16).optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
  controls: z.boolean().optional(),
  preload: z.enum(['none', 'metadata', 'auto']).optional(),
  poster: z.string().optional(),
  playsinline: z.boolean().optional(),
  freeze: z.object({
    time: z.number().optional().describe('Time in seconds to freeze video'),
    playOnHover: z.boolean().optional().describe('Play on hover, freeze on blur'),
  }).optional().describe('Video freeze settings'),
}).describe('Video playback controls')

// MediaDisplaySchema (extends MediaContent with display properties)
export const MediaDisplaySchema = MediaContentSchema.extend({
  backgroundColor: z.string().optional(),
  backgroundRepeat: BackgroundRepeatSchema.optional(),
  backgroundPosition: BackgroundPositionSchema.optional(),
  backgroundSize: BackgroundSizeSchema.optional(),
  gradient: GradientSettingSchema.optional(),
  filters: z.array(ImageFilterConfigSchema).optional(),
  overlay: OverlaySettingSchema.optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  tags: z.array(z.string()).optional(),
  displayWidthPercent: z.number().optional(),
  displayHeightPercent: z.number().optional(),
  videoControls: VideoControlsSchema.optional(),
  modify: z.object({
    flip: z.enum(['horizontal', 'vertical']).optional(),
  }).optional(),
})
export type MediaObject = z.infer<typeof MediaDisplaySchema & typeof MediaIconSchema>

export const ActionButtonSchema = z.object({
  key: z.string().optional().describe('Unique key for the button'),
  label: z.string().optional().describe('Button text [@ai]'),
  href: z.string().optional().describe('Button link URL or /path [@ai]'),
  size: SizeSchema.optional().describe('Button size'),
  theme: ButtonColorThemeSchema.optional().describe('Button color scheme [@ai]'),
  design: ButtonDesignSchema.optional().describe('Button visual style [@ai]'),
  format: ButtonFormatSchema.optional(),
  rounding: ButtonRoundingSchema.optional(),
  icon: z.union([z.string(), MediaIconSchema]).optional().describe('Button icon [@ai]'),
  iconAfter: z.union([z.string(), MediaIconSchema]).optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  onClick: ClickHandlerSchema.optional(),
  testId: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional().describe('Link target [@ai]'),
  hover: ButtonHoverSchema.optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
  animate: z.boolean().optional().describe('Enable button animation'),

}, { description: 'ActionButtonSchema' })

export type ActionButton = z.infer<typeof ActionButtonSchema>

export const ActionSubscribeSchema = z.object({
  input: z.object({
    placeholder: z.string().optional().describe('Email input placeholder [@ai]'),
  }).optional(),
  button: z.object({
    label: z.string().optional().describe('Button text [@ai]'),
    icon: MediaIconSchema.optional().describe('Button icon [@ai]'),
  }).optional().describe('buttons [@ai]'),
  success: z.object({
    title: z.string().optional().describe('Success message title [@ai]'),
    content: z.string().optional().describe('Success message content [@ai]'),
  }).optional(),
}, { description: 'ActionSubscribeSchema' })

export type ActionSubscribe = z.infer<typeof ActionSubscribeSchema>

export const ActionAreaSchema = z.object({
  title: z.string().optional().describe('Header text above actions [@ai]'),
  variant: z.enum(['buttons', 'subscribe']).optional().describe('Action type format [@ai]'),
  buttons: z.array(ActionButtonSchema).optional().describe('Interactive buttons [@ai]'),
  size: SizeSchema.optional().describe('Component size'),
  theme: ButtonColorThemeSchema.optional().describe('Color scheme'),
  design: ButtonDesignSchema.optional().describe('Visual style'),
  subscribe: ActionSubscribeSchema.optional().describe('Email capture settings [@ai]'),
  proof: z.object({
    community: z.object({
      isEnabled: z.boolean().optional().describe('Show social proof'),
      text: z.string().optional().describe('Social proof message '),
      count: z.number().optional().describe('Community size'),
      thumbCount: z.number().optional().describe('Avatar count to show'),
    }).optional().describe('Social proof display'),
  }).optional().describe('Trust indicators'),
})

export type ActionArea = z.infer<typeof ActionAreaSchema>

/**
 * NAV LIST
 */
const emphasisSchema = z.enum(['default', 'highlighted', 'muted'])

// First define base schema without recursive parts
const BaseNavListItemSchema = z.object({
  // Core content
  key: z.string().optional().describe('Unique index key for the item'),
  id: z.string().optional().describe('Globally unique identifier for the item'),
  label: z.string().optional().describe('Primary text displayed for the item (e.g., "Products") [@ai]'),
  srLabel: z.string().optional().describe('Screen reader label for accessibility [@ai]'),
  subLabel: z.string().optional().describe('Secondary text shown below label for additional context [@ai]'),
  value: z.union([z.string(), z.number()]).optional().describe('Value associated with the item [@ai]'),
  description: z.string().optional().describe('Longer description or explanation of the item [@ai]'),
  info: z.string().optional().describe('Tertiary text, often used for metadata like "5 min read" or counts'),
  count: z.number().optional().describe('Numeric count or value associated with the item'),
  className: z.string().optional().describe('Custom CSS class for styling the item'),

  // Visual
  media: MediaDisplaySchema.optional().describe('Media content shown with the item'),
  icon: MediaIconSchema.optional().describe('Leading icon shown before the label'),
  iconAfter: MediaIconSchema.optional().describe('Trailing icon shown after the label'),
  badge: z.object({
    content: z.union([z.string(), z.number()]).optional(),
    color: z.enum(colorThemeUser).optional(),
  }).optional().describe('Badge shown near label (e.g., "New" or count)'),

  // Navigation behavior
  href: z.string().optional().describe('Navigation URL - internal path or external link'),
  target: z.enum(['_self', '_blank']).optional().describe('Link target - "_blank" opens in new tab'),
  onClick: ClickHandlerSchema.optional().describe('Click handler - use for custom navigation or actions'),

  // Visual & behavioral variants
  variant: z.enum([
    'default', // Standard link
    'button', // Button-like appearance
    'avatar', // User avatar display
  ]).optional(),

  emphasis: emphasisSchema.optional(),

  theme: z.enum(colorThemeUser).optional().describe('Color theme for the item'),
  design: ButtonDesignSchema.optional().describe('Design style for the item'),

  action: ActionAreaSchema.optional().describe('Interactive buttons or subscribe form'),
  dateAt: z.string().optional().describe('Date associated with the item'),

  // State management
  onAuthState: z.enum([
    'loggedIn', // Only shown when user is logged in
    'loggedOut', // Only shown when user is logged out
    'all', // Always shown
  ]).optional(),

  isActive: z.boolean().optional().describe('Marks the item as active or selected'),
  isDisabled: z.boolean().optional().describe('Disables the item from interaction'),
  isHidden: z.boolean().optional().describe('Hides the item from view'),

  // Editing
  basePath: z.string().optional(),

  // Organization
  priority: z.number().optional().describe('Priority for sorting items default is 100. Less is higher priority'),

  // Development
  testId: z.string().optional(),
  figure: z.object({
    el: z.custom<vue.AsyncComponentLoader | vue.Component>((val) => {
      return typeof val === 'function' || val instanceof Promise
    }),
    props: z.record(z.string(), z.any()).optional(),
  }).optional(),
}, { description: 'NavListItemSchema' })

// Navigation list container
export const NavListSchema = z.object({
  title: z.string().optional().describe('Optional section/group title [@ai]'),
  description: z.string().optional().describe('Optional section/group description [@ai]'),
  items: z.array(z.record(z.string(), z.any())).optional().describe('Navigation items in this section [@ai]'),
  variant: z.enum(['default', 'expanded']).optional().describe('Variant of the list'),
}, { description: 'NavListSchema' })

// Full navigation item with recursive list support
export const NavListItemSchema = BaseNavListItemSchema.extend({
  list: z.lazy(() => NavListSchema).optional().describe('Nested navigation list (e.g., dropdown menu)'),
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
  variant: z.enum(['media', 'typography', 'brandLogo', 'brandName']).optional(),
  media: MediaIconSchema.optional(),
  typography: typographySchema.optional(),
  scale: z.number().optional(),
})

export const brandSchema = z.object({
  logo: logoSchema.optional(),
  href: z.string().optional(),
  tagline: z.string().optional(),
  action: ActionAreaSchema.optional(),
})

export type BrandObject = z.infer<typeof brandSchema>

export type LogoObject = z.infer<typeof logoSchema>

export const SuperTitleSchema = z.object({
  text: z.string().optional().describe('Short text above main title [@ai]'),
  icon: MediaIconSchema.optional().describe('Visual indicator icon [@ai]'),
  theme: z.enum(colorThemeUser).optional().describe('Color style'),
  href: z.string().optional().describe('Link URL [@ai]'),
})

export type SuperTitle = z.infer<typeof SuperTitleSchema>

/**
 * POSTS
 */

export const PostSEOSchema = z.object({
  title: z.string().optional().describe('Custom SEO title, defaults to post title if not specified'),
  description: z.string().optional().describe('Meta description for search engines and social sharing'),
}).describe('SEO metadata for the post')

const PostUserConfigSchema = z.object({
  seo: PostSEOSchema.optional().describe('Search engine and social media optimization settings'),
  isContentCompletionDisabled: z.boolean().optional(),
})

export const AuthorSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  avatar: MediaBasicSchema.optional(),
  title: z.string().optional(),
  headline: z.string().optional(),
  about: z.string().optional(),
  websiteUrl: z.string().optional(),
})

export const PostSchema = z.object({
  // Core Content
  title: z.string().optional().describe('Primary headline [@ai]'),
  subTitle: z.string().optional().describe('Supporting headline [@ai]'),
  superTitle: SuperTitleSchema.optional().describe('Small header text above title [@ai]'),
  content: z.string().optional().describe('Main content in HTML/Markdown [@ai]'),
  excerpt: z.string().optional().describe('Brief summary for previews [@ai]'),

  // Meta Information
  status: PostStatusSchema.optional().describe('Publication state'),
  emphasis: emphasisSchema.optional().describe('Display prominence level'),
  dateAt: z.string().optional().describe('Publish date'),
  publishAt: z.string().optional().describe('Scheduled publish date'),

  // Visual Elements
  media: MediaDisplaySchema.optional().describe('Featured image/video [@ai]'),
  icon: MediaIconSchema.optional().describe('List view icon [@ai]'),
  theme: z.enum(colorThemeUser).optional().describe('Color theme [@ai]'),

  // Taxonomy & Organization
  slug: z.string().optional().describe('URL-friendly title'),
  href: z.string().optional().describe('Content permalink'),
  tags: z.array(z.string()).optional().describe('Topic labels [@ai]'),
  categories: z.array(z.string()).optional().describe('Content groupings [@ai]'),

  // Associated Data
  authors: z.array(AuthorSchema).optional().describe('Content creators'),
  action: ActionAreaSchema.optional().describe('Interactive buttons [@ai]'),

  userConfig: PostUserConfigSchema.optional().describe('Custom settings'),

  testId: z.string().optional().describe('Test ID for automated testing'),

}, { description: 'PostSchema' })

export type PostObject = z.infer<typeof PostSchema>
