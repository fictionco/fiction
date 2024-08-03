import { FictionObject, getNested, path, setNested, vue } from '@fiction/core'

import type { CardConfigPortable, Site } from '@fiction/site'
import { Card } from '@fiction/site'
import { CardFactory } from '@fiction/site/cardFactory'
import type { FormConfig, FormTableConfig } from './schema'
import { type InputUserConfig, getCardTemplates } from './templates'

export class Form extends FictionObject<FormConfig> {
  cards = vue.computed(() => (this.settings.card.cards.value || []) as Card<InputUserConfig>[])
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

  constructor(settings: FormConfig) {
    super('Form', settings)
  }

  static async load(args: { formId?: string, formTemplateId?: string, site: Site }): Promise<Form> {
    const { formId, formTemplateId, site } = args

    let cardConfig: CardConfigPortable = { }
    const templates = await getCardTemplates()
    if (formTemplateId) {
      const formTemplates = await getFormTemplates({ site })
      const formTemplate = formTemplates.find(t => t.settings.formTemplateId === formTemplateId)

      if (!formTemplate)
        throw new Error(`Form template not found: ${formTemplateId}`)

      cardConfig = await formTemplate.settings.getCardConfig({ site })
    }

    const card = new Card({ site, templates, title: 'FormCard', templateId: 'formWrap', ...cardConfig })

    return new Form({ formId: formId || `static-${formTemplateId}`, card })
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

  toConfig(): FormTableConfig {
    const cardConfig = this.settings.card.toConfig()
    return { formId: this.settings.formId, cardConfig }
  }
}

type FormTemplateConfig = FormTableConfig & {
  formTemplateId: string
  getCardConfig: (args: { site: Site }) => Promise<CardConfigPortable>

}

export class FormTemplate extends FictionObject<FormTemplateConfig> {
  constructor(settings: FormTemplateConfig) {
    super('FormTemplate', settings)
  }
}

export async function getFormTemplates(args: { site: Site }) {
  const { site } = args

  if (!site)
    throw new Error('Card must have a site to get form templates')

  const factory = new CardFactory({ site, templates: await getCardTemplates() })
  return [
    new FormTemplate({
      formTemplateId: 'contact',
      title: 'Contact Form',
      getCardConfig: async () => {
        return {
          cards: [
            await factory.create({
              templateId: 'formStart',
              userConfig: {
                title: 'Contact Form',
                subTitle: 'Need to reach us? Just fill out the form below.',
                buttonText: 'Start',
              },
            }),
            await factory.create({
              templateId: 'inputTextShort',
              userConfig: {
                path: 'name',
                title: `What's your name?`,
                subTitle: 'What should we call you?',
                placeholder: 'Name',
                isRequired: true,
              },
            }),
            await factory.create({
              templateId: 'inputEmail',
              userConfig: {
                path: 'email',
                title: 'What\'s your email address?',
                subTitle: 'We\'ll use this to get back to you.',
                placeholder: 'email@example.com',
                isRequired: true,
              },
            }),
            await factory.create({
              templateId: 'inputTextLong',
              userConfig: {
                path: 'message',
                title: 'How can we help you?',
                subTitle: 'Please provide details about your inquiry.',
                placeholder: 'Type your message here...',
                isRequired: true,
              },
            }),
            await factory.create({
              templateId: 'formEnd',
              userConfig: {
                title: 'Thank you!',
                subTitle: 'We\'ve received your message and will get back to you soon.',
              },
            }),
          ],
        }
      },
    }),
  ]
}
