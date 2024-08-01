
import type { ColorTheme, GradientSetting, UserFont } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '../../card'
import { FormTheme } from '../../card'

import type { Form } from '../../form'
import { InputOption } from '@fiction/ui'
import { standardCardOptions } from '../../cardOptions'
import { CardType, standardCardTypes } from '../../cardTypes'
import CardStandard from './CardStandard.vue'
import CardWelcome from './CardWelcome.vue'
import CardEnd from './CardEnd.vue'
import ThemeIndex from './ThemeIndex.vue'

export const cardLayoutMode = [
  'background',
  'left',
  'right',
  'hero',
  'heroLeft',
  'heroRight',
] as const

export const cardAlignmentMode = ['left', 'center', 'right'] as const

export type CardAlignmentMode = typeof cardAlignmentMode[number]
export type CardLayoutMode = typeof cardLayoutMode[number]

export interface EntryProps {
  actionColor?: string
  elementScheme?: ColorTheme
  bgColor: string
  bgImage?: MediaDisplayObject[]
  bgGradient?: GradientSetting
  themeFont?: UserFont
  bgMode?: 'color' | 'image' | 'gradient'
}

type ThemeUserConfig = Omit<EntryProps, 'elementScheme' | 'themeFont'> & {
  elementScheme?: string
  themeFont?: string
}

function cardTypeStandardOptions(card: Card) {
  const c = card.userConfig.value
  return [
    new InputOption({
      optionKey: 'media',
      label: 'Image / Video',
      input: 'InputMediaLibrary',
      core: true,
      category: 'media',
    }),
    new InputOption({
      optionKey: 'layout',
      label: 'Media Layout',
      input: 'InputSelect',
      isVisible: vue.computed(() => {
        return !!c.media
      }),
      core: true,
      category: 'media',
      props: vue.computed(() => {
        return { list: cardLayoutMode }
      }),
    }),
    new InputOption({
      optionKey: 'alignment',
      label: 'Text Alignment',
      input: 'InputSelect',
      core: true,
      category: 'design',
      isVisible: vue.computed(() => {
        return !!c.media
      }),
      props: vue.computed(() => {
        return { list: cardAlignmentMode }
      }),
    }),
  ]
}

export const theme = new FormTheme({
  themeId: 'cardDeck',
  viewCardLevel: 1,
  defaultCardType: (depth: number) => {
    return depth === 0 ? 'group' : 'shortText'
  },

  el: (form: Form) =>
    vue.computed(() => {
      const {
        actionColor,
        elementScheme,
        bgColor = '#ffffff',
        themeFont,
        bgMode,
        bgImage,
        bgGradient,
      } = form.userConfig.value as ThemeUserConfig

      const overlayName
        = bgMode === 'image'
          ? 'Overlay'
          : bgMode === 'gradient'
            ? 'Gradient'
            : 'Background'

      const options: InputOption<string>[] = [
        new InputOption({
          optionKey: 'themeFont',
          label: 'Header Font',
          input: 'InputFont',
          category: 'design',
        }),
        new InputOption({
          optionKey: 'elementScheme',
          label: 'Text/Element Scheme',
          input: 'InputColorScheme',
          category: 'design',
        }),
        new InputOption({
          optionKey: 'actionColor',
          label: 'Action Color',
          input: 'InputColor',
          category: 'design',
        }),
        new InputOption({
          optionKey: 'bgMode',
          label: 'Background Mode',
          input: 'InputSelect',
          category: 'design',
          props: vue.computed(() => ({
            defaultValue: 'image',
            list: ['color', 'gradient', 'image'],
          })),
        }),

        new InputOption({
          optionKey: 'bgImage',
          label: 'Background Image',
          input: 'InputMediaLibrary',
          category: 'design',
          isVisible: vue.computed(() => bgMode === 'image'),
        }),

        new InputOption({
          optionKey: 'bgColor',
          label: `${overlayName} Color`,
          input: 'InputColor',
          category: 'design',
          isVisible: vue.computed(() => bgMode === 'color'),
        }),

        new InputOption({
          optionKey: 'bgGradient',
          label: `Background Gradient`,
          input: 'InputGradient',
          category: 'design',
          isVisible: vue.computed(() => bgMode === 'gradient'),
        }),
      ]

      return {
        component: ThemeIndex,
        props: {
          themeStyle: {
            actionColor,
            bgColor,
            bgMode,
            bgImage,
            bgGradient,
            elementScheme,
            themeFont: themeFont
              ? (JSON.parse(themeFont) as UserFont)
              : { font: 'inherit' },
          },
        },
        options: options.filter(o => o.isVisible.value),
      }
    }),
  cardTypes: [
    new CardType({
      key: 'group',
      name: 'Group',
      handling: 'view',
      hasNested: true,
      category: 'structure',
      region: 'body',
      iconStyle: {
        bg: 'bg-theme-100',
        text: 'text-theme-700',
        icon: 'i-carbon-align-box-middle-center',
      },
      noFlow: true,
      noNav: true,
      el: (card) => {
        return vue.computed(() => {
          return {
            component: CardStandard,
            props: {},
            options: cardTypeStandardOptions(card),
          }
        })
      },
    }),
    new CardType({
      key: 'welcome',
      name: 'Welcome Page',
      handling: 'view',
      addToTop: true,
      category: 'structure',
      region: 'start',
      defaultConfig: { textAlign: 'center' },
      iconStyle: {
        bg: 'bg-cyan-100',
        border: 'border-cyan-300',
        text: 'text-cyan-700',
        icon: 'i-carbon-autoscaling',
      },
      placeholders: {
        heading: 'Say hello!',
      },
      el: (card) => {
        return vue.computed(() => {
          return {
            component: CardWelcome,
            props: {},
            options: [
              ...standardCardOptions({
                card,
                list: [
                  new InputOption({
                    optionKey: 'showTimeToComplete',
                    input: 'InputToggle',
                    category: 'info',
                  }),
                  new InputOption({
                    optionKey: 'showTotalSubmissions',
                    input: 'InputToggle',
                    category: 'info',
                  }),
                ],
              }),
              ...cardTypeStandardOptions(card),
            ],
          }
        })
      },
    }),
    new CardType({
      key: 'end',
      name: 'End Page',
      handling: 'view',
      category: 'structure',
      region: 'end',
      iconStyle: {
        bg: 'bg-cyan-100',
        text: 'text-cyan-700',
        icon: 'i-carbon-logout',
      },
      placeholders: {
        heading: 'Say bye!',
      },
      el: (card) => {
        return vue.computed(() => {
          return {
            component: CardEnd,
            props: {},
            options: [
              new InputOption({
                optionKey: 'heading',
                input: 'InputText',
                core: true,
                category: 'info',
              }),
              new InputOption({
                optionKey: 'description',
                input: 'InputText',
                core: true,
                category: 'info',
              }),
              new InputOption({
                optionKey: 'showSocialButtons',
                input: 'InputToggle',
                category: 'info',
              }),
              new InputOption({
                optionKey: 'buttonText',
                input: 'InputText',
                category: 'info',
              }),
              new InputOption({
                optionKey: 'buttonLink',
                input: 'InputUrl',
                category: 'info',
              }),
              ...cardTypeStandardOptions(card),
            ],
          }
        })
      },
    }),
    ...standardCardTypes(),
  ],
})
