// @unocss-include

import { standardCardTemplates } from '@fiction/site/cards'
import { templates as templatesMinimalHeader } from './cards/minimal-header'
import { templates as templatesMinimalFooter } from './cards/minimal-footer'
import { templates as templatesMinimalProfile } from './cards/minimal-profile'

export const templates = [
  ...standardCardTemplates,
  ...templatesMinimalHeader,
  ...templatesMinimalFooter,
  ...templatesMinimalProfile,
] as const
