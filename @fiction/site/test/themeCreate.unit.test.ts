/**
 * @vitest-environment happy-dom
 */
import { findValueByKey } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import type { Theme } from '../theme'
import { setup } from './test-theme'
import type { SiteTestUtils } from './testUtils'
import { createSiteTestUtils } from './testUtils'

let orgId: string
let userId: string
let testUtils: SiteTestUtils
let _homeNumPages: number
let testTheme: Theme
describe('themeCreation', async () => {
  testUtils = await createSiteTestUtils()
  testTheme = setup(testUtils)
  const r = await testUtils.init()
  userId = r?.user?.userId ?? ''
  orgId = r?.user?.orgs?.[0]?.orgId ?? ''
  const pg = await testTheme.pages()
  _homeNumPages = pg.filter(_ => _.regionId === 'main').length

  testUtils.fictionSites.themes.value = [...testUtils.fictionSites.themes.value, testTheme]

  afterAll(async () => {
    await testUtils.close()
  })

  it('processes theme media correct', async () => {
    const m = testUtils.fictionSites.queries.ManageSite
    const r = await m.createSiteFromTheme({ _action: 'create', userId, orgId, fields: { themeId: testTheme.themeId } }, { server: true })

    const val = findValueByKey(r.pages, 'media')?.url
    expect(val.length).toMatchInlineSnapshot(`142`)
    expect(findValueByKey(r.pages, 'media')?.url).toContain(`https://`)
  })
})
