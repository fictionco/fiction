import type { FactorMedia } from '@factor/api'
import { FactorObject } from '@factor/api'
import { allThemes } from './themes'
import type {
  CardConfig,
  CardUserConfig,
  CardValue,
  UserConfigVal,
} from './card'
import {
  Card,
} from './card'
import { getLogicResult } from './logic'

export type PostMessageForm =
  | {
    messageType: 'setForm'
    data: FormConfig
  }
  | { messageType: 'resetUi', data: {} }

export interface SubmissionValue {
  cardId: string
  heading: string
  data: string | number | boolean | string[]
  timeToAnswer: number
  revised: boolean
  failedValidation: number
}

export type SubmissionData = Record<string, SubmissionValue>

export type FormConfig = {
  formId?: string
  templateId?: string
  projectId?: string
  createdAt?: string
  createdByUserId?: string
  updatedAt?: string
  isDev?: boolean
  views?: number
  submissions?: number
  service?: { factorMedia: FactorMedia }
  userConfig?: FormUserConfig
  submissionData?: SubmissionData
} & FormEditConfig

export interface FormEditConfig {
  activeId?: string
  slideTransition?: 'next' | 'prev'
  userConfig?: FormUserConfig
}

export interface FormUserConfig {
  themeId?: string
  formName?: string
  description?: string
  cards?: CardConfig[]
  [key: string]: unknown
}

export type FormConfigData = Omit<FormConfig, 'userConfig'> & {
  userConfig?: string
}

export class Form extends FactorObject<FormConfig> {
  changeType: 'parent' | 'child' = 'parent'
  formId = this.settings.formId || this.utils.objectId()
  isDev = this.settings.isDev || false
  userConfig = this.utils.vue.ref(this.settings.userConfig || {})
  submissionData = this.utils.vue.ref(this.settings.submissionData || {})
  templateId = this.utils.vue.ref(this.settings.templateId || '')

  themeId = this.utils.vue.computed(() => this.userConfig.value.themeId)
  formName = this.utils.vue.computed(() => this.userConfig.value.formName)
  description = this.utils.vue.computed(() => this.userConfig.value.description)
  theme = this.utils.vue.computed(() => {
    const themeId = this.themeId.value || 'cardDeck'
    return allThemes.find(t => t.themeId === themeId) || allThemes[0]
  })

  el = this.theme.value.el(this)
  cards = this.utils.vue.computed(() => this.userConfig.value.cards || [])
  cardsFull = this.utils.vue.computed(() => {
    const fullCards
      = this.cards.value.map((c, i) => {
        const card = new Card(this, c, { depth: 0, index: i })

        return card
      }) || []

    return fullCards
  })

  cardRegions = this.utils.vue.computed<
    Record<'start' | 'body' | 'end', Card[] | undefined>
  >(() => {
    return this.utils.groupBy(
      this.cardsFull.value.filter(c => !c.fillCard),
      'region',
    )
  },
  )

  cardsList = this.utils.vue.computed(() => {
    return this.cardsFull.value.flatMap(c => [c, ...c.cardsFull.value])
  })

  filledCards = this.utils.vue.computed(() => {
    const li = this.cardsFull.value
    if (li.length > 0 && !li.some(c => c.region === 'end')) {
      li.push(
        new Card(
          this,
          {
            cardKey: 'endFill',
            cardId: 'endFill',
            fillCard: true,
            userConfig: { cardTypeKey: 'end', heading: 'All done! Thanks.' },
          },
          { depth: 0, index: 0 },
        ),
      )
    }

    return li
  })

  filledList = this.utils.vue.computed(() => {
    return this.filledCards.value.flatMap(c => [c, ...c.cardsFull.value])
  })

  percentComplete = this.utils.vue.computed(() => {
    const li = [...this.filledList.value]
    const current = li.findIndex(c => c.cardId === this.activeId.value)

    return Math.round(((current + 1) / li.length) * 100)
  })

