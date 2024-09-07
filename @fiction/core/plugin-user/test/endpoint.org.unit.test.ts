import { createTestUtils } from '@fiction/core/test-utils/init'
import { describe, expect, it } from 'vitest'
import type { Organization, User } from '..'

describe('org handling', async () => {
  const testUtils = createTestUtils()
  const initialized = await testUtils.init()
  const orgId = initialized.user.orgs?.[0].orgId

  let workingUser: User | undefined
  let workingOrg: Organization | undefined
  it('creates a user', async () => {
    const key = Math.random().toString().slice(2, 8)
    const r = await testUtils?.fictionUser.queries.ManageUser.serve(
      {
        fields: { email: `arpowers+${key}@gmail.com` },
        _action: 'create',
      },
      {},
    )

    workingUser = r?.data

    expect(workingUser?.userId).toBeTruthy()
  })

  it('creates an organization', async () => {
    if (!workingUser?.userId)
      throw new Error('no user')

    const response = await testUtils?.fictionUser.queries.ManageOrganization.serve(
      {
        fields: { orgName: `test` },
        userId: workingUser.userId,
        _action: 'create',
      },
      { bearer: workingUser },
    )

    workingOrg = response?.data
    workingUser = response?.user

    expect(workingOrg?.orgId).toBeTruthy()
    expect(workingOrg?.orgName).toBe('test')
  })

  it('updates an organization', async () => {
    if (!workingOrg?.orgId || !workingUser?.userId)
      throw new Error('Prerequisites not met: workingOrg or workingUser missing')

    const updatedName = `updatedTestOrg-${Date.now()}`
    const updateResponse = await testUtils?.fictionUser.queries.ManageOrganization.serve(
      {
        _action: 'update',
        where: { orgId: workingOrg.orgId },
        fields: { orgName: updatedName },
      },
      { bearer: workingUser },
    )

    expect(updateResponse?.data?.orgName).toBe(updatedName)
  })

  it('runs org query', async () => {
    const userId = initialized?.user?.userId

    if (!userId)
      throw new Error('no user')

    const result = await testUtils?.fictionUser.queries.OrganizationsByUserId.serve({ userId }, { server: true })

    expect(result?.data?.length).toMatchInlineSnapshot('1')
  })

  it('generates a new API secret for an organization', async () => {
    const where = { orgId: workingOrg?.orgId || '' }

    const response = await testUtils.fictionUser.queries.ManageOrganization.serve(
      { _action: 'generateApiSecret', where },
      { bearer: workingUser },
    )

    expect(response?.status).toBe('success')

    expect(response?.data?.apiSecret?.length).toBeGreaterThan(10)

    const getOrg = await testUtils.fictionUser.queries.ManageOrganization.serve(
      { _action: 'retrieve', where },
      { bearer: workingUser },
    )

    expect(getOrg?.data?.apiSecret?.length).toBeGreaterThan(10)
  })

  it('deletes an organization with proper permissions', async () => {
    await expect(
      testUtils.fictionUser.queries.ManageOrganization.serve(
        { _action: 'delete', where: { orgId: workingOrg?.orgId || '' } },
        { bearer: workingUser },
      ),
    ).resolves.toHaveProperty('status', 'success')
  })
})
