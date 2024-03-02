import { describe, expect, it } from 'vitest'
import { createTestUtils } from '@fiction/core/test-utils/init'
import type { Organization, User } from '..'

let user: User | undefined
let org: Organization | undefined
let orgId: string | undefined
describe('org/project handling', async () => {
  const testUtils = await createTestUtils()
  const initialized = await testUtils.init()
  orgId = initialized.user.orgs?.[0].orgId

  it('creates a user', async () => {
    const key = Math.random().toString().slice(2, 8)
    const r = await testUtils?.factorUser.queries.ManageUser.serve(
      {
        fields: { email: `arpowers+${key}@gmail.com` },
        _action: 'create',
      },
      {},
    )

    user = r?.data

    expect(user?.userId).toBeTruthy()
  })

  it('creates an organization', async () => {
    if (!user?.userId)
      throw new Error('no user')

    const response
      = await testUtils?.factorUser.queries.ManageOrganization.serve(
        {
          org: { orgName: `test` },
          userId: user.userId,
          _action: 'create',
        },
        { bearer: user },
      )

    org = response?.data

    expect(org?.orgId).toBeTruthy()
    expect(org?.orgName).toBe('test')
  })

  it('runs org query', async () => {
    const userId = initialized?.user?.userId

    if (!userId)
      throw new Error('no user')

    const result
      = await testUtils?.factorUser.queries.OrganizationsByUserId.serve(
        { userId },
        { server: true },
      )

    expect(result?.data?.length).toMatchInlineSnapshot('1')
  })

  it('updates onboard information', async () => {
    const userId = initialized?.user?.userId

    if (!userId || !orgId)
      throw new Error('no user or orgId')

    const result = await testUtils?.factorUser.queries.ManageOnboard.serve(
      {
        _action: 'update',
        settings: { onboardComplete: true },
        orgId,
        mode: 'org',
      },
      { server: true },
    )

    expect(result?.data).toMatchInlineSnapshot(`
      {
        "onboardComplete": true,
      }
    `)

    const r2 = await testUtils?.factorUser.queries.ManageOnboard.serve(
      {
        _action: 'update',
        settings: { hide: { foo: true, bar: true } },
        orgId,
        mode: 'org',
      },
      { server: true },
    )

    expect(r2?.data).toMatchInlineSnapshot(`
      {
        "hide": {
          "bar": true,
          "foo": true,
        },
        "onboardComplete": true,
      }
    `)

    const r3 = await testUtils?.factorUser.queries.ManageOnboard.serve(
      {
        _action: 'update',
        settings: { hide: { foo: null, bar: true } },
        orgId,
        mode: 'org',
      },
      { server: true },
    )

    expect(r3?.data).toMatchInlineSnapshot(`
      {
        "hide": {
          "bar": true,
        },
        "onboardComplete": true,
      }
    `)
  })
})
