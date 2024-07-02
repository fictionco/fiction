import { describe, expect, it } from 'vitest'
import { getDemoPages, standardCardTemplates } from '..'

describe('verify template settings config', () => {
  it('has template options set correctly', () => {
    const demoPages = getDemoPages({ templates: standardCardTemplates })
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
          "hasDemo": [Function],
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
          "hasDemo": [Function],
          "isPublic": false,
          "templateId": "capture",
          "unusedSchema": {
            "dismissText": "string",
            "heading": "string, Newsletter hook header 5 words or so",
            "media": "object",
            "media.format": "string",
            "media.html": "string",
            "media.url": "string",
            "presentationMode": "string",
            "subHeading": "string, Specific benefits of subscribing",
            "superHeading": "string, Social proof Metric or KPI for the newsletter, e.g. "22,300+ subscribers"",
          },
        },
        {
          "hasDemo": [Function],
          "isPublic": true,
          "templateId": "showcase",
          "unusedSchema": {},
        },
      ]
    `)

    const incompleteSchema = templatesOptionConfig.some(_ => typeof _.unusedSchema === 'undefined' || (Object.keys(_.unusedSchema).length > 0 && _.isPublic))

    expect(incompleteSchema, 'unused schema is empty').toBe(false)

    const incompletePublic = templatesOptionConfig.map(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false ? _.templateId : undefined)).filter(Boolean)

    expect(incompletePublic, 'incomplete public cards').toMatchInlineSnapshot(`[]`)
    expect(incompletePublic.length).toBe(0)
  })
})
