import { beforeAll, describe, expect, it } from 'vitest'
import type { TestUtils } from '@factor/api/test-utils/init'
import { createTestUtils } from '@factor/api/test-utils/init'
import type { OrganizationMember } from '@factor/api/plugin-user/types'
import { snap } from '@factor/api'
import { FactorTeam } from '..'

let testUtils: (TestUtils & { factorTeam?: FactorTeam }) | undefined

describe('organization team', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()

    const factorTeam = new FactorTeam({
      ...testUtils,
    })

    testUtils.factorTeam = factorTeam

    testUtils.initialized = await testUtils.init()
  })

  it('get members', async () => {
    const organizationId
      = testUtils?.initialized?.user?.organizations?.[0]?.organizationId

    if (!organizationId)
      throw new Error('no organizationId')

    const q = await testUtils?.factorTeam?.queries.OrgMembers.serve(
      {
        _action: 'index',
        organizationId,
      },
      { server: true },
    )

    expect(q?.indexMeta).toMatchInlineSnapshot(`
      {
        "count": 1,
        "limit": 50,
        "offset": 0,
      }
    `)
    const members = q?.data
    expect(members?.length).toBeGreaterThan(0)
    expect(q?.indexMeta?.count).toBeGreaterThan(0)
    expect(q?.indexMeta?.limit).toBeGreaterThan(0)

    const sample = members?.[0] as OrganizationMember & { [key: string]: any }

    expect(sample?.userId).toBeDefined()

    const keys = [
      'fullName',
      'email',
      'userId',
      'lastSeenAt',
      'memberAccess',
      'memberStatus',
    ]

    keys.forEach((k) => {
      expect(sample?.[k]).toBeDefined()
    })

    expect(snap(q?.data)).toMatchInlineSnapshot(`
      [
        {
          "createdAt": "[dateTime:]",
          "email": "[email:********+**********@*****.***]",
          "fullName": null,
          "invitedById": null,
          "lastSeenAt": "[dateTime:]",
          "memberAccess": "owner",
          "memberRole": null,
          "memberStatus": "active",
          "organizationId": "[id:**************************]",
          "priority": null,
          "updatedAt": "[dateTime:]",
          "userId": "[id:**************************]",
        },
      ]
    `)
  })
})
