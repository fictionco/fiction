import { standardCardTemplates } from '@fiction/cards'
import { templates as templatesMinimalHeader } from './cards/minimal-header/index.js'
import { templates as templatesMinimalFooter } from './cards/minimal-footer/index.js'

export const templates = [
  ...standardCardTemplates,
  ...templatesMinimalHeader,
  ...templatesMinimalFooter,
] as const