  /**
   * Get list of all upcoming cards, useful for logic and next card
   */
  nextList = this.utils.vue.computed(() => {
    const li = [...this.filledList.value]
    const current = li.findIndex(c => c.cardId === this.activeCardId.value)

    // remove before and equal to current index
    li.splice(0, current + 2)

    return li.filter(c => !c.cardType.value.noNav)
  })

  flowList = this.utils.vue.computed(() => {
    const flow: Card[] = []
    let skipTo: string | undefined
    this.filledList.value.forEach((c) => {
      const userConfig = c.userConfig.value
      const logic = userConfig.logic
      const value = c.cardValue.value

      if (!skipTo && !c.noFlow.value) {
        flow.push(c)
        skipTo = getLogicResult({ logic, value })
      }
      else if (skipTo && this.isSkipToCard({ card: c, skipTo })) {
        flow.push(c)
        skipTo = getLogicResult({ logic, value })
      }
    })

    return flow
  })

  inputsList = this.utils.vue.computed(() => {
    return this.filledList.value.filter(
      c => c.handling === 'input' || c.handling === 'element',
    )
  })

  columns = this.utils.vue.computed(() => {
    return this.inputsList.value.map(item => item.cardName.value)
  })

  idList = this.utils.vue.computed(() => {
    return this.filledList.value.map(i => i.cardId)
  })

  activeIdIndex = this.utils.vue.computed(() => {
    return this.idList.value.indexOf(this.activeId.value)
  })

  slideTransition = this.utils.vue.ref<'prev' | 'next'>(
    this.settings.slideTransition || 'next',
  )

  loading?: boolean
  activeDrawer = this.utils.vue.ref('')
  activeId = this.utils.vue.ref(
    this.settings.activeId || this.filledList.value[0]?.cardId,
  )

  activeCardId = this.utils.vue.computed(() => {
    const defaultCard = this.cardsFull.value[0]?.cardId
    if (!this.activeId.value)
      return defaultCard

    const card = this.cardsFull.value.find(
      c =>
        c.cardId === this.activeId.value
        || c.cards.value.find(i => i.cardId === this.activeId.value),
    )

    return card ? card.cardId : defaultCard
  })

  activeCard = this.utils.vue.computed<Card | undefined>(() => {
    const card = this.cardsFull.value.find(
      c => c.cardId === this.activeCardId.value,
    )
    return card || this.cardsFull.value[0]
  })

  activeChildCardId = this.utils.vue.computed(() => {
    if (
      !this.activeId.value
      || this.activeCardId.value === this.activeId.value
    )
      return this.activeCard.value?.cards.value[0]?.cardId
    else
      return this.activeId.value
  })

  activeChildCard = this.utils.vue.computed<Card | undefined>(() => {
    const card = this.cardsList.value.find(
      c => c.cardId === this.activeChildCardId.value,
    )
    return card || this.activeCard.value?.cardsFull.value[0]
  })

  updatedAt?: string
  views?: number
  submissions?: number
  constructor(settings: FormConfig) {
    super('form', settings)

    this.utils.vue.watch(
      () => this.filledList.value,
      (v) => {
        if (v) {
          let cardNumber = 1
          v.forEach((c) => {
            if (!c.cardType.value.noNav) {
              c.cardNumber = cardNumber
              cardNumber++
            }
          })
        }
      },
      { immediate: true },
    )
  }

  isSkipToCard(args: { skipTo: string | 'end', card: Card }) {
    const { skipTo, card } = args
    if (
      skipTo === 'end'
      && card.cardId
      === this.cardsList.value[this.cardsList.value.length - 1].cardId
    )
      return true
    else if ([card.cardId, card.cardName.value].includes(skipTo))
      return true

    return false
  }

  /**
   * Update user settings/config
   * - useful for quick updating cuz it merges with userConfig
   */
  updateUserConfig(userConfig: Partial<FormUserConfig>) {
    this.userConfig.value = {
      ...this.userConfig.value,
      ...userConfig,
    }
  }

