// @unocss-include
import { FactorObject, vue } from '@factor/api'
import InputText from '@factor/ui/InputText.vue'
import InputDate from '@factor/ui/InputDate.vue'
import InputUrl from '@factor/ui/InputUrl.vue'
import InputEmail from '@factor/ui/InputEmail.vue'
import InputPhone from '@factor/ui/InputPhone.vue'
import InputRating from '@factor/ui/InputRating.vue'
import InputNumber from '@factor/ui/InputNumber.vue'
import InputTextarea from '@factor/ui/InputTextarea.vue'
import InputMediaUpload from '@factor/ui/InputMediaUpload.vue'
import InputMultipleChoice from '@factor/ui/InputMultipleChoice.vue'
import InputRanking from '@factor/ui/InputRanking.vue'
import { InputOption } from '@factor/ui'
import { standardCardOptions } from './cardOptions'
import type { Card, CardConfig } from './card'
import type { Form } from './form'

export type CardValueFormat =
  | 'text'
  | 'number'
  | 'none'
  | 'select'
  | 'ranking'
  | 'date'

// need to generalize the case, currently can't figure out how to recreate
// this constructor that vue doesn't export (but uses)
export interface ComponentContructor {
  new (...args: any[]): vue.ComponentPublicInstance<any, any, any, any, any>
}

interface CardTypeComponent<T extends ComponentContructor> {
  component?: T
  props?: Partial<InstanceType<T>['$props']>
  options: InputOption<string>[]
  styling?: 'textInput' | 'boxInput'
  valueFormat?: CardValueFormat
}

export type CardTypeEl<T extends ComponentContructor> = vue.ComputedRef<
  CardTypeComponent<T> | undefined
>

export type CardHandlingMode = 'input' | 'view' | 'element'

export type CardOnAdd = (args: {
  form: Form
  cardType: CardType<string>
}) => void | Promise<void>

export interface StandardCardOptions {
  choices?: string
  heading?: string
  description?: string
  aside?: string
  labelHighest?: string
  labelLowest?: string
  labelCenter?: string
  randomize?: boolean
  allowMultiple?: boolean
  countStart?: number
  countEnd?: number
  media?: string
}

interface CardTypeSettings<T extends string> {
  key: T
  name?: string
  description?: string
  el: (card: Card) => CardTypeEl<ComponentContructor>
  feature?: boolean
  paid?: boolean
  category:
    | 'dateAndSchedule'
    | 'contactInfo'
    | 'payment'
    | 'structure'
    | 'text'
    | 'ratingAndRanking'
    | 'number'
    | 'choices'
    | 'legal'
    | 'files'
  iconStyle?: { bg?: string, text?: string, border?: string, icon: string }
  color?: string
  onAdd?: CardOnAdd
  handling: CardHandlingMode
  addToTop?: boolean
  hasNested?: boolean
  noFlow?: boolean
  noNav?: boolean
  defaultConfig?: Record<string, unknown>
  placeholders?: StandardCardOptions
  region?: 'start' | 'body' | 'end'
}

export class CardType<T extends string> extends FactorObject<
  CardTypeSettings<T>
> {
  key = this.settings.key
  el = this.settings.el
  name = this.settings.name || this.utils.toLabel(this.key)
  description = this.settings.description || ''
  category = this.settings.category
  coreOptions
    = this.settings.category === 'structure'
      ? ['question', 'description']
      : ['question', 'description', 'isRequired']

  cardId?: string
  defaultConfig = this.settings.defaultConfig
  placeholders = {
    heading: 'Enter your heading...',
    description: 'Additional Details (optional)',
    ...this.settings.placeholders,
  }

  iconStyle? = this.settings.iconStyle || {
    bg: 'bg-theme-200',
    text: 'text-theme-700',
    border: 'border-slate-300',
    icon: 'i-carbon-list-boxes',
  }

  handling = this.settings.handling

  addToTop = this.settings.addToTop
  noNav = this.settings.noNav ?? false
  noFlow = this.settings.noFlow ?? false
  hasNested = this.settings.hasNested ?? false
  region = this.settings.region || 'body'
  onAdd: CardOnAdd
    = this.settings.onAdd
    || ((args: { form: Form, cardType: CardType<string> }) => {
      const { form, cardType } = args
      const newCardId = this.utils.objectId()

      const existingCards = form.userConfig.value.cards || []

      let newCard: CardConfig
      if (cardType.handling === 'view') {
        newCard = {
          cardId: newCardId,
          userConfig: {
            cardTypeKey: cardType.key,
          },
        }
      }
      else {
        newCard = {
          cardId: this.utils.objectId(),
          userConfig: {
            cardTypeKey: form.theme.value.defaultCardType(0),
            cards: [
              {
                cardId: newCardId,
                userConfig: { cardTypeKey: this.key },
              },
            ],
          },
        }
      }

      let newCards: CardConfig[]

      if (cardType.addToTop)
        newCards = [newCard, ...existingCards]
      else
        newCards = [...existingCards, newCard]

      form.updateUserConfig({ cards: newCards })

      form.setActiveId({
        cardId: newCardId,
        drawer: 'closeAll',
        scrollIntoView: true,
      })
    })

  constructor(settings: CardTypeSettings<T>) {
    super('CardInput', settings)
  }
}

