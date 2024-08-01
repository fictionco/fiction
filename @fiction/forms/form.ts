import { FictionObject, vue } from '@fiction/core'

import type { Card, CardConfigPortable, Site } from '@fiction/site'
import { CardFactory } from '@fiction/site/cardFactory'
import type { FormConfig, FormTableConfig } from './schema'
import { getTemplates } from './templates'

export class Form extends FictionObject<FormConfig> {
  cards = vue.computed(() => this.settings.card.cards.value || [])
  formMode = vue.ref(this.settings.formMode || 'standard')
  slideTransition = vue.ref<'prev' | 'next'>('next')
  constructor(settings: FormConfig) {
    super('Form', settings)
  }

  static async load(args: { formId?: string, formTemplateId?: string, card: Card }): Promise<Form> {
    const { formId, formTemplateId, card } = args

    if (formTemplateId) {
      const templates = await getFormTemplates({ card })
      const template = templates.find(t => t.settings.formTemplateId === formTemplateId)

      if (!template)
        throw new Error(`Form template not found: ${formTemplateId}`)

      const site = card.site

      if (!site)
        throw new Error('Card must have a site to create form')

      const cardConfig = await template.settings.getCardConfig({ site })

      card.update(cardConfig)
    }

    return new Form({ formId: formId || `static-${formTemplateId}`, card })
  }

  activeCardId = vue.computed({
    get: () => (this.settings.card.site?.siteRouter?.params.value.itemId as string) || this.cards.value[0]?.cardId,
    set: async (val: string) => {
      if (this.settings.card.site?.siteRouter?.params.value.itemId !== val)
        await this.settings.card.site?.siteRouter?.push({ params: { itemId: val } }, { caller: 'Form.activeCardId' })
    },
  })

  activeIdIndex = vue.computed(() => this.cards.value.findIndex(c => c.cardId === this.activeCardId.value))
  activeCard = vue.computed(() => this.cards.value.find(c => c.cardId === this.activeCardId.value))

  percentComplete = vue.computed(() => {
    const cards = this.cards.value
    const current = cards.findIndex(c => c.cardId === this.activeCardId.value)

    return current > -1 ? Math.round(((current + 1) / cards.length) * 100) : 0
  })

  async nextCard() {
    this.slideTransition.value = 'next'
    const ind = this.cards.value.findIndex(i => i.cardId === this.activeCardId.value)

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

    this.slideTransition.value = newIndex < this.activeIdIndex.value ? 'prev' : 'next'

    const isNewCard = this.activeCardId.value !== cardId

    this.activeCardId.value = cardId

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

export async function getFormTemplates(args: { card: Card }) {
  const { card } = args

  const site = card.site

  if (!site)
    throw new Error('Card must have a site to get form templates')

  const factory = new CardFactory({ site, templates: await getTemplates() })
  return [
    new FormTemplate({
      formTemplateId: 'contact',
      title: 'Contact Form',
      getCardConfig: async () => {
        return {
          cards: [
            await factory.create({
              templateId: 'inputTextShort',
              userConfig: {
                title: 'Get in Touch',
                subTitle: 'Need to reach us? Just fill out the form below.',
                buttonText: 'Start',
              },
            }),
            await factory.create({
              templateId: 'inputTextShort',
              userConfig: {
                title: `What's your name?`,
                subTitle: 'What should we call you?',
                placeholder: 'Name',
              },
            }),
          ],
        }
      },
    }),
  ]
}
