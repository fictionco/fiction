import type { FictionEnv, FictionPluginSettings, FictionRouter, NavListItem } from '@fiction/core'
import type { CardConfigPortable, FictionSites, Site } from '@fiction/site'
import type { CardSettings, CardTemplate, CardTemplateSettings } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { envConfig, FictionPlugin, log, safeDirname, toKebab, toLabel, vue } from '@fiction/core'
import { Card, cardTemplate } from '@fiction/site/card'

const logger = log.contextLogger('cardLoading')

// Register path for tailwindcss to scan for styles
envConfig.register({
  name: 'CARD_UI_ROOT',
  onLoad: ({ fictionEnv }) => fictionEnv.addUiRoot(safeDirname(import.meta.url)),
})

type TemplateGroup = {
  label: string
  description?: string
  templates: (() => Promise<{ template: CardTemplate<any> }>)[]
}

const templateGroups = [

  {
    label: 'Marketing Essentials',
    description: 'Showcase your identity and value proposition',
    templates: [
      () => import('./user/hero'),
      () => import('./user/profile'),
      () => import('./user/story'),
      () => import('./user/features'),
      () => import('./user/bento'),
      () => import('./user/people'),
    ],
  },
  {
    label: 'Social Proof',
    description: 'Build credibility with testimonials and achievements',
    templates: [
      () => import('./user/testimonials'),
      () => import('./user/quotes'),
      () => import('./user/metrics'),
      () => import('./user/logos'),
      () => import('./user/showcase'),
    ],
  },
  {
    label: 'Content and Posts',
    description: 'Share your expertise and insights',
    templates: [
      () => import('./posts/list'),
      () => import('./posts/blog'),
      () => import('./posts/single'),
      () => import('./user/steps'),
      () => import('./user/faq'),
      () => import('./user/timeline'),
    ],
  },
  {
    label: 'Media Gallery',
    description: 'Showcase your work through rich media',
    templates: [
      () => import('./user/masonryGallery'),
      () => import('./standard/mediaModal'),
    ],
  },
  {
    label: 'Conversion',
    description: 'Turn visitors into connections',
    templates: [
      () => import('./standard/capture'),
      () => import('./pro/pricing'),
      () => import('./user/maps'),
    ],
  },
  {
    label: 'Nav & Structure',
    description: 'Essential layout components for your site foundation',
    templates: [
      () => import('./standard/wrap'),
      () => import('./standard/area'),
      () => import('./standard/nav'),
      () => import('./pro/footer-pro'),
      () => import('./standard/footer'),
    ],
  },
  {
    label: 'Sliders & Carousels',
    description: 'Add dynamic flair to your content',
    templates: [
      () => import('./user/marquee'),
      () => import('./user/overlaySlider'),
      () => import('./user/ticker'),
      () => import('./user/parallaxScroll'),
    ],
  },
  {
    label: 'Effects & Utility',
    description: 'Essential functional components',
    templates: [
      () => import('./user/fitText'),
      () => import('./standard/textEffects'),
      () => import('./standard/error404'),
      () => import('./standard/transaction'),
    ],
  },
] as const satisfies TemplateGroup[]

// Base template types
type TemplateImportFn = typeof templateGroups[number]['templates'][number]
type TemplatePromise = ReturnType<TemplateImportFn>
type TemplateResult = Awaited<TemplatePromise>
type BaseTemplates = TemplateResult['template']

// Create a mapped type for base templates
type BaseTemplateConfigMap = {
  [T in BaseTemplates as T['settings']['templateId']]: T['settings'] extends CardTemplateSettings<infer S>
    ? S extends { userConfig: infer U }
      ? U
      : Record<string, unknown>
    : Record<string, unknown>
}

// Combine base and extended templates
type TemplateConfigMap<
  ExtendedTemplates extends CardTemplate<any>[] = [],
> = {
  [K in keyof BaseTemplateConfigMap]: BaseTemplateConfigMap[K]
} & {
  [T in ExtendedTemplates[number] as T['settings']['templateId']]: T['settings'] extends CardTemplateSettings<infer S>
    ? S extends { userConfig: infer U }
      ? U
      : Record<string, unknown>
    : Record<string, unknown>
}

// Utility type to infer userConfig based on templateId
type InferUserConfig<
  T extends keyof TemplateConfigMap<ExtendedTemplates>,
  ExtendedTemplates extends CardTemplate<any>[] = [],
> = T extends string ? TemplateConfigMap<ExtendedTemplates>[T] : Record<string, unknown>

// Updated cardConfig function
export function cardConfig<
  ExtendedTemplates extends CardTemplate<any>[] = [],
  T extends keyof TemplateConfigMap<ExtendedTemplates> = keyof TemplateConfigMap<ExtendedTemplates>,
>(args: {
  templateId?: T
  userConfig?: InferUserConfig<T, ExtendedTemplates>
} & Omit<CardSettings, 'templateId' | 'userConfig'>): CardConfigPortable<InferUserConfig<T, ExtendedTemplates> & StandardUserConfig> {
  const { templateId, userConfig, ...settings } = args
  return new Card({
    templateId: templateId as string | undefined,
    userConfig: userConfig as any, // Type assertion needed due to complexity
    ...settings,
  }).toConfig()
}
// Type utilities for template configuration
type TemplateModule = { template: CardTemplate<any> }