export function standardCardTypes() {
  return [
    new CardType({
      key: 'shortText',
      handling: 'input',
      feature: true,
      category: 'text',
      description: 'Simple short form text, one line.',
      color: 'bg-pink-500',
      iconStyle: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        icon: 'i-carbon-string-text',
      },
      el: (card): CardTypeEl<typeof InputText> => {
        return vue.computed(() => {
          return {
            component: InputText,
            styling: 'textInput',
            valueFormat: 'text',
            props: {},
            options: standardCardOptions({
              card,
              list: ['maxCharacters'],
            }),
          }
        })
      },
    }),
    new CardType({
      key: 'longText',
      handling: 'input',
      feature: true,
      category: 'text',
      description: 'Longer form text answers, one line or many',
      color: 'bg-emerald-500',
      iconStyle: {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: 'i-carbon-text-align-left',
      },
      el: card =>
        vue.computed(() => {
          return {
            component: InputTextarea,
            styling: 'textInput',
            valueFormat: 'text',
            props: {},
            options: standardCardOptions({
              card,
              list: ['maxCharacters'],
            }),
          }
        }),
    }),
    new CardType({
      key: 'multipleChoice',
      handling: 'input',
      feature: true,
      category: 'choices',

      iconStyle: {
        bg: 'bg-amber-100',
        border: 'border-amber-300',
        text: 'text-amber-700',
        icon: 'i-carbon-list-checked',
      },
      el: (card): CardTypeEl<typeof InputMultipleChoice> => {
        return vue.computed(() => {
          const userConfig = card.userConfig.value
          let list = String(userConfig?.choices || '')
            .split(`\n`)
            .map(item => item.trim())
            .filter(Boolean)

          list = [...new Set(list)]

          if (userConfig.randomize)
            list = list.sort(() => Math.random() - 0.5)

          if (userConfig.addOtherOption)
            list.push('other')

          return {
            component: InputMultipleChoice,
            props: {
              list,
              max: userConfig.maxSelect as number | undefined,
              min: userConfig.minSelect as number | undefined,
            },
            styling: 'boxInput',
            valueFormat: 'select',
            options: standardCardOptions({
              card,
              list: [
                'choices',
                'maxSelect',
                'minSelect',
                'randomize',
                'addOtherOption',
              ],
            }),
          }
        })
      },
    }),
    new CardType({
      key: 'opinionScale',
      handling: 'input',
      iconStyle: {
        bg: 'bg-emerald-100',
        border: 'border-emerald-300',
        text: 'text-emerald-700',
        icon: 'i-carbon-chart-bar',
      },

      el: (card): CardTypeEl<typeof InputRating> => {
        return vue.computed(() => {
          const c = card.fullConfig.value
          return {
            styling: 'boxInput',
            valueFormat: 'number',
            options: standardCardOptions({
              card,
              list: [
                new InputOption({
                  optionKey: 'countStart',
                  input: 'InputSelect',
                  category: 'info',
                  props: vue.computed(() => {
                    return {
                      list: ['0', '1'],
                    }
                  }),
                }),
                new InputOption({
                  optionKey: 'countEnd',
                  input: 'InputSelect',
                  category: 'info',
                  props: vue.computed(() => {
                    return {
                      list: ['3', '4', '5', '6', '7', '8', '9', '10'],
                    }
                  }),
                }),
                new InputOption({
                  optionKey: 'labelLowest',
                  input: 'InputText',
                  category: 'info',
                }),
                new InputOption({
                  optionKey: 'labelCenter',
                  input: 'InputText',
                  category: 'info',
                }),
                new InputOption({
                  optionKey: 'labelHighest',
                  input: 'InputText',
                  category: 'info',
                }),
              ],
            }),
            component: InputRating,
            props: {
              countStart: c.countStart,
              countEnd: c.countEnd,
              labels: {
                low: c.labelLowest,
                middle: c.labelCenter,
                high: c.labelHighest,
              },
            },
          }
        })
      },
      feature: true,
      category: 'ratingAndRanking',
    }),
    new CardType({
      key: 'ranking',
      handling: 'input',
      description: 'Ask the user to rank the options',
      category: 'ratingAndRanking',
      iconStyle: {
        bg: 'bg-emerald-100',
        border: 'border-emerald-300',
        text: 'text-emerald-700',
        icon: 'i-carbon-list-numbered',
      },
      el: (card) => {
        return vue.computed(() => {
          const userConfig = card.userConfig.value
          const list = userConfig?.choices
            ? String(userConfig?.choices).split(`\n`).filter(Boolean)
            : []

          return {
            component: InputRanking,
            props: { list },
            valueFormat: 'ranking',
            options: standardCardOptions({
              card,
              list: ['choices'],
            }),
          }
        })
      },
    }),
    new CardType({
      key: 'date',
      handling: 'input',
      category: 'dateAndSchedule',
      iconStyle: {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: 'i-carbon-calendar',
      },
      el: card =>
        vue.computed(() => ({
          styling: 'textInput',
          component: InputDate,
          props: {},
          valueFormat: 'date',
          options: standardCardOptions({
            card,
            list: ['dateFormat'],
          }),
        })),
    }),
    new CardType({
      key: 'fileUpload',
      handling: 'input',
      category: 'files',
      paid: true,
      iconStyle: {
        bg: 'bg-pink-100',
        border: 'border-pink-300',
        text: 'text-pink-700',
        icon: 'i-carbon-image',
      },
      el: card =>
        vue.computed(() => ({
          component: InputMediaUpload,
          props: {},
          options: standardCardOptions({
            card,
            list: [],
          }),
        })),
    }),
    new CardType({
      key: 'email',
      handling: 'input',
      category: 'contactInfo',
      feature: true,
      iconStyle: {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: 'i-carbon-email',
      },
      el: (card) => {
        return vue.computed(() => ({
          styling: 'textInput',
          component: InputEmail,
          props: {},
          options: standardCardOptions({
            card,
            list: [],
          }),
        }))
      },
    }),
    new CardType({
      key: 'phoneNumber',
      handling: 'input',
      category: 'contactInfo',
      iconStyle: {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: 'i-carbon-phone',
      },
      el: (card) => {
        return vue.computed(() => ({
          styling: 'textInput',
          component: InputPhone,
          props: {},
          options: standardCardOptions({
            card,
            list: ['country'],
          }),
        }))
      },
    }),
    new CardType({
      key: 'website',
      handling: 'input',
      category: 'contactInfo',
      iconStyle: {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: 'i-carbon-link',
      },
      el: card =>
        vue.computed(() => ({
          styling: 'textInput',
          component: InputUrl,
          props: {},
          options: standardCardOptions({
            card,
            list: [],
          }),
        })),
    }),
    new CardType({
      key: 'statement',
      feature: true,
      category: 'structure',
      handling: 'element',
      iconStyle: {
        bg: 'bg-cyan-100',
        border: 'border-cyan-300',
        text: 'text-cyan-700',
        icon: 'i-carbon-quotes',
      },
      placeholders: {
        heading: 'Add your statement',
      },
      el: (card) => {
        return vue.computed(() => ({
          options: standardCardOptions({
            card,
            list: [
              new InputOption({
                optionKey: 'quotationMarks',
                input: 'InputToggle',
                category: 'handling',
              }),
            ],
          }),
        }))
      },
    }),

    new CardType({
      key: 'netPromotorScore',
      handling: 'input',
      category: 'ratingAndRanking',
      iconStyle: {
        bg: 'bg-emerald-100',
        border: 'border-emerald-300',
        text: 'text-emerald-700',
        icon: 'i-carbon-analytics',
      },
      defaultConfig: {
        heading: 'How likely are you to recommend us to a friend or colleague?',
        labelLowest: 'Not likely at all',
        labelHighest: 'Extremely likely',
      },
      el: (card): CardTypeEl<typeof InputRating> => {
        return vue.computed(() => {
          const c = card.fullConfig.value
          return {
            valueFormat: 'number',
            options: standardCardOptions({
              card,
              list: [
                new InputOption({
                  optionKey: 'labelLowest',
                  input: 'InputText',
                  category: 'info',
                }),
                new InputOption({
                  optionKey: 'labelCenter',
                  input: 'InputText',
                  category: 'info',
                }),
                new InputOption({
                  optionKey: 'labelHighest',
                  input: 'InputText',
                  category: 'info',
                }),
              ],
            }),
            component: InputRating,
            props: {
              countStart: 0,
              countEnd: 10,
              labels: {
                low: c.labelLowest,
                middle: c.labelCenter,
                high: c.labelHighest,
              },
            },
          }
        })
      },
    }),
    new CardType({
      key: 'rating',
      handling: 'input',
      category: 'ratingAndRanking',
      iconStyle: {
        bg: 'bg-emerald-100',
        border: 'border-emerald-300',
        text: 'text-emerald-700',
        icon: 'i-carbon-star',
      },
      el: (card): CardTypeEl<typeof InputRating> => {
        return vue.computed(() => {
          const c = card.fullConfig.value
          return {
            component: InputRating,
            valueFormat: 'number',
            props: {
              countStart: 1,
              countEnd: c.outOf as number | undefined,
            },
            options: standardCardOptions({
              card,

              list: [
                new InputOption({
                  optionKey: 'outOf',
                  input: 'InputSelect',
                  category: 'info',
                  props: vue.computed(() => ({ min: 1, max: 10, step: 1 })),
                }),
                new InputOption({
                  optionKey: 'icon',
                  input: 'InputSelect',
                  category: 'info',
                  props: vue.computed(() => ({
                    list: [
                      { name: 'Star', value: 'i-carbon-star' },
                      { name: 'Checkmark', value: 'i-carbon-checkmark' },
                    ], // , "heart", "person", "thumb", "circle", "check"
                  })),
                }),
              ],
            }),
          }
        })
      },
    }),

    new CardType({
      key: 'number',
      handling: 'input',
      category: 'number',
      iconStyle: {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: 'i-carbon-character-whole-number',
      },
      el: card =>
        vue.computed(() => ({
          component: InputNumber,
          props: {},
          styling: 'textInput',
          options: standardCardOptions({
            card,
            list: [
              new InputOption({
                optionKey: 'minNumber',
                input: 'InputNumber',
                category: 'validation',
              }),
              new InputOption({
                optionKey: 'maxNumber',
                input: 'InputNumber',
                category: 'validation',
              }),
            ],
          }),
        })),
    }),

    new CardType({
      key: 'yesOrNo',
      handling: 'input',
      category: 'choices',
      iconStyle: {
        bg: 'bg-amber-100',
        border: 'border-amber-300',
        text: 'text-amber-700',
        icon: 'i-carbon-boolean',
      },
      el: (card) => {
        return vue.computed(() => ({
          component: InputMultipleChoice,
          props: { list: ['Yes', 'No'] },
          valueFormat: 'select',
          options: standardCardOptions({
            card,
            list: ['isRequired'],
          }),
        }))
      },
    }),
    new CardType({
      key: 'consent',
      handling: 'input',
      category: 'choices',
      iconStyle: {
        bg: 'bg-amber-100',
        border: 'border-amber-300',
        text: 'text-amber-700',
        icon: 'i-carbon-checkmark-outline',
      },
      el: (card) => {
        return vue.computed(() => ({
          component: InputMultipleChoice,
          valueFormat: 'select',
          props: {
            list: [
              { name: 'I accept', value: 'accepted' },
              { name: 'I don\'t accept', value: 'declined' },
            ],
          },
          options: standardCardOptions({
            card,
            list: ['isRequired'],
          }),
        }))
      },
    }),
  ]
}
