/**
 * @vitest-environment happy-dom
 */
import { findValueByKey } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { setup } from './test-theme'
import { createSiteTestUtils } from './testUtils'

describe('themeCreation', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()
  const testTheme = setup(testUtils)
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''
  const pg = await testTheme.pages({ site })
  const _homeNumPages = pg.filter(_ => _.regionId === 'main').length

  testUtils.fictionSites.themes.value = [...testUtils.fictionSites.themes.value, testTheme]

  afterAll(async () => {
    await testUtils.close()
  })

  it('processes theme media correct', async () => {
    const m = testUtils.fictionSites.queries.ManageSite
    const r = await m.createSiteFromTheme({ _action: 'create', userId, orgId, fields: { themeId: testTheme.themeId } }, { server: true })

    const val = findValueByKey(r.pages, 'media')?.url

    expect(val.length).toMatchInlineSnapshot(`49`)
    expect(findValueByKey(r.pages, 'media')?.url).toContain(`/__static/`)
  })
})