  /**
   * update the dynamic settings from form, requires full replacements
   */
  updateForm(config: Partial<FormEditConfig>) {
    const entries = Object.entries(config)
    entries.forEach(([key, value]) => {
      const k = key as keyof FormEditConfig
      if (value !== undefined && this.utils.vue.isRef(this[k]))
        this[k].value = value
    })
  }

  toConfig(): FormConfig {
    return {
      formId: this.formId,
      templateId: this.templateId.value,
      userConfig: {
        ...this.userConfig.value,
        cards: this.cardsFull.value
          .filter(c => !c.fillCard)
          .map(c => c.toConfig()),
      },
      activeId: this.activeId.value,
      slideTransition: this.slideTransition.value,
      isDev: this.isDev,
    }
  }

  setActiveDrawer(args: {
    cardId?: string
    mode?: 'toggle' | 'closeAll' | 'closeIfNewOrToggle'
    isNewCard?: boolean
  }) {
    const { cardId = '', mode = 'toggle', isNewCard = false } = args
    if (mode === 'closeIfNewOrToggle') {
      if (isNewCard) {
        this.activeDrawer.value = ''
      }
      else {
        this.activeDrawer.value
          = this.activeDrawer.value === cardId ? '' : cardId
      }
    }
    else if (mode === 'toggle') {
      this.activeDrawer.value = this.activeDrawer.value === cardId ? '' : cardId
    }
    else if (mode === 'closeAll') {
      this.activeDrawer.value = ''
    }
  }

