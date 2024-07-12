import { describe, expect, it } from 'vitest'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { getDemoPages, standardCardTemplates } from '..'

describe('verify template settings config', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  it('has template options set correctly', async () => {
    const demoPages = await getDemoPages({ templates: standardCardTemplates, site })
    const templatesOptionConfig = standardCardTemplates.map((_) => {
      return {
        templateId: _.settings.templateId,
        unusedSchema: _.optionConfig.unusedSchema,
        isPublic: _.settings.isPublic,
        hasDemo: _.settings.demoPage || demoPages.some(d => d.slug === `card-${_.settings.templateId}`),
      }
    })

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot(`
      [
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "wrap",
          "unusedSchema": {
            "fixedHeader": "boolean",
          },
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "transaction",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "404",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "nav",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "footer",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "quotes",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "profile",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "hero",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "marquee",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "area",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "map",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": false,
          "templateId": "magazine",
          "unusedSchema": {
            "test": "",
          },
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "demoProse",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "capture",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "showcase",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "cinema",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": undefined,
          "templateId": "story",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "ticker",
          "unusedSchema": {},
        },
        {
          "hasDemo": [Function],
          "isPublic": undefined,
          "templateId": "team",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "pricing",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": undefined,
          "templateId": "logos",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": [Function],
          "isPublic": undefined,
          "templateId": "tour",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": false,
          "isPublic": undefined,
          "templateId": "mediaGrid",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": [Function],
          "isPublic": undefined,
          "templateId": "features",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": undefined,
          "templateId": "metrics",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "faq",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "mediaPop",
          "unusedSchema": undefined,
        },
      ]
    `)

    const undefinedSchema = templatesOptionConfig.filter(_ => typeof _.unusedSchema === 'undefined' && _.isPublic).map(_ => _.templateId)

    expect(undefinedSchema, 'undefined schema').toStrictEqual([])

    const incompleteSchema = templatesOptionConfig.filter(_ => (Object.keys(_.unusedSchema || {}).length > 0 && _.isPublic)).map(_ => _.templateId)

    expect(incompleteSchema, 'no unused schema in public cards').toStrictEqual([])

    const incompletePublic = templatesOptionConfig.filter(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false ? _.templateId : undefined)).map(_ => _.templateId)

    expect(incompletePublic, 'incomplete public cards').toMatchInlineSnapshot(`
      [
        "story",
        "team",
        "logos",
        "tour",
        "mediaGrid",
        "features",
        "metrics",
      ]
    `)
    expect(incompletePublic.length).toBe(0)
  })
})
