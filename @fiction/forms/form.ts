import { FictionObject, getNested, setNested, vue } from '@fiction/core'

import type { CardTemplate, Site } from '@fiction/site'
import { Card } from '@fiction/site'
import type { FormConfigPortable } from './schema'
import type { InputUserConfig } from './templates'
import type { FictionForms } from '.'

export type FormSettings = FormConfigPortable & {
  site?: Site
  templates?: CardTemplate[] | readonly CardTemplate[]
  formMode?: 'standard' | 'designer' | 'editable' | 'coding'
  fictionForms: FictionForms
}
export class Form extends FictionObject<FormSettings> {
  card = vue.computed(() => {
    const { site, templates, card } = this.settings
    return new Card({ site, templates, title: 'FormCard', templateId: 'formWrap', ...card })
  })

  cards = vue.computed(() => (this.card.value.cards.value || []) as Card<InputUserConfig>[])
  inputCards = vue.computed(() => this.cards.value.filter(c => c.userConfig.value.cardType === 'input' || !c.userConfig.value.cardType))
  endCards = vue.computed(() => this.cards.value.filter(c => c.userConfig.value.cardType === 'end'))
  formMode = vue.ref(this.settings.formMode || 'standard')
  slideTransition = vue.ref<'prev' | 'next'>('next')
  formValues = vue.ref({})
  isSubmitted = vue.computed(() => this.endCards.value.find(c => c.cardId === this.activeCardId.value))
  activeCardIdControl = vue.ref()
  activeCardId = vue.computed({
    get: () => this.activeCardIdControl.value || this.inputCards.value[0]?.cardId,
    set: val => (this.activeCardIdControl.value = val),
  })

  activeCardIndex = vue.computed({
    get: () => this.cards.value.findIndex(c => c.cardId === this.activeCardId.value),
    set: val => (this.activeCardId.value = this.cards.value[val]?.cardId),
  })

  isLastCard = vue.computed(() => this.activeCardId.value === this.cards.value[this.cards.value.length - 1]?.cardId)
  isSubmitCard = vue.computed(() => this.activeCardId.value === this.inputCards.value[this.inputCards.value.length - 1]?.cardId)

  constructor(settings: FormSettings) {
    super('Form', settings)
  }

  activeCard = vue.computed(() => this.cards.value.find(c => c.cardId === this.activeCardId.value))

  percentComplete = vue.computed(() => {
    if (this.isSubmitted.value)
      return 100

    const currentCardId = this.activeCardId.value
    const totalInputCards = this.inputCards.value.length
    const current = this.inputCards.value.findIndex(c => c.cardId === currentCardId)

    if (current === -1 || totalInputCards === 0)
      return 0

    return Math.min(100, Math.round(((current + 1) / totalInputCards) * 100))
  })

  async nextCard() {
    this.slideTransition.value = 'next'
    const ind = this.activeCardIndex.value

    const nextCard = this.cards.value[ind + 1]

    if (nextCard?.cardId)
      this.setActiveId({ cardId: nextCard?.cardId, drawer: 'toggle' })
  }

  async setActiveId(args: {
    cardId: string
    drawer: 'toggle' | 'closeAll' | 'closeIfNewOrToggle'
    scrollIntoView?: boolean
  }) {
    const { cardId, drawer, scrollIntoView } = args

    const newIndex = this.cards.value.findIndex(c => c.cardId === cardId)

    this.slideTransition.value = newIndex < this.activeCardIndex.value ? 'prev' : 'next'

    const isNewCard = this.activeCard.value?.cardId !== cardId

    this.activeCardIndex.value = newIndex

    // this.setActiveDrawer({ cardId, mode: drawer, isNewCard })

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

  setFormValue(args: { path?: string, value?: any }) {
    const { path, value } = args
    if (!path)
      return

    this.formValues.value = setNested({ data: this.formValues.value, path, value })
  }

  getFormValue(args: { path?: string }) {
    const { path } = args
    if (!path)
      return undefined

    return getNested({ data: this.formValues.value, path })
  }

  clearFormValue(path: string) {
    this.formValues.value = setNested({ data: this.formValues.value, path, value: undefined })
  }

  getAllFormValues(): Record<string, any> {
    return JSON.parse(JSON.stringify(this.formValues.value))
  }

  clearAllFormValues() {
    this.formValues.value = {}
  }

  toConfig(): FormConfigPortable {
    const card = this.card.value.toConfig()
    return { formId: this.settings.formId, card }
  }
}
