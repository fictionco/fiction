import type { FictionMedia, Processor } from '@fiction/core'
import { FictionObject, ObjectProcessor, deepMerge, isNode, log, parseObject, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import type { FontConfig } from '@fiction/core/utils/fonts'
import { getThemeFontConfig } from '@fiction/core/utils/fonts'
import type { CardTemplate, CreateUserConfigs, ExtractCardTemplateUserConfig } from './card'
import type { CardConfigPortable, PageRegion, SiteUserConfig, TableCardConfig, TableSiteConfig } from './tables'
import { Card } from './card'
import { processUrlKey } from './util'
import type { Layout } from './layout'

export type ThemeSettings = {
  themeId: string
  title?: string
  version?: string
  description?: string
  screenshot: string
  pages: TableCardConfig[]
  templates: readonly CardTemplate[] | CardTemplate[]
  ui?: UiConfig
  isPublic?: boolean
  fontConfig?: FontConfig
  layouts?: readonly Layout[] | Layout[]
  spacing?: {
    contentWidthClass?: string
    spacingClass?: string
  }
  userConfig?: Partial<SiteUserConfig>
  sections?: Record<string, TableCardConfig>
}

export type UiItem = { el: vue.Component }
export interface UiConfig { button?: UiItem }

export class Theme extends FictionObject<ThemeSettings> {
  themeId = this.settings.themeId
  templates = this.settings.templates

  ui = { button: { el: ElButton }, ...this.settings.ui }
  pages = vue.computed(() => (this.settings.pages || []))
  constructor(settings: ThemeSettings) {
    super('Theme', settings)
  }

  getUi(args: { elementId: keyof UiConfig }): UiItem {
    const { elementId } = args
    const out = this.ui?.[elementId]

    return out
  }

  toSite(): Partial<TableSiteConfig> {
    return {
      themeId: this.themeId,
      pages: this.pages.value,
      userConfig: {
        ...this.settings.userConfig,
        ...this.ai(),
      },
    }
  }

  async processToSite(args: {
    orgId: string
    userId: string
    fictionMedia?: FictionMedia
  }): Promise<Partial<TableSiteConfig>> {
    const { orgId, userId, fictionMedia } = args
    if (!fictionMedia)
      throw new Error('fictionMedia required')

    const processors: Processor<string>[] = [
      {
        condition: async ({ value }) => {
          if (typeof value !== 'string')
            return false

          try {
            // handle case where url is in a test that contains 'window' and browser-like import.meta.url
            const url = new URL(value, 'http://dummybase') // Handle relative URLs
            return url.protocol === 'file:' || url.toString().includes('@fs') || (isNode() && url.toString().includes('localhost'))
          }
          catch {
            return false // Return false for invalid URLs
          }
        },
        action: async (url) => {
          return await processUrlKey({ fictionMedia, url, userId, orgId, storagePath: this.themeId })
        },
      },
    ]
    const configProcessor = new ObjectProcessor(processors)

    const siteRaw = this.toSite()

    const site = await configProcessor.parseObject(siteRaw)

    return site
  }

  config() {
    return {
      ...this.fonts(),
      ...this.spacing(),
      ...this.ai(),
      ...this.colors(),
    }
  }

  fonts() {
    const baseConfig = {
      mono: { fontKey: 'DM Mono', stack: 'monospace' },
      input: { fontKey: 'DM Mono', stack: 'sans' },
      title: { fontKey: 'Poppins', stack: 'sans' },
      sans: { stack: 'sans' },
      body: { stack: 'serif' },
      serif: { stack: 'serif' },
    }
    const fontConfig = { ...baseConfig, ...this.settings.fontConfig } as FontConfig
    return getThemeFontConfig(fontConfig)
  }

  spacing() {
    return {
      // contentWidthClass: 'max-w-screen-2xl px-4 sm:px-6 lg:px-20 mx-auto',
      // spacingClass: `py-[calc(1.5rem+4vw)]`,
      ...this.settings.spacing,
    }
  }

  colors() {
    return {
      colorPrimary: 'blue',
      colorTheme: 'gray',
      isDarkMode: false,
    }
  }

  imageStyles() {
    const imageStyle = [
      { category: 'realismAndDetail', name: 'Realistic', value: 'High-resolution, lifelike detail and vivid colors. Artists: Richard Estes, Chuck Close.' },
      { category: 'realismAndDetail', name: 'Grayscale', value: 'Monochromatic elegance in black and white. Artists: Ansel Adams, Doris Salcedo.' },

      { category: 'designAndArt', name: 'Minimalist', value: 'Simple design with monochrome or limited palettes. Artists: Donald Judd, Agnes Martin.' },
      { category: 'designAndArt', name: 'Abstract', value: 'Bold shapes, expressive lines, and minimal colors. Artists: Wassily Kandinsky, Piet Mondrian.' },
      { category: 'designAndArt', name: 'Hand-drawn', value: 'Whimsical, friendly style mimicking hand-drawn sketches. Artists: Quentin Blake, Saul Steinberg.' },
      { category: 'designAndArt', name: 'Watercolor', value: 'Fluid, soft appearance with translucent pastel shades. Artists: John Singer Sargent, Albrecht Dürer.' },

      { category: 'timeAndAesthetic', name: 'Vintage', value: 'Aged effects, classic designs, and sepia tones. Artists: Steichen Edward, Alfred Stieglitz.' },
      { category: 'timeAndAesthetic', name: 'Americana', value: 'Nostalgic, featuring classic, rustic American themes. Artists: Norman Rockwell, Grant Wood.' },
      { category: 'timeAndAesthetic', name: 'Retro-Futurism', value: 'Nostalgic styles blended with futuristic concepts. Artists: Syd Mead, Ralph McQuarrie.' },

      { category: 'natureAndExploration', name: 'Nature', value: 'Green, serene visuals emphasizing eco-friendly themes. Artists: Ansel Adams, Georgia O’Keeffe.' },
      { category: 'natureAndExploration', name: 'Adventure', value: 'Excitement and exploration with dynamic visuals. Artists: Thomas Cole, Frederic Edwin Church.' },
      { category: 'natureAndExploration', name: 'Urban', value: 'Modern city life, architectural and street elements. Artists: Edward Hopper, Richard Estes.' },

      { category: 'fantasyAndSciFi', name: 'Fantasy', value: 'Enchanting landscapes, lush nature, and magical themes. Artists: Brian Froud, John Howe.' },
      { category: 'fantasyAndSciFi', name: 'Hi-Tech', value: 'Cutting-edge technology with a futuristic vibe. Artists: Chris Foss, H.R. Giger.' },
      { category: 'fantasyAndSciFi', name: 'Cyberpunk', value: 'Neon-lit, high-tech urban dystopia. Artists: Masamune Shirow, Katsuhiro Otomo.' },

      { category: 'luxuryAndGlamour', name: 'Luxury', value: 'Opulence, lavish textures, and rich colors. Artists: Gustav Klimt, Peter Paul Rubens.' },
      { category: 'luxuryAndGlamour', name: 'Glamour', value: 'Alluring, sophisticated visuals with a glossy finish. Artists: George Hurrell, Cecil Beaton.' },
      { category: 'luxuryAndGlamour', name: 'High Fashion', value: 'Cutting-edge fashion, luxury, and exclusivity. Artists: Mario Testino, Annie Leibovitz.' },

      { category: 'professionalAndCorporate', name: 'Corporate', value: 'Sleek, professional imagery for business. Artists: Andreas Gursky, Candida Höfer.' },
      { category: 'professionalAndCorporate', name: 'Professional', value: 'Formality, refinement with crisp, smart designs. Artists: Yves Béhar, Dieter Rams.' },

      // Adding more styles
      { category: 'expressiveAndEmotive', name: 'Expressionism', value: 'Intense, emotional expression through bold colors and dramatic compositions. Artists: Edvard Munch, Egon Schiele.' },
      { category: 'surrealAndDreamlike', name: 'Surrealism', value: 'Dreamlike scenes with surprising, often illogical elements. Artists: Salvador Dalí, René Magritte.' },
      { category: 'popAndCulture', name: 'Pop Art', value: 'Bold, colorful imagery of popular culture and mass media. Artists: Andy Warhol, Roy Lichtenstein.' },
      { category: 'culturalAndHistorical', name: 'Classical', value: 'Inspired by Ancient Greece and the Renaissance. Artists: Leonardo da Vinci, Michelangelo.' },
    ]

    return imageStyle
  }

  ai() {
    return {
      baseInstruction: `You are a world-expert copywriter and web designer, create website content designed to subtly persuade using reference info and objectives. Your content should:
- Be elegant and concise, avoiding redundancy and excessive exclamations. Not cheesy, not cliche. Be creative. Don't be pushy.
- Don't reuse the name of the site subject in the content, as it's provided elsewhere.
- Focus on the PROBLEMS of the target customer, in likely context they can be solved by the provider.
- Use an SEO-friendly approach without compromising the natural flow of information.`,
      objectives: {
        about: 'This is a portfolio website for James Bond, a secret agent working for MI6.',
        goal: 'The main goal is educate potential clients about services and experience, provide social proof and testimonials',
        targetCustomer: 'The target customers government intelligence agencies, and similar agencies hiring secret agents',
        targetAction: 'Encourage visitors to fill out a form, call, or email',
        imageStyle: this.imageStyles().find(i => i.name === 'Grayscale')?.value || '',
      },
    }
  }
}

type CardUserConfig<U extends readonly CardTemplate[]> = CreateUserConfigs<U>
// Base interface without slug
type BaseThemeCardArgs<
T extends keyof CardUserConfig<U>,
U extends readonly CardTemplate[],
V extends PageRegion,
W extends CardTemplate | undefined,
> = {
  templates?: U
  tpl?: W
  templateId?: T | 'wrap'
  userConfig?: W extends CardTemplate ? ExtractCardTemplateUserConfig<W> : CardUserConfig<U>[T]
  regionId?: V
  layoutId?: string
  cards?: CardConfigPortable[]
  slug?: string
  title?: string
  isDefault?: boolean
  is404?: boolean
}

export function themeCard<
T extends keyof CreateUserConfigs<U>,
U extends readonly CardTemplate[],
V extends PageRegion,
W extends CardTemplate | undefined,
>(args: BaseThemeCardArgs<T, U, V, W>) {
  const { templates, templateId = 'area', tpl } = args

  if (!templateId && !tpl)
    throw new Error('themeCard: templateId or tpl required')

  const template = tpl || templates?.find(template => template.settings.templateId === templateId)

  // Ensure that 'templates' contains 'templateId'
  if (!template) {
    log.error('themeCard', `Template with key "${templateId}" not found in provided templates.`)
    throw new Error(`themeCard: Template not found: "${templateId}"`)
  }

  const templateUserConfig = template.settings.userConfig ? template.settings.userConfig as CardUserConfig<U>[T] : {}

  const obj = deepMerge([templateUserConfig, args.userConfig])

  const userConfig = parseObject({ obj, onValue: ({ value }) => typeof value === 'string' ? value.replace('file://', '/@fs') : value })

  const { templates: _, ...rest } = args

  return new Card({ ...rest, userConfig }).toConfig() as TableCardConfig
}
