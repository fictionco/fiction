import { FictionObject, vue } from '@fiction/core'

import type { CardConfigPortable, Site } from '@fiction/site'
import { Card } from '@fiction/site'
import { CardFactory } from '@fiction/site/cardFactory'
import type { FormConfig, FormTableConfig } from './schema'
import { getCardTemplates } from './templates'

export class Form extends FictionObject<FormConfig> {
  cards = vue.computed(() => this.settings.card.cards.value || [])
  formMode = vue.ref(this.settings.formMode || 'standard')
  slideTransition = vue.ref<'prev' | 'next'>('next')
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

  activeCardIndex = vue.computed({
    get: () => {
      const itemId = this.settings.card.site?.siteRouter?.params.value.itemId as string

      return itemId && itemId.includes('item-') ? Number.parseInt(itemId.replace('item-', '')) : 0
    },
    set: (val: number) => {
      const itemId = `item-${val}`
      this.settings.card.site?.siteRouter?.push({ params: { viewId: '_', itemId } }, { caller: 'Form.activeCardIndex' })
    },
  })

  activeCard = vue.computed(() => this.cards.value[this.activeCardIndex.value])

  percentComplete = vue.computed(() => {
    const cards = this.cards.value
    const current = this.activeCardIndex.value

    return current > -1 ? Math.round(((current + 1) / cards.length) * 100) : 0
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
              templateId: 'inputTextShort',
              userConfig: {
                title: 'Contact Form',
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
