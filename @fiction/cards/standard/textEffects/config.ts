import type { CardConfigPortable } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import { cardConfig } from '@fiction/cards'
import { z } from 'zod/v4'

const cards = [
  cardConfig({
    templateId: 'cardHeroV1',
    userConfig: {
      items: [
        {
          superTitle: {
            text: 'Text Animation System',
            icon: { class: 'i-tabler-typography' },
          },
          title: '[@text_effect type=circle theme=blue]Transform[/@text_effect] Your Content With [@text_effect type=squiggle theme=orange]Dynamic[/@text_effect] Effects',
          subTitle: 'Add visual interest to your text with animated underlines and highlights. Perfect for emphasizing key messages and creating engaging content.',
          action: {
            buttons: [
              { label: 'View Examples', design: 'ghost' },
              { label: 'Try it Now', design: 'solid', theme: 'primary' },
            ],
          },
        },
      ],
    },
  }),
  cardConfig({
    templateId: 'cardFeaturesV1',
    userConfig: {
      items: [
        {
          title: '[@text_effect type=line theme=blue]Simple Shortcodes[/@text_effect]',
          description: 'Just wrap your text in shortcodes to add effects. Use type and theme attributes to customize the look.',
          icon: { class: 'i-tabler-code' },
        },
        {
          title: '[@text_effect type=squiggle]Multiple Styles[/@text_effect]',
          description: 'Choose from different animation styles: line, squiggle, circle, and scribble. Each adds its own character to your content.',
          icon: { class: 'i-tabler-brush' },
        },
        {
          title: '[@text_effect type=circle theme=violet]Brand Colors[/@text_effect]',
          description: 'Match your brand with theme colors. Use any color from your theme palette: primary, blue, emerald, violet, orange, and more.',
          icon: { class: 'i-tabler-palette' },
        },
        {
          title: '[@text_effect type=scribble theme=rose]Attention Grabbing[/@text_effect]',
          description: 'Naturally draw attention to important content. Perfect for headlines, calls-to-action, and key messages.',
          icon: { class: 'i-tabler-focus' },
        },
      ],
      layout: {
        style: 'grid',
        columns: '2',
        spacing: 'relaxed',
        align: 'left',
      },
    },
  }),
] as CardConfigPortable[]

export async function getConfig(_args: { factory: CardFactory, templateId: string }) {
  const { factory } = _args

  return {
    schema: z.object({}),
    demoPage: { cards },
  }
}
