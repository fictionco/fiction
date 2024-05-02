import { describe, expect, it } from 'vitest'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { FictionAdmin } from '..'

describe('fictionAdmin Auth', async () => {
  const testUtils = createTestUtils()

  const _fictionAdmin = new FictionAdmin({ ...testUtils })
  await testUtils.fictionDb.init()
  await testUtils.fictionServer.createServer()

  it('redirects User If Not Logged In', async (ctx) => {
    await testUtils?.fictionRouter.push('/admin', { caller: ctx.task.name })

    expect(testUtils?.fictionRouter.current.value.path, 'base path (default)').toBe('/')
  })

  it('if logged in, it redirects to org route', async (ctx) => {
    const initialized = await testUtils?.init()
    const user = initialized?.user
    if (!user)
      throw new Error('no user')

    await testUtils?.fictionRouter.push('/admin', { caller: ctx.task.name })

    const orgPath = `/admin/${user.orgs?.[0].orgId}/home`
    expect(testUtils?.fictionRouter.current.value.path, 'is org path').toBe(orgPath)
  })
})
