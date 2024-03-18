import { beforeAll, describe, expect, it } from 'vitest'
import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'
import type { OrganizationMember } from '@fiction/core/plugin-user/types'
import { FictionTeam } from '..'
import { snap } from '../../test-utils'

let testUtils: (TestUtils & { fictionTeam?: FictionTeam }) | undefined

describe('org team', () => {
  beforeAll(async () => {
    testUtils = createTestUtils()

    const fictionTeam = new FictionTeam({
      ...testUtils,
    })

    testUtils.fictionTeam = fictionTeam

    testUtils.initialized = await testUtils.init()
  })

  it('get members', async () => {
    const orgId
      = testUtils?.initialized?.user?.orgs?.[0]?.orgId

    if (!orgId)
      throw new Error('no orgId')

    const q = await testUtils?.fictionTeam?.queries.OrgMembers.serve(
      {
        _action: 'index',
        orgId,
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
          "orgId": "[id:**************************]",
          "priority": null,
          "updatedAt": "[dateTime:]",
          "userId": "[id:**************************]",
        },
      ]
    `)
  })
})
