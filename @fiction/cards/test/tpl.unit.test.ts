import { Card } from '@fiction/site'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { getDemoPages, standardCardTemplates } from '..'

describe('verify template settings config', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  it('has template options set correctly', async () => {
    const demoPages = await getDemoPages({ templates: standardCardTemplates, site })
    const card = new Card({})
    const templatesOptionConfig = standardCardTemplates.map((_) => {
      const conf = _.getOptionConfig({ card }).value
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
            "actions.0.btn": "string",
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
          "isPublic": false,
          "templateId": "magazine",
          "unusedSchema": {
            "posts.format": "string",
            "posts.limit": "number",
            "posts.posts": "array",
            "posts.posts.0.authors": "array",
            "posts.posts.0.authors.0.avatar": "object",
            "posts.posts.0.authors.0.avatar.el": "unknown",
            "posts.posts.0.authors.0.avatar.format": "string",
            "posts.posts.0.authors.0.avatar.html": "string",
            "posts.posts.0.authors.0.avatar.url": "string",
            "posts.posts.0.authors.0.email": "string",
            "posts.posts.0.authors.0.fullName": "string",
            "posts.posts.0.authors.0.title": "string",
            "posts.posts.0.authors.0.websiteUrl": "string",
            "posts.posts.0.categories": "array",
            "posts.posts.0.categories.0.slug": "string",
            "posts.posts.0.categories.0.title": "string",
            "posts.posts.0.categories.0.type": "string",
            "posts.posts.0.content": "string",
            "posts.posts.0.media": "object",
            "posts.posts.0.media.el": "unknown",
            "posts.posts.0.media.format": "string",
            "posts.posts.0.media.html": "string",
            "posts.posts.0.media.url": "string",
            "posts.posts.0.seo": "object",
            "posts.posts.0.seo.description": "string",
            "posts.posts.0.seo.title": "string",
            "posts.posts.0.slug": "string",
            "posts.posts.0.status": "string",
            "posts.posts.0.subTitle": "string",
            "posts.posts.0.tags": "array",
            "posts.posts.0.tags.0.slug": "string",
            "posts.posts.0.tags.0.title": "string",
            "posts.posts.0.tags.0.type": "string",
            "posts.posts.0.taxonomy": "array",
            "posts.posts.0.taxonomy.0.slug": "string",
            "posts.posts.0.taxonomy.0.title": "string",
            "posts.posts.0.taxonomy.0.type": "string",
            "posts.posts.0.title": "string",
            "posts.query": "object",
            "posts.query.dateRange": "object",
            "posts.query.dateRange.end": "string",
            "posts.query.dateRange.start": "string",
            "posts.query.filters": "array",
            "posts.query.search": "string",
            "posts.query.sortBy": "string",
            "posts.query.sortOrder": "string",
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
