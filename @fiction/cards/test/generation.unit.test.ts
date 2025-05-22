import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import type { InputOptionGeneration } from '../../site/utils/generation'
import { shortId } from '@fiction/core'
import { Card, Site } from '@fiction/site'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
// import { calculateTotalEstimatedTimeSeconds, generateJsonPropConfig, generateOutputProps, parseDescription, simulateProgress } from '@fiction/site/utils/generation'
import { describe, expect, it, vi } from 'vitest'
import zodToJsonSchema from 'zod-to-json-schema'
import { getCardTemplates } from '../index'

describe('generation utils', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await Site.create({ fictionSites: testUtils.fictionSites, siteId: `test-${shortId()}` })
  const pageTemplates = site.theme.value?.getPageTemplates?.()
  const landingPageTemplate = pageTemplates?.find(t => t.pageTemplateId === 'landing')
  const cards = await landingPageTemplate?.getCards({ site })

  const heroCard = new Card({ site, templateId: 'cardHeroV1' })
  const heroCardConfig = await heroCard.tpl.value?.getConfig?.({ site })
  const zodSchema = heroCardConfig?.schema
  if (!zodSchema)
    throw new Error('No schema found')
})
