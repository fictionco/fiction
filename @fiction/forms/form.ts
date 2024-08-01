import { FictionObject, vue } from '@fiction/core'

import type { Site } from '@fiction/site'
import type { FormConfig, FormTableConfig } from './schema'

export class Form extends FictionObject<FormConfig> {
  site = this.settings.site
  cards = vue.computed(() => this.site.pages.value || [])
  formMode = vue.ref(this.settings.formMode || 'standard')
  slideTransition = vue.ref<'prev' | 'next'>('next')
  constructor(settings: FormConfig) {
    super('Form', settings)
  }

  static async load(args: { formId?: string, formTemplateId?: string, site: Site }): Promise<Form> {
    const { formId, site } = args
    const form = new Form({ formId, site })

    return form
  }

  activeCardId = vue.computed(() => {
    const site = this.settings.site
    const siteRouter = site?.siteRouter
    const routeCardId = siteRouter?.current.value.params.viewId || this.cards.value[0].cardId
    return routeCardId
  })

  activeCard = vue.computed(() => {
    const cardId = this.activeCardId.value
    return this.cards.value.find(c => c.cardId === cardId)
  })

  percentComplete = vue.computed(() => {
    const cards = this.cards.value
    const current = cards.findIndex(c => c.cardId === this.activeCardId.value)

    return current > -1 ? Math.round(((current + 1) / cards.length) * 100) : 0
  })

  navigate(args: { _action: 'next' }) {

  }

  toConfig(): FormTableConfig {
    const siteConfig = this.settings.site.toConfig()
    return { formId: this.settings.formId, cards: siteConfig.pages }
  }
}
