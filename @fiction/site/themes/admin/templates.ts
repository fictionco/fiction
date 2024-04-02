import { vue } from '@fiction/core'
import { CardTemplate } from '../../card'

import { standardCardTemplates } from '../../cards'

const def = vue.defineAsyncComponent

export const templates = [
  new CardTemplate({
    templateId: 'sites',
    el: def(() => import('../../el/ViewIndex.vue')),
  }),
  ...standardCardTemplates,
] as const
