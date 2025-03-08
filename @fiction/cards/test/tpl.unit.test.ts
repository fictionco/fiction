import { CardFactory } from '@fiction/site/cardFactory'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { refineOptions } from '@fiction/site/utils/optionSchema'
import { describe, expect, it } from 'vitest'
import { getCardTemplates, getDemoPages } from '..'

describe('verify template settings config', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  const templates = await getCardTemplates()

  it('has template options set correctly', async () => {
    const factory = new CardFactory({ site, templates, caller: 'verifyTemplateSettings' })
    const demoPages = await getDemoPages({ templates, site, factory })

    const templatesOptionConfigPromises = templates.map(async (_) => {
      const config = await _.getConfig({ site })
      const { schema, options = [] } = config
      const conf = await refineOptions({ options, schema, templateId: _.settings.templateId })
      return {
        templateId: _.settings.templateId,
        unusedSchema: conf.unusedSchema,
        isPublic: _.settings.isPublic,
        hasDemo: !!(config.demoPage || demoPages.some(d => d.slug === `card-${_.settings.templateId}`)),
      }
    })

    const templatesOptionConfig = await Promise.all(templatesOptionConfigPromises)

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot(`
      [
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardHeroV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardProfileV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardStoryV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardFeaturesV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardStatementSliderV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardBentoV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardPeopleV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardTestimonialsV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardQuotesV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardMetricsV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardLogosV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardShowcaseGalleryV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardPostsListV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardPostsMagazineV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "cardInstaV1",
          "unusedSchema": {
            "account.isGridView": "boolean",
            "header.showBio": "boolean",
            "header.showFollowers": "boolean",
            "header.showPostCount": "boolean",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardStepsV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardFaqV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardTimelineV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardCinemaSliderV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardPhotoGalleryV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardModalMediaV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardTourV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardCtaV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardCaptureV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardContactV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardPricingV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardMapsV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "cardPageWrapV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardPageAreaV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardSiteNavV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardFooterProV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardFooterPersonalV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardMarqueeV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardOverlaySliderV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardTickerV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "CardParallaxScrollV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardResponsiveTextV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "cardShapeEffectV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cardTextEffectV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "card404ErrorV1",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "cardTransactionViewV1",
          "unusedSchema": undefined,
        },
      ]
    `)

    const undefinedSchema = templatesOptionConfig.filter(_ => typeof _.unusedSchema === 'undefined' && _.isPublic).map(_ => _.templateId)

    expect(undefinedSchema, 'undefined schema').toStrictEqual([])

    const incompleteSchema = templatesOptionConfig.filter(_ => (Object.keys(_.unusedSchema || {}).length > 0 && _.isPublic)).map(_ => _.templateId)

    expect(incompleteSchema, 'no unused schema in public cards').toStrictEqual([])

    const incompletePublic = templatesOptionConfig.filter(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false ? _.templateId : undefined)).map(_ => _.templateId)

    expect(incompletePublic, 'incomplete public cards').toMatchInlineSnapshot(`[]`)
    expect(incompletePublic).toStrictEqual([])
  })
})
