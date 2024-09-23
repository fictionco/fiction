import type { OrganizationMember } from '@fiction/core/plugin-user/types.js'
import { createTestUtils } from '@fiction/core/test-utils/init.js'
import { describe, expect, it } from 'vitest'
import { snap } from '../../test-utils/util.js'

describe('org team', async () => {
  const testUtils = createTestUtils()

  const initialized = await testUtils.init()

  it('get members', async () => {
    const orgId = initialized?.user?.orgs?.[0]?.orgId

    if (!orgId)
      throw new Error('no orgId')

    const q = await testUtils?.fictionTeam?.queries.OrgMembers.serve(
      {
        _action: 'list',
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

    expect(snap(q?.data, { maskedKeys: ['fullName'] })).toMatchInlineSnapshot(`
      [
        {
          "createdAt": "[dateTime:]",
          "email": "[email:********+**********@*****.***]",
          "fullName": "**MASKED**",
          "invitedById": null,
          "lastSeenAt": "[dateTime:]",
          "memberAccess": "owner",
          "memberId": "[id:************************]",
          "memberRole": null,
          "memberStatus": "active",
          "orgId": "[id:***************************]",
          "priority": null,
          "updatedAt": "[dateTime:]",
          "userId": "[id:***************************]",
        },
      ]
    `)
  })
})
