import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { refineOptions } from '@fiction/site/utils/schema'
import { describe, expect, it } from 'vitest'
import { getDemoPages, standardCardTemplates } from '..'

describe('verify template settings config', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  it('has template options set correctly', async () => {
    const demoPages = await getDemoPages({ templates: standardCardTemplates, site })

    const templatesOptionConfig = standardCardTemplates.map((_) => {
      const conf = refineOptions({
        options: _.settings.options || [],
        schema: _.settings.schema,
        templateId: _.settings.templateId,
      })
      return {
        templateId: _.settings.templateId,
        unusedSchema: conf.unusedSchema,
        isPublic: _.settings.isPublic,
        hasDemo: !!(_.settings.demoPage || demoPages.some(d => d.slug === `card-${_.settings.templateId}`)),
      }
    })

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot(`
      [
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "wrap",
          "unusedSchema": {},
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
          "unusedSchema": {
            "actions.0.disabled": "boolean",
            "actions.0.format": "string",
            "actions.0.loading": "boolean",
            "actions.0.rounding": "string",
            "actions.0.testId": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "nav",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "footer",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "quotes",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "profile",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "hero",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "marquee",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "area",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "maps",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "magazine",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "demoProse",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "capture",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "showcase",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cinema",
          "unusedSchema": {
            "items.0.actions.0.testId": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "story",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "ticker",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "people",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "pricing",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "logos",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "mediaGrid",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "tour",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "features",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "metrics",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "faq",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "mediaPop",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "textEffects",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "trek",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "fitText",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "overSlide",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "statement",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "testimonials",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "effectShape",
          "unusedSchema": {
            "shapes.0.blendMode": "string",
            "shapes.0.color": "string",
            "shapes.0.opacity": "number",
            "shapes.0.position": "object",
            "shapes.0.position.offsetX": "number",
            "shapes.0.position.offsetY": "number",
            "shapes.0.position.origin": "string",
            "shapes.0.rotation": "string",
            "shapes.0.scale": "number",
            "shapes.0.shape": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "gallery",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contact",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "hitlist",
          "unusedSchema": {},
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
