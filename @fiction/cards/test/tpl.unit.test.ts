import { describe, expect, it } from 'vitest'
import { getDemoPages, standardCardTemplates } from '..'

describe('verify template settings config', () => {
  it('has template options set correctly', () => {
    const demoPages = getDemoPages()
    const templatesOptionConfig = standardCardTemplates.map((_) => {
      return {
        templateId: _.settings.templateId,
        unusedSchema: _.optionConfig.unusedSchema,
        isPublic: _.settings.isPublic,
        hasDemo: demoPages.some(d => d.slug === `card-${_.settings.templateId}`),
      }
    })

    expect(templatesOptionConfig).toMatchInlineSnapshot(`
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
          "templateId": "404",
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
          "templateId": "map",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "magazine",
          "unusedSchema": {
            "test": "",
          },
        },
        {
          "hasDemo": true,
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
      ]
    `)

    const incompleteSchema = templatesOptionConfig.some(_ => typeof _.unusedSchema === 'undefined' || (Object.keys(_.unusedSchema).length > 0 && _.isPublic))

    expect(incompleteSchema).toBe(false)

    const incompletePublic = templatesOptionConfig.map(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false ? _.templateId : undefined)).filter(Boolean)

    expect(incompletePublic).toMatchInlineSnapshot(`[]`)
    expect(incompletePublic.length).toBe(0)
  })
})
