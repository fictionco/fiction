import { CardFactory } from '@fiction/site/cardFactory'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { getCardTemplates, getDemoPages } from '..'

describe('verify template settings config', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  const templates = await getCardTemplates({ caller: 'testTemplateSettings' })

  it('has template options set correctly', async () => {
    const factory = new CardFactory({ site, templates, caller: 'verifyTemplateSettings' })
    const demoPages = await getDemoPages({ templates, site, factory })

    const templatesOptionConfigPromises = templates.map(async (_) => {
      const config = await _.getConfig({ site })
      const { schema, options = [] } = config
      return {
        templateId: _.settings.templateId,
      }
    })

    const templatesOptionConfig = await Promise.all(templatesOptionConfigPromises)

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot(`
      [
        {
          "templateId": "cardHeroV1",
        },
        {
          "templateId": "cardProfileV1",
        },
        {
          "templateId": "cardStoryV1",
        },
        {
          "templateId": "cardFeaturesV1",
        },
        {
          "templateId": "cardBentoV1",
        },
        {
          "templateId": "cardPeopleV1",
        },
        {
          "templateId": "cardTestimonialsV1",
        },
        {
          "templateId": "cardQuotesV1",
        },
        {
          "templateId": "cardMetricsV1",
        },
        {
          "templateId": "cardLogosV1",
        },
        {
          "templateId": "cardShowcaseGalleryV1",
        },
        {
          "templateId": "cardPostsListV1",
        },
        {
          "templateId": "cardBlogV1",
        },
        {
          "templateId": "cardSinglePostV1",
        },
        {
          "templateId": "cardStepsV1",
        },
        {
          "templateId": "cardFaqV1",
        },
        {
          "templateId": "cardTimelineV1",
        },
        {
          "templateId": "cardPhotoGalleryV1",
        },
        {
          "templateId": "cardModalMediaV1",
        },
        {
          "templateId": "cardCaptureV1",
        },
        {
          "templateId": "cardPricingV1",
        },
        {
          "templateId": "cardMapsV1",
        },
        {
          "templateId": "cardPageWrapV1",
        },
        {
          "templateId": "cardPageAreaV1",
        },
        {
          "templateId": "cardSiteNavV1",
        },
        {
          "templateId": "cardFooterProV1",
        },
        {
          "templateId": "cardStandardFooterV1",
        },
        {
          "templateId": "cardMarqueeV1",
        },
        {
          "templateId": "cardOverlaySliderV1",
        },
        {
          "templateId": "cardTickerV1",
        },
        {
          "templateId": "CardParallaxScrollV1",
        },
        {
          "templateId": "cardResponsiveTextV1",
        },
        {
          "templateId": "cardTextEffectV1",
        },
        {
          "templateId": "card404ErrorV1",
        },
        {
          "templateId": "cardTransactionViewV1",
        },
        {
          "templateId": "cardManageContactV1",
        },
      ]
    `)

    // const undefinedSchema = templatesOptionConfig.filter(_ => typeof _.unusedSchema === 'undefined' && _.isPublic).map(_ => _.templateId)

    // expect(undefinedSchema, 'undefined schema').toStrictEqual([])

    // const incompleteSchema = templatesOptionConfig.filter(_ => (Object.keys(_.unusedSchema || {}).length > 0 && _.isPublic)).map(_ => _.templateId)

    // expect(incompleteSchema, 'no unused schema in public cards').toStrictEqual([])

    // const incompletePublic = templatesOptionConfig.filter(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false ? _.templateId : undefined)).map(_ => _.templateId)

    // expect(incompletePublic, 'incomplete public cards').toMatchInlineSnapshot(`[]`)
    // expect(incompletePublic).toStrictEqual([])
  })
})
