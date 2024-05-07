import { standardCardTemplates } from '@fiction/cards'
import { templates as templatesMinimalHeader } from './cards/minimal-header'
import { templates as templatesMinimalFooter } from './cards/minimal-footer'

export const templates = [
  ...standardCardTemplates,
  ...templatesMinimalHeader,
  ...templatesMinimalFooter,
] as const
