/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */

import { beforeAll, describe, expect, it } from 'vitest'

import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'

let testUtils: TestUtils | undefined
describe('active project and org', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
    testUtils.initialized = await testUtils.init()
  })

  it('updates computed values', async () => {
    if (!testUtils)
      throw new Error('no test utils')
    const activeUser = testUtils?.fictionUser.activeUser.value
    const orgs = testUtils?.fictionUser?.activeUser.value?.orgs || []

    expect(activeUser?.orgs?.length).toMatchInlineSnapshot('1')
    expect(orgs.length).toMatchInlineSnapshot(`1`)

    expect(
      testUtils?.fictionUser.activeOrganizations.value.length,
    ).toMatchInlineSnapshot(`1`)
  })
})
