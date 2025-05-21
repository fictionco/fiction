import type { CardConfigPortable } from '@fiction/site/tables.js'
import { cardConfig } from '@fiction/cards/index.js'
import { createStockMediaHandler } from '@fiction/ui/stock/index.js'

export async function getCards(): Promise<CardConfigPortable[]> {
  const stock = await createStockMediaHandler()

  return [
    cardConfig({
      templateId: 'cardOverlaySliderV1',
      userConfig: {
        autoSlide: true,
        items: [
          {
            title: 'Your Primary Headline',
            subTitle: 'Notice how a strong subheadline adds context and depth',
            media: stock.getRandomByTags(['woman']),
            textBlend: 'difference',
          },
          {
            title: 'Memorable First Impressions',
            subTitle: 'Multiple slides help showcase different aspects of your brand',
            media: stock.getRandomByTags(['woman']),
            textBlend: 'difference',
          },
          {
            title: 'Your Brand Position',
            subTitle: 'Use this space to communicate your unique value proposition',
            media: stock.getRandomByTags(['woman']),
            textBlend: 'difference',
          },
        ],
      },
    }),
    cardConfig({
      templateId: 'cardFeaturesV1',
      userConfig: {
        items: [
          {
            title: 'Primary Service',
            description: 'Describe your first key offering here. What problem does it solve? Who is it for?',
            icon: { iconId: 'briefcase' },
            color: 'blue',
            columns: '2',
          },
          {
            title: 'Secondary Service',
            description: 'Your second offering should complement the first.',
            icon: { iconId: 'bulb' },
            color: 'emerald',
            columns: '2',
          },
          {
            title: 'Tertiary Service',
            description: 'Complete your service trinity with a third distinct offering.',
            icon: { iconId: 'users' },
            color: 'indigo',
            columns: '2',
          },
        ],
        style: {
          iconStyle: 'duotone',
        },
      },
    }),
    cardConfig({
      templateId: 'cardHeroV1',
      userConfig: {
        items: [
          {
            layout: 'left',
            title: 'Your Professional Title',
            subTitle: 'This brief professional bio should be approximately 15-25 words.',
            superTitle: {
              text: 'Brand Tagline',
              icon: { iconId: 'star' },
              theme: 'primary',
            },
            media: stock.getRandomByTags(['woman']),
            action: {
              buttons: [
                { label: 'Primary CTA', href: '/work', theme: 'primary' },
                { label: 'Secondary CTA', href: '/contact' },
              ],
            },
          },
        ],
      },
    }),
  ]
}
