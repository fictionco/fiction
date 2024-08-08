import { FictionObject, getNested, path, setNested, vue } from '@fiction/core'

import type { CardTemplate, Site } from '@fiction/site'
import { Card } from '@fiction/site'
import type { FormConfigPortable } from './schema'
import type { InputUserConfig } from './templates'
import type { FictionForms } from '.'

export type FormSettings = FormConfigPortable & {
  templates?: CardTemplate[] | readonly CardTemplate[]
  formMode?: 'standard' | 'designer' | 'editable' | 'coding'
  site?: Site
  fictionForms: FictionForms
  formTemplateId?: string
  orgId: string
}
export class Form extends FictionObject<FormSettings> {
  card = vue.computed(() => {
    const { site, templates, card, title } = this.settings
    return new Card({ site, templates, title, templateId: 'formWrap', ...card })
  })

  cards = vue.computed(() => (this.card.value.cards.value || []) as Card<InputUserConfig>[])
  inputCards = vue.computed(() => this.cards.value.filter(c => c.userConfig.value.cardType === 'input' || !c.userConfig.value.cardType))
  endCards = vue.computed(() => this.cards.value.filter(c => c.userConfig.value.cardType === 'end'))
  formMode = vue.ref(this.settings.formMode || 'standard')
  slideTransition = vue.ref<'prev' | 'next'>('next')
  submittedData = vue.ref()
  activeCardIdControl = vue.ref()
  activeCardId = vue.computed({
    get: () => this.activeCardIdControl.value || this.inputCards.value[0]?.cardId,
    set: val => (this.activeCardIdControl.value = val),
  })

  activeCardIndex = vue.computed({
    get: () => this.cards.value.findIndex(c => c.cardId === this.activeCardId.value),
    set: val => (this.activeCardId.value = this.cards.value[val]?.cardId),
  })

  isLoading = vue.ref(false)
  isLastCard = vue.computed(() => this.activeCardId.value === this.cards.value[this.cards.value.length - 1]?.cardId)
  isSubmitCard = vue.computed(() => this.activeCardId.value === this.inputCards.value[this.inputCards.value.length - 1]?.cardId)

  constructor(settings: FormSettings) {
    super('Form', settings)
  }

  activeCard = vue.computed(() => this.cards.value.find(c => c.cardId === this.activeCardId.value))

  percentComplete = vue.computed(() => {
    if (this.submittedData.value)
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

    if (this.isSubmitCard.value) {
      await this.submitForm()
    }

    if (nextCard?.cardId)
      this.setActiveId({ cardId: nextCard?.cardId, drawer: 'toggle' })
  }

  async setActiveId(args: {
    cardId: string
    drawer: 'toggle' | 'closeAll' | 'closeIfNewOrToggle'
    scrollIntoView?: boolean
  }) {
    const { cardId, scrollIntoView } = args

    const newIndex = this.cards.value.findIndex(c => c.cardId === cardId)

    this.slideTransition.value = newIndex < this.activeCardIndex.value ? 'prev' : 'next'

    this.activeCardIndex.value = newIndex

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

  setUserValue(args: { value?: any, cardId?: string }) {
    const { value, cardId } = args

    const c = this.cards.value.find(c => c.cardId === cardId) || this.activeCard.value

    if (!c) {
      throw new Error(`setUserValue: card not found`)
    }

    c.updateUserConfig({ path: 'userValue', value })
  }

  getUserValue(args: { cardId?: string }) {
    const { cardId } = args

    const c = this.cards.value.find(c => c.cardId === cardId) || this.activeCard.value

    if (!c) {
      throw new Error(`getUserValue: card not found`)
    }

    return getNested({ data: c.userConfig.value, path: 'userValue' })
  }

  clearFormValue(cardId?: string) {
    this.setUserValue({ value: undefined, cardId })
  }

  formValues = vue.computed(() => {
    return Object.fromEntries(this.cards.value.map((c) => {
      const key = c.userConfig.value.key || c.title.value
      const value = getNested({ data: c.userConfig.value, path: 'userValue' })

      return [key, value]
    }))
  })

  clearAllFormValues() {
    this.cards.value.forEach((c) => {
      c.updateUserConfig({ path: 'userValue', value: undefined })
    })
  }

  toConfig(): FormConfigPortable {
    const card = this.card.value.toConfig()
    return { formId: this.settings.formId, card }
  }

  async submitForm() {
    this.isLoading.value = true

    try {
      const orgId = this.settings.orgId

      if (!orgId) {
        throw new Error('submitForm: orgId is required')
      }
      const { formId, formTemplateId } = this.settings
      const r = await this.settings.fictionForms.requests.ManageSubmission.request({
        _action: 'create',
        orgId,
        fields: {
          formId,
          formTemplateId,
          card: this.card.value.toConfig(),
          userValues: this.formValues.value,
        },
      })

      if (r.status === 'success') {
        this.submittedData.value = r.data?.[0]
      }

      return r
    }
    catch (err) {
      console.error('submitForm error', err)
      throw err
    }
    finally {
      this.isLoading.value = false
    }
  }
}
