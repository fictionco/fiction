// pages/demos/index.ts
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import { cardConfig } from '@fiction/cards'
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

/**
 * Create a custom component to display the demo links
 */
const DemoGridComponent = vue.defineAsyncComponent(() => import('./DemoGrid.vue'))

/**
 * Define a card template for our demo grid
 */
export const demosGridTemplate = cardTemplate({
  templateId: 'demosGridV1',
  title: 'Component Demos Grid',
  icon: 'i-tabler-components',
  el: DemoGridComponent,
  isPublic: false,
})

/**
 * Generates the demos page with a hero and custom component grid
 */
export async function getDemosPage(args: { site: Site, factory: CardFactory }) {
  const { factory } = args

  const heroCard = cardConfig({
    templateId: 'cardHeroV1',
    userConfig: {
      items: [
        {
          superTitle: {
            icon: { iconId: 'components' },
            theme: 'primary',
            text: 'Component Library',
          },
          title: 'Interactive Component Demos',
          subTitle: 'Professional designed elements for personal brand sites',
          layout: 'center',
          action: { buttons: [] },
        },
      ],
    },
  })

  // Create the demo grid card with custom component
  const demoGridCard = await factory.fromTemplate({
    templateId: 'demosGridV1',
    el: DemoGridComponent,
    userConfig: {},
  })

  // Return the full page configuration
  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'demos',
    title: 'Component Demos',
    cards: [heroCard, demoGridCard],
  })
}
