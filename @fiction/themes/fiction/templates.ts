import { getCardTemplates } from '@fiction/cards'
import { getUiDemoCardTemplates } from '@fiction/cards/index.js'

export async function getWebsiteTemplates() {
  const [baseTemplates, uiDemoTemplates] = await Promise.all([
    getCardTemplates(),
    getUiDemoCardTemplates(),
  ])
  return [
    ...baseTemplates,
    ...uiDemoTemplates,
  ]
}
