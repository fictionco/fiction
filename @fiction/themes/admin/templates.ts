import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'

import { standardCardTemplates } from '@fiction/cards'

const def = vue.defineAsyncComponent

export const templates = [
  new CardTemplate({
    templateId: 'sites',
    el: def(() => import('@fiction/site/plugin-builder/ViewIndex.vue')),
  }),
  ...standardCardTemplates,
] as const