async function getTemplateModules(): Promise<TemplateModule[]> {
  // Flatten the nested template structure for parallel loading
  const templateEntries = (templateGroups as TemplateGroup[]).flatMap(category => category.templates)

  // Load all templates in parallel with error handling
  const results = await Promise.allSettled(
    templateEntries.map(async (importFn, i) => {
      try {
        return await importFn()
      }
      catch (error) {
        logger.info('Error loading template:', { error, i, importFn })
        throw new Error('Unknown error loading template')
      }
    }),
  )

  return results.map(result => result.status === 'fulfilled' ? result.value : null).filter(Boolean) as TemplateModule[]
}

// Main template getter
export async function getCardTemplates(args: { caller?: string } = {}): Promise<CardTemplate<any>[]> {
  const modules = await getTemplateModules()

  return [
    ...Object.values(modules).map(m => m.template),
  ]
}

// Demo templates for UI components
const uiDemoTemplates = [
  {
    templateId: 'xbutton',
    title: 'Buttons',
    description: 'Standard button styles',
    icon: 'i-tabler-square-rounded-chevron-right-filled',
    component: vue.defineAsyncComponent(() => import('@fiction/ui/buttons/test/TestButtonsAll.vue')),
  },
  {
    templateId: 'xinput',
    title: 'Inputs',
    description: 'Standard input styles',
    icon: 'i-tabler-input-check',
    component: vue.defineAsyncComponent(() => import('@fiction/ui/inputs/test/TestInputsAll.vue')),
  },
  {
    templateId: 'xlogo',
    title: 'Logo Component',
    description: 'Standard logo handling',
    icon: 'i-tabler-brand-apple',
    component: vue.defineAsyncComponent(() => import('@fiction/ui/test/TestLogoHandling.vue')),
  },
  {
    templateId: 'xmedia',
    title: 'Media Component',
    description: 'Standard media handling',
    icon: 'i-tabler-photo-hexagon',
    component: vue.defineAsyncComponent(() => import('@fiction/ui/test/TestMediaHandling.vue')),
  },
  {
    templateId: 'xindex',
    title: 'Post Index',
    description: 'Post handling',
    icon: 'i-tabler-photo-hexagon',
    component: vue.defineAsyncComponent(() => import('@fiction/ui/posts/DemoPostIndex.vue')),
  },
  {
    templateId: 'xpost',
    title: 'Post Component',
    description: 'Post Single',
    icon: 'i-tabler-photo-hexagon',
    component: vue.defineAsyncComponent(() => import('@fiction/ui/posts/DemoPostSingle.vue')),
  },
]

export function getUiDemoCardTemplates() {
  const uiDemoTemplatesList = uiDemoTemplates.map((t) => {
    const el = t.component

    return cardTemplate({
      ...t,
      tags: ['advanced'],
      el,
      isPublic: true,
      getConfig: async (args) => {
        const demoCard = cardConfig<any>({ templateId: args.templateId })
        return {
          demoPage: { cards: [demoCard] },
        }
      },

    })
  })

  return uiDemoTemplatesList
}

// Get demo pages
export async function getDemoPages(args: {
  site: Site
  templates: CardTemplate<any>[] | readonly CardTemplate<any>[]
  fictionEnv?: FictionEnv
  factory: CardFactory
}) {
  const { createDemoPage } = await import('@fiction/site/utils/demo')
  const demoTemplatesList = getUiDemoCardTemplates()
  const allTemplates = [...demoTemplatesList, ...args.templates]

  const demoPagePromises = allTemplates.map(async (template) => {
    return createDemoPage({ site: args.site, template })
  })

  return await Promise.all(demoPagePromises)
}

/**
 * Creates the listing for website demo pages.
 */
export async function getCardDemoListing(): Promise<NavListItem[]> {
  const listing: NavListItem[] = []

  // match the loading of the templates
  const uiDemoCardModules = getUiDemoCardTemplates().map((t) => {
    return () => Promise.resolve({ template: t })
  })

  const demoTemplateGroups: TemplateGroup[] = [
    ...templateGroups,
    { label: 'UI Libraries', templates: uiDemoCardModules },
  ]
  for (const group of demoTemplateGroups) {
    const items: NavListItem[] = []

    for (const importFn of group.templates) {
      const { template } = await importFn()
      const { isPublic, templateId, title } = template.settings
      if (isPublic !== false) {
        items.push({
          label: title || toLabel(templateId),
          href: `/demo-${toKebab(templateId)}`,
        })
      }
    }

    if (items.length > 0) {
      listing.push({
        label: group.label,
        list: { items },
      })
    }
  }

  return listing
}

export type CardsPluginSettings = {
  fictionEnv: FictionEnv
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
} & FictionPluginSettings

export class FictionCards extends FictionPlugin<CardsPluginSettings> {
  constructor(settings: CardsPluginSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionCards', s)
  }

  // override setup() {
  //   this.addStructureFile()
  // }

  // addStructureFile() {
  //   this.fictionEnv.generators.push(async () => {
  //     const cardTemplates = await getCardTemplates({ caller: 'cardStructure' })

  //     const results = await generateCardStructure({
  //       templates: cardTemplates,
  //       fictionSites: this.settings.fictionSites,
  //       fictionRouterSites: this.settings.fictionRouterSites,
  //     })

  //     return { fileName: 'cardStructure.json', content: results.json }
  //   })
  // }
}
