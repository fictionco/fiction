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

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot()

    // const undefinedSchema = templatesOptionConfig.filter(_ => typeof _.unusedSchema === 'undefined' && _.isPublic).map(_ => _.templateId)

    // expect(undefinedSchema, 'undefined schema').toStrictEqual([])

    // const incompleteSchema = templatesOptionConfig.filter(_ => (Object.keys(_.unusedSchema || {}).length > 0 && _.isPublic)).map(_ => _.templateId)

    // expect(incompleteSchema, 'no unused schema in public cards').toStrictEqual([])

    // const incompletePublic = templatesOptionConfig.filter(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false ? _.templateId : undefined)).map(_ => _.templateId)

    // expect(incompletePublic, 'incomplete public cards').toMatchInlineSnapshot(`[]`)
    // expect(incompletePublic).toStrictEqual([])
  })
})
