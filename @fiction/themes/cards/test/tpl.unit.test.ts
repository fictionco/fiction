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
          "hasDemo": false,
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
          "hasDemo": false,
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
      ]
    `)

    const incompleteSchema = templatesOptionConfig.some(_ => typeof _.unusedSchema === 'undefined' || Object.keys(_.unusedSchema).length > 0)

    expect(incompleteSchema).toBe(false)

    // const incompletePublic = templatesOptionConfig.some(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false))

    // expect(incompletePublic).toBe(false)
  })
})