  setActiveId(args: {
    cardId: string
    drawer: 'toggle' | 'closeAll' | 'closeIfNewOrToggle'
    scrollIntoView?: boolean
  }) {
    const { cardId, drawer, scrollIntoView } = args

    const newIndex = this.idList.value.indexOf(cardId)

    this.slideTransition.value
      = newIndex < this.activeIdIndex.value ? 'prev' : 'next'

    const isNewCard = this.activeId.value !== cardId

    this.activeId.value = cardId

    this.setActiveDrawer({ cardId, mode: drawer, isNewCard })

    if (scrollIntoView) {
      // wait for render in DOM
      setTimeout(() => {
        const sel = `[data-card-id='${cardId}']`
        const el = document.querySelector(sel)

        if (el)
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 25)
    }
  }

  nextCard(currentCardId: string) {
    this.slideTransition.value = 'next'
    const ind = this.flowList.value.findIndex(i => i.cardId === currentCardId)

    const nextCard = this.flowList.value[ind + 1]

    if (nextCard?.cardId)
      this.setActiveId({ cardId: nextCard?.cardId, drawer: 'toggle' })
  }

  getCardNumber(id: string) {
    const ind = this.filledList.value.findIndex(input => input.cardId === id)
    return ind >= 0 ? ind + 1 : ind
  }

  mergeByIdOrAppend(list: CardConfig[], newCard: CardConfig) {
    const ind = list.findIndex(c => c.cardId === newCard.cardId)
    if (ind >= 0)
      list[ind] = newCard
    else
      list.push(newCard)

    return list
  }

  async addNewElement(elementKey: string) {
    const cardType = this.theme.value.cardTypes.find(t => t.key === elementKey)

    if (!cardType)
      throw new Error(`element type ${elementKey} not found`)

    await cardType.onAdd({ form: this, cardType })

    this.log.info('addNew', { data: { cardType } })
  }

  deleteById(ids: string[]) {
    if (!confirm('Are you sure?'))
      return

    const newCards = this.cards.value
      .filter(c => c.cardId && !ids.includes(c.cardId))
      .map((c) => {
        c.userConfig = {
          ...c.userConfig,
          cards: c.userConfig?.cards?.filter(
            i => i.cardId && !ids.includes(i.cardId),
          ),
        }

        return c
      })

    // get before update
    const activeId = this.activeId.value

    this.updateUserConfig({ cards: newCards })
    if (activeId && ids.includes(activeId)) {
      this.setActiveId({
        cardId: newCards[0]?.cardId || '',
        drawer: 'closeAll',
      })
    }
  }

  updateChildField(args: {
    cardId: string
    field: string
    value: UserConfigVal
  }) {
    this.cardsFull.value.forEach((card) => {
      const input = card.cardsFull.value.find(
        input => input.cardId === args.cardId,
      )

      if (input)
        card.updateChildField(args)
    })
  }

  updateCard(args: {
    selector: string
    cardValue?: CardValue
    userConfig?: Partial<CardUserConfig>
  }) {
    const { selector, cardValue, userConfig } = args
    const found = this.cardsList.value.find(card =>
      [card.cardId, card.cardName.value].includes(selector),
    )

    if (found) {
      if (cardValue)
        found.cardValue.value = cardValue
      if (userConfig)
        found.updateUserConfig(userConfig)
    }
  }

  updateFormLayout(args: { layoutZoneClass: string }) {
    const { layoutZoneClass } = args

    const zone = document.querySelector(`.${layoutZoneClass}`)
    if (!zone)
      return

    const newCards: CardConfig[] = []
    zone.querySelectorAll('[data-card-depth=\'0\']').forEach((el) => {
      const cardElement = el as HTMLElement
      const cardId = cardElement.dataset.cardId
      const card = this.cardsFull.value.find(card => card.cardId === cardId)

      if (card) {
        const newChildCards: CardConfig[] = []
        cardElement.querySelectorAll('[data-card-depth=\'1\']').forEach((el2) => {
          const inputElement = el2 as HTMLElement
          const cardId = inputElement.dataset.cardId
          const theCard = this.inputsList.value.find(
            input => input.cardId === cardId,
          )
          if (theCard)
            newChildCards.push(theCard.toConfig())
        })

        card.updateUserConfig({ cards: newChildCards })

        newCards.push(card.toConfig())
      }
    })

    this.updateUserConfig({ cards: newCards })
  }
}

export const templates = [
  new Form({
    templateId: 'scratch',
    userConfig: {
      formName: 'Kaption Form',
      cards: [
        {
          userConfig: {
            cardTypeKey: 'group',
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'multipleChoice',
                  choices: 'Item',
                },
              },
            ],
          },
        },
      ],
    },
  }),

  new Form({
    templateId: 'nps',
    userConfig: {
      formName: 'Measure Net Promoter Score (NPS)',
      description:
        'This measures Net Promoter Score by asking users how likely they are to recommend your product.',
      cards: [
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'netPromotorScore',
                  question:
                    'How likely are you to recommend [project] to a friend or colleague?',
                  labelHighest: 'Not at all likely',
                  labelLowest: 'Extremely likely',
                },
              },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question: 'What made you you give that rating?',
                },
              },
            ],
          },
        },
      ],
    },
  }),
  new Form({
    templateId: 'marketFit',
    userConfig: {
      formName: 'Find Market Fit',
      description:
        'This measures your ability to uniquely meet customer needs and surfaces opportunities to increase traction.',
      cards: [
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'multipleChoice',
                  question:
                    'How disappointed would you be if you could no longer use {{projectName}}?',
                  aside: 'This will help us improve your experience.',
                  choices: [
                    'Very disappointed',
                    'Somewhat disappointed',
                    'Not disappointed',
                  ].join(`\n`),
                  randomize: true,
                },
              },
            ],
            logic: [
              { operator: '==', value: 'Very disappointed', skipTo: 'done' },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'How could {{projectName}} be improved to better meet your needs?',
                },
              },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'What are the primary benefits you receive from {{projectName}}?',
                },
              },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'Who do you think would get the most benefit from {{projectName}}?',
                },
              },
            ],
          },
        },
      ],
    },
  }),
  new Form({
    templateId: 'ces',
    userConfig: {
      formName: 'Measure Customer Effort Score (CES)',
      description:
        'This measures the perceived effort for customers to accomplish their goals for using your product.',
      cards: [
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'rating',
                  question: '{{projectName}} makes it easy for me to [task].',
                  labelHighest: 'Strongly Agree',
                  labelLowest: 'Strongly Disagree',
                },
              },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question: 'How could [project] make it easier to [task]?',
                },
              },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'Who do you think would get the most benefit from {{projectName}}?',
                },
              },
            ],
          },
        },
      ],
    },
  }),
  new Form({
    templateId: 'csat',
    userConfig: {
      formName: 'Measure Customer Satisfaction (CSAT)',
      description: 'This helps you gauge customer satisfaction.',
      cards: [
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'rating',
                  question:
                    'How satisfied are you with your experience with [project]?',
                  labelHighest: 'Not at all satisfied',
                  labelLowest: 'Extremely satisfied',
                },
              },
            ],
            logic: [{ operator: '<=', value: 3, skipTo: 'improved' }],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'Awesome. Is there anything that could improve your experience?',
                },
              },
            ],
            logic: [{ operator: '>=', skipTo: 'end' }],
          },
        },
        {
          cardKey: 'improved',
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question: 'Dang. How could your experience be improved?',
                },
              },
            ],
          },
        },
      ],
    },
  }),
  new Form({
    templateId: 'productValue',
    userConfig: {
      formName: 'Measure Product Value',
      description: 'This helps you gauge customer satisfaction.',
      cards: [
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'rating',
                  question: 'How valuable to you is [project]?',
                  labelHighest: 'Not at all valuable',
                  labelLowest: 'Extremely valuable',
                },
              },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question: 'What would make [project] more valuable to you?',
                },
              },
            ],
          },
        },
      ],
    },
  }),
  new Form({
    templateId: 'satisfaction',
    userConfig: {
      formName: 'Measure Subscriber Satisfaction',
      description: 'This helps you gauge customer satisfaction.',
      cards: [
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'rating',
                  question:
                    'How satisfied are you with your Super subscription?',
                  labelHighest: 'Not at all satisfied',
                  labelLowest: 'Extremely satisfied',
                },
              },
            ],
            logic: [
              {
                operator: '<=',
                value: 3,
                skipTo: 'badResponseReason',
              },
              { operator: '>=', value: 4, skipTo: 'improve' },
            ],
          },
        },
        {
          cardKey: 'badResponseReason',
          userConfig: {
            noFlow: true,
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'Sorry to hear that! Please tell us what you aren\'t satisfied with so we can improve.',
                },
              },
            ],
          },
        },
        {
          cardKey: 'improve',
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'Is there anything we could do to improve your experience?',
                },
              },
            ],
          },
        },
      ],
    },
  }),
  new Form({
    templateId: 'usageIntent',
    userConfig: {
      formName: 'Measure Usage Intent',
      description: 'Understand how users plan to use your product or service',
      cards: [
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'rating',
                  question:
                    'How likely are you to continue using [project] for the next 3 months?',
                  labelHighest: 'Not at all likely',
                  labelLowest: 'Extremely likely',
                },
              },
            ],
            logic: [
              {
                operator: '<=',
                value: 2,
                skipTo: 'noIntentReason',
              },
            ],
          },
        },
        {
          userConfig: {
            cards: [
              {
                userConfig: {
                  cardTypeKey: 'shortText',
                  question:
                    'Is there anything that might hold you back from continuing to use {{project}}?',
                },
              },
            ],
            logic: [{ operator: '>=', skipTo: 'end' }],
          },
        },
        {
          cardKey: 'noIntentReason',
          userConfig: {
            cards: [
              {
                userConfig: {
                  noFlow: true,
                  cardTypeKey: 'shortText',
                  question:
                    'Ok. Could you let us know why you don\'t plan to continue using {{project}}?',
                },
              },
            ],
          },
        },
      ],
    },
  }),
]
