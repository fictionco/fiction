import type { FictionEnv, FictionPluginSettings, FictionRouter } from '@fiction/core'
import type { CardConfigPortable, FictionSites, Site } from '@fiction/site'
import type { CardSettings, CardTemplate } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { FictionPlugin, log, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const logger = log.contextLogger('cardLoading')

const cardTemplateImports = [
  // Marketing Essentials
  () => import('./user/hero'),
  () => import('./user/profile'),
  () => import('./user/story'),
  () => import('./user/features'),
  () => import('./user/bento'),
  () => import('./user/people'),

  // Social Proof
  () => import('./user/testimonials'),
  () => import('./user/quotes'),
  () => import('./user/metrics'),
  () => import('./user/logos'),
  () => import('./user/showcase'),

  // Content and Posts
  () => import('./posts/list'),
  () => import('./posts/blog'),
  () => import('./posts/single'),
  () => import('./user/steps'),
  () => import('./user/faq'),
  () => import('./user/timeline'),

  // Media Gallery
  () => import('./user/masonryGallery'),
  () => import('./standard/mediaModal'),

  // Conversion
  () => import('./standard/capture'),
  () => import('./pro/pricing'),
  () => import('./user/maps'),

  // Nav & Structure
  () => import('./standard/wrap'),
  () => import('./standard/area'),
  () => import('./standard/nav'),
  () => import('./pro/footer-pro'),
  () => import('./standard/footer'),

  // Sliders & Carousels
  () => import('./user/marquee'),
  () => import('./user/overlaySlider'),
  () => import('./user/ticker'),
  () => import('./user/parallaxScroll'),

  // Effects & Utility
  () => import('./user/fitText'),
  () => import('./standard/textEffects'),
  () => import('./standard/error404'),
  () => import('./standard/transaction'),
  () => import('./standard/manage'),
] as const

// templateTypes.ts
type TemplateImports = typeof cardTemplateImports[number]
type TemplateModule = Awaited<ReturnType<TemplateImports>>
type TemplateInstance = TemplateModule['template']

// Extract userConfig type from CardTemplate
type ExtractUserConfig<T> = T extends CardTemplate<infer S>
  ? S extends { userConfig: infer U }
    ? U
    : never
  : never

// Create the type map from template instances
type TemplateConfigMap = {
  [T in TemplateInstance as T['settings']['templateId']]: ExtractUserConfig<T>
}

// Overload for array of custom CardTemplate types
export function cardConfigCustom<T extends CardTemplate<any>[]>(args: {
  templateId: T[number]['settings']['templateId']
  userConfig?: T[number]['userConfig'] & StandardUserConfig
  cardId?: string
} & Omit<CardSettings, 'templateId' | 'userConfig'>) {
  return args as CardConfigPortable
}

// Implementation
export function cardConfig<T extends keyof TemplateConfigMap>(args: {
  templateId: T
  userConfig?: TemplateConfigMap[T] & StandardUserConfig
  cardId?: string
} & Omit<CardSettings, 'templateId' | 'userConfig'>) {
  return args as CardConfigPortable
}

export async function cardConfigWithDefault<T extends keyof TemplateConfigMap>(args: {
  templateId: T
  site: Site
  cardId?: string
  userConfig?: TemplateConfigMap[T] & StandardUserConfig
}): Promise<CardConfigPortable> {
  const { templateId, site, cardId, userConfig } = args

  const tpl = site.theme.value?.templates.find(t => t.settings.templateId === templateId)

  if (!tpl) {
    throw new Error(`Could not find template with templateId: ${templateId}`)
  }

  const tplCard = await tpl.toCard({
    cardId,
    site,
    userConfig: userConfig as any, // Type assertion needed due to complexity
  })

  return tplCard.toConfig() as CardConfigPortable
}

async function getTemplateModules(): Promise<TemplateModule[]> {
  // Flatten the nested template structure for parallel loading
  const templateEntries = cardTemplateImports

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

export function getUiDemoCardTemplates() {
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
      templateId: 'xemail',
      title: 'Email',
      description: 'HTML Email Template',
      icon: 'i-tabler-mail',
      component: vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/test/EmailPreview.vue')),
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
      component: vue.defineAsyncComponent(() => import('@fiction/ui/posts/classic/DemoPostIndex.vue')),
    },
    {
      templateId: 'tufte',
      title: 'Tufte Post Index',
      component: vue.defineAsyncComponent(() => import('./posts/blog/demo.vue')),
    },
    {
      templateId: 'xpost',
      title: 'Post Component',
      description: 'Post Single',
      icon: 'i-tabler-photo-hexagon',
      component: vue.defineAsyncComponent(() => import('@fiction/ui/posts/classic/DemoPostSingle.vue')),
    },
  ]

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

// /**
//  * Creates the listing for website demo pages.
//  */
// export async function getCardDemoListing(): Promise<NavListItem[]> {
//   const listing: NavListItem[] = []

//   // match the loading of the templates
//   const uiDemoCardModules = getUiDemoCardTemplates().map((t) => {
//     return () => Promise.resolve({ template: t })
//   })

//   const demoTemplateGroups: TemplateGroup[] = [
//     ...templateGroups,
//     { label: 'UI Libraries', templates: uiDemoCardModules },
//   ]
//   for (const group of demoTemplateGroups) {
//     const items: NavListItem[] = []

//     for (const importFn of group.templates) {
//       const { template } = await importFn()
//       const { isPublic, templateId, title } = template.settings
//       if (isPublic !== false) {
//         items.push({
//           label: title || toLabel(templateId),
//           href: `/demo-${toKebab(templateId)}`,
//         })
//       }
//     }

//     if (items.length > 0) {
//       listing.push({
//         label: group.label,
//         list: { items },
//       })
//     }
//   }

//   return listing
// }

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
}
