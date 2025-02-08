import type { FictionEnv, FictionPluginSettings, FictionRouter, NavListItem } from '@fiction/core'
import type { FictionSites } from '@fiction/site'
import type { CardTemplate } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { Site } from '@fiction/site/site.js'
import { def, envConfig, FictionPlugin, log, safeDirname, toKebab, toLabel, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'
import { generateCardStructure } from './utils/generateStructure'

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

const templateGroups: TemplateGroup[] = [

  {
    label: 'Marketing Essentials',
    description: 'Showcase your identity and value proposition',
    templates: [
      () => import('./content-hero'), // -> hero-banner
      () => import('./content-profile'), // -> about-profile
      () => import('./content-story'), // -> brand-story
      () => import('./content-features'), // -> value-features
      () => import('./slider-statement'), // -> brand-statement
      () => import('./content-bento'), // -> feature-grid
      () => import('./content-people'), // -> team-showcase
    ],
  },
  {
    label: 'Social Proof',
    description: 'Build credibility with testimonials and achievements',
    templates: [
      () => import('./proof-testimonials'), // -> client-testimonials
      () => import('./proof-quotes'), // -> quote-showcase
      () => import('./proof-metrics'), // -> success-metrics
      () => import('./proof-logos'), // -> partner-logos
      () => import('./gallery-showcase'), // -> client-showcase
    ],
  },
  {
    label: 'Content and Posts',
    description: 'Share your expertise and insights',
    templates: [
      () => import('./posts-list'),
      () => import('./posts-magazine'),
      () => import('./social-insta'),
      () => import('./content-steps'),
      () => import('./content-faq'),
      () => import('./content-timeline'),
    ],
  },
  {
    label: 'Media Gallery',
    description: 'Showcase your work through rich media',
    templates: [
      () => import('./slider-cinema/index'),
      () => import('./gallery-masonry'),
      () => import('./modal-media'),
      () => import('./content-tour'),
    ],
  },
  {
    label: 'Conversion',
    description: 'Turn visitors into connections',
    templates: [
      () => import('./convert-cta'),
      () => import('./convert-capture'),
      () => import('./convert-contact'),
      () => import('./convert-pricing'),
      () => import('./location-maps'),
    ],
  },
  {
    label: 'Nav & Structure',
    description: 'Essential layout components for your site foundation',
    templates: [
      () => import('./page-wrap'),
      () => import('./page-area'),
      () => import('./page-nav'),
      () => import('./page-footer-pro'),
      () => import('./page-footer-personal'),
    ],
  },
  {
    label: 'Sliders & Carousels',
    description: 'Add dynamic flair to your content',
    templates: [
      () => import('./media-marquee'),
      () => import('./slider-overlay'),
      () => import('./typography-ticker'),
      () => import('./gallery-parallax-scroll'),
    ],
  },
  {
    label: 'Effects & Utility',
    description: 'Essential functional components',
    templates: [
      () => import('./typography-fit-text'),
      () => import('./effect-shape'),
      () => import('./effect-text'),
      () => import('./page-404'),
      () => import('./page-transaction'),
    ],
  },
]

// Type utilities for template configuration
type TemplateModule = { template: CardTemplate<any> }

async function getTemplateModules(): Promise<TemplateModule[]> {
  // Flatten the nested template structure for parallel loading
  const templateEntries = templateGroups.flatMap(category => category.templates)

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
export async function getCardTemplates(): Promise<CardTemplate<any>[]> {
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
    component: () => import('@fiction/ui/buttons/test/TestButtonsAll.vue'),
  },
  {
    templateId: 'xinput',
    title: 'Inputs',
    description: 'Standard input styles',
    icon: 'i-tabler-input-check',
    component: () => import('@fiction/ui/inputs/test/TestInputsAll.vue'),
  },
  {
    templateId: 'xlogo',
    title: 'Logo Component',
    description: 'Standard logo handling',
    icon: 'i-tabler-brand-apple',
    component: () => import('@fiction/ui/test/TestLogoHandling.vue'),
  },
  {
    templateId: 'xmedia',
    title: 'Media Component',
    description: 'Standard media handling',
    icon: 'i-tabler-photo-hexagon',
    component: () => import('@fiction/ui/test/TestMediaHandling.vue'),
  },
]

function getUiDemoCardTemplates() {
  const uiDemoTemplatesList = uiDemoTemplates.map((t) => {
    return cardTemplate({
      ...t,
      category: ['advanced'],
      el: def(t.component),
      isPublic: true,
      getConfig: async (args) => {
        const demoCard = await args.factory.fromTemplate({
          templateId: args.templateId,
          el: def(t.component),
        })
        return {
          demoPage: {
            cards: [demoCard],
          },
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

  override setup() {
    this.addStructureFile()
  }

  addStructureFile() {
    this.fictionEnv.generators.push(async () => {
      const cardTemplates = await getCardTemplates()

      const results = await generateCardStructure({
        templates: cardTemplates,
        fictionSites: this.settings.fictionSites,
        fictionRouterSites: this.settings.fictionRouterSites,
      })

      return { fileName: 'cardStructure.json', content: results.json }
    })
  }
}
