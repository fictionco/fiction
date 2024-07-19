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
        hasDemo: !!(_.settings.demoPage || demoPages.some(d => d.slug === `card-${_.settings.templateId}`)),
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
          "isPublic": false,
          "templateId": "magazine",
          "unusedSchema": {
            "posts": "object",
            "posts.items": "array",
            "posts.items.0.authors": "array",
            "posts.items.0.authors.0.avatar": "object",
            "posts.items.0.authors.0.avatar.alt": "string",
            "posts.items.0.authors.0.avatar.blurhash": "string",
            "posts.items.0.authors.0.avatar.caption": "string",
            "posts.items.0.authors.0.avatar.format": "string",
            "posts.items.0.authors.0.avatar.height": "number",
            "posts.items.0.authors.0.avatar.html": "string",
            "posts.items.0.authors.0.avatar.mime": "string",
            "posts.items.0.authors.0.avatar.thumbUrl": "string",
            "posts.items.0.authors.0.avatar.url": "string",
            "posts.items.0.authors.0.avatar.width": "number",
            "posts.items.0.authors.0.email": "string",
            "posts.items.0.authors.0.fullName": "string",
            "posts.items.0.categories": "array",
            "posts.items.0.categories.0.slug": "string",
            "posts.items.0.categories.0.title": "string",
            "posts.items.0.categories.0.type": "string",
            "posts.items.0.content": "string",
            "posts.items.0.image": "object",
            "posts.items.0.image.alt": "string",
            "posts.items.0.image.blurhash": "string",
            "posts.items.0.image.caption": "string",
            "posts.items.0.image.format": "string",
            "posts.items.0.image.height": "number",
            "posts.items.0.image.html": "string",
            "posts.items.0.image.mime": "string",
            "posts.items.0.image.thumbUrl": "string",
            "posts.items.0.image.url": "string",
            "posts.items.0.image.width": "number",
            "posts.items.0.slug": "string",
            "posts.items.0.status": "string",
            "posts.items.0.subTitle": "string",
            "posts.items.0.tags": "array",
            "posts.items.0.tags.0.slug": "string",
            "posts.items.0.tags.0.title": "string",
            "posts.items.0.tags.0.type": "string",
            "posts.items.0.taxonomy": "array",
            "posts.items.0.taxonomy.0.slug": "string",
            "posts.items.0.taxonomy.0.title": "string",
            "posts.items.0.taxonomy.0.type": "string",
            "posts.items.0.title": "string",
            "posts.limit": "number",
            "posts.mode": "string",
          },
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
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "story",
          "unusedSchema": undefined,
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
          "hasDemo": true,
          "isPublic": true,
          "templateId": "tour",
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
          "hasDemo": true,
          "isPublic": false,
          "templateId": "trek",
          "unusedSchema": {
            "items.0.actions": "array",
            "items.0.actions.0.btn": "string",
            "items.0.actions.0.href": "string",
            "items.0.actions.0.name": "string",
            "items.0.media.format": "string",
            "items.0.media.url": "string",
            "items.0.media.video": "string",
          },
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
