// @unocss-include
import type { vue } from '@factor/api'
import { FactorObject } from '@factor/api'
import type { InputOption } from '@factor/ui'
import type { Form } from './form'
import type { CardType, StandardCardOptions } from './cardTypes'
import type { LogicStep } from './logic'

export interface ThemeConfig {
  themeId: string
  cardTypes: CardType<string>[]
  viewCardLevel: 0 | 1 | 2
  defaultCardType: (depth: number) => string
  el: (form: Form) => ThemeEntryEl
}

export interface ThemeProps {
  [key: string]: unknown
}

type ThemeEntryEl = vue.ComputedRef<{
  component: vue.Component
  props: ThemeProps
  options: InputOption[]
}>

export class FormTheme extends FactorObject<ThemeConfig> {
  themeId = this.settings.themeId
  cardTypes = this.settings.cardTypes
  defaultCardType = this.settings.defaultCardType
  el = this.settings.el
  viewCardLevel = this.settings.viewCardLevel || 1
  constructor(settings: ThemeConfig) {
    super('FormTheme', settings)
  }
}

export type CardInputSettings = {
  inputId?: string
} & CardInputEditable

export type UserConfigVal =
  | string
  | number
  | boolean
  | undefined
  | string[]
  | Record<string, string>

export interface CardInputEditable<
  T extends Record<string, UserConfigVal> = Record<string, UserConfigVal>,
> {
  userConfig?: T
}

export type CardValue = string | number | boolean | string[] | undefined

export interface CardConfig {
  cardId?: string
  cardKey?: string
  userConfig?: CardUserConfig
  cardValue?: CardValue
  fillCard?: boolean
}

export type CardUserConfig = {
  cardTypeKey?: string
  cards?: CardConfig[]
  logic?: LogicStep[]
  noFlow?: boolean
} & Partial<StandardCardOptions & { [key: string]: unknown }>

export interface SubmissionValue {
  cardId: string
  heading: string
  cardValue: CardValue
  timeToAnswer: number
  revised: boolean
  failedValidation: number
}

export class Card extends FactorObject<
  CardConfig & { form: Form, meta: { depth: number, index: number } }
> {
  cardId = this.settings.cardId || this.utils.objectId()
  cardKey = this.utils.vue.ref(this.settings.cardKey)
  form = this.settings.form
  meta = this.settings.meta
  cardNumber: number | undefined
  cardType = this.utils.vue.computed(() => {
    const cardTypes = this.form.theme.value.cardTypes || []
    const key = this.userConfig.value.cardTypeKey
    const found = cardTypes.find(t => t.key === key)
    return found || cardTypes[0]
  })

  userConfig = this.utils.vue.ref<CardUserConfig>(
    this.settings.userConfig || {},
  )

  conf = this.utils.vue.computed({
    get: () => this.userConfig.value || {},
    set: (v) => {
      this.userConfig.value = v
    },
  })

  cardName = this.utils.vue.computed(() => {
    return `${this.cardNumber}. ${
      this.userConfig.value.heading
        || this.utils.toLabel(this.userConfig.value.cardTypeKey)
    }`
  })

  fullConfig = this.utils.vue.computed<CardUserConfig>(() => {
    return { ...this.cardType.value.defaultConfig, ...this.userConfig.value }
  })

  cardValue = this.utils.vue.ref(this.settings.cardValue)
  logic = this.utils.vue.computed(() => this.userConfig.value.logic || [])
  cards = this.utils.vue.computed<CardConfig[]>(
    () => this.userConfig.value.cards || [],
  )

  cardsFull = this.utils.vue.computed<Card[]>(() => {
    const inputs = this.cards.value || []
    return inputs.map(
      (settings, i) =>
        new Card(this.form, settings, {
          ...this.meta,
          depth: this.meta.depth + 1,
          index: i,
        }),
    )
  })

  activeInputIndex = this.utils.vue.ref(0)
  el = this.cardType.value.el(this)
  placeholders = this.cardType.value.placeholders
  handling = this.cardType.value.handling
  region = this.cardType.value.region
  noFlow = this.utils.vue.computed(
    () => this.userConfig.value.noFlow ?? this.cardType.value.noFlow,
  )

  fillCard = this.settings.fillCard
  constructor(
    form: Form,
    settings: CardConfig,
    meta: { depth: number, index: number },
  ) {
    super('card', { ...settings, meta, form })
  }

  setActiveInputIndex(index: number) {
    this.activeInputIndex.value = index
  }

  updateChildField(args: {
    cardId: string
    field: string
    value: UserConfigVal
  }) {
    const card = this.cardsFull.value.find(i => i.cardId === args.cardId)

    if (card) {
      card.userConfig.value = {
        ...card.userConfig.value,
        [args.field]: args.value,
      }
    }
  }

  updateUserConfig(userConfig: Partial<CardUserConfig>) {
    this.userConfig.value = {
      ...this.userConfig.value,
      ...userConfig,
    }
  }

  setCardValue(data?: CardValue) {
    this.cardValue.value = data
  }

  async next() {
    this.form.nextCard(this.cardId)
  }

  buttonText() {
    const ids = this.form.inputsList.value.map(i => i.cardId)
    const defaultText
      = !this.form.isDev && ids[ids.length - 1] === this.cardId ? 'Submit' : 'Ok'
    return this.userConfig.value.buttonText || defaultText
  }

  toConfig(): CardConfig {
    return {
      cardId: this.cardId,
      cardKey: this.cardKey.value,
      userConfig: {
        ...this.userConfig.value,
        cards: this.cardsFull.value.map(c => c.toConfig()),
      },
    }
  }
}
