import { marketingCardTemplates, standardCardTemplates } from '@fiction/cards/index.js'

export const templates = [
  ...standardCardTemplates,
  ...marketingCardTemplates,
] as const
