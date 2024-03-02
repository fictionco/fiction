import { describe, expect, it } from 'vitest'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { FactorAdmin } from '..'

describe('factorAdmin Auth', async () => {
  const testUtils = await createTestUtils()

  const _factorAdmin = new FactorAdmin({ ...testUtils })
  await testUtils.factorDb.init()
  await testUtils.factorServer.createServer()

  it('redirects User If Not Logged In', async () => {
    await testUtils?.factorRouter.push('/admin')

    expect(testUtils?.factorRouter.current.value.path, 'base path (default)').toBe('/')
  })

  it('if logged in, it redirects to org route', async () => {
    const initialized = await testUtils?.init()
    const user = initialized?.user
    if (!user)
      throw new Error('no user')

    await testUtils?.factorRouter.push('/admin')

    const orgPath = `/admin/${user.orgs?.[0].orgId}/home`
    expect(testUtils?.factorRouter.current.value.path, 'is org path').toBe(orgPath)
  })
})
