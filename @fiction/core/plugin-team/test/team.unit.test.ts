import type { MemberAccess, OrganizationMember } from '@fiction/core/plugin-user/types.js'
import { createTestUtils } from '@fiction/core/test-utils/init.js'
import { afterAll, describe, expect, it } from 'vitest'
import { snap } from '../../test-utils/util.js'

describe('team invite functionality', async () => {
  const testUtils = createTestUtils()
  const initialized = await testUtils.init()

  afterAll(async () => {
    await testUtils.close()
  })

  it('should send invitation to new user', async () => {
    const { orgId } = initialized
    const testEmail = `test-invite-${Date.now()}@example.com`
    const access: MemberAccess = 'admin'

    const response = await testUtils.fictionTeam.queries.TeamInvite.serve(
      {
        orgId,
        invites: [{ email: testEmail, access }],
      },
      { bearer: initialized.user, server: true },
    )

    expect(response.status, 'Team invite should succeed').toBe('success')
    expect(response.message, 'Success message should be returned').toBe('Invitations sent successfully')
  })

  it('should handle multiple invitations', async () => {
    const { orgId } = initialized
    const testEmails = [
      `test-invite-multi1-${Date.now()}@example.com`,
      `test-invite-multi2-${Date.now()}@example.com`,
    ]

    const response = await testUtils.fictionTeam.queries.TeamInvite.serve(
      {
        orgId,
        invites: [
          { email: testEmails[0], access: 'editor' },
          { email: testEmails[1], access: 'admin' },
        ],
      },
      { bearer: initialized.user, server: true },
    )

    expect(response.status, 'Multiple invites should succeed').toBe('success')
  })

  it('should add users to organization with correct access level', async () => {
    const { orgId } = initialized
    const testEmail = `test-invite-access-${Date.now()}@example.com`
    const access: MemberAccess = 'admin'

    // Send invitation
    await testUtils.fictionTeam.queries.TeamInvite.serve(
      {
        orgId,
        invites: [{ email: testEmail, access }],
      },
      { bearer: initialized.user, server: true },
    )

    // Verify membership was created with correct access level
    const membersResponse = await testUtils.fictionTeam.queries.OrgMembers.serve(
      {
        _action: 'list',
        orgId,
        filters: [[{ field: 'fiction_user.email', operator: '=', value: testEmail }]],
      },
      { server: true },
    )

    expect(membersResponse.data?.length, 'Invited user should be in members list').toBeGreaterThan(0)

    const invitedMember = membersResponse.data?.find(m => m.email === testEmail)
    expect(invitedMember, 'Invited member should exist').toBeDefined()
    expect(invitedMember?.access, 'Member access should match invitation').toBe(access)
    expect(invitedMember?.status, 'New member should have pending status').toBe('pending')
  })

  it('should reject invitation with invalid org ID', async () => {
    const invalidOrgId = 'org123456789'
    const testEmail = `test-invite-invalid-${Date.now()}@example.com`

    const response = await testUtils.fictionTeam.queries.TeamInvite.serve(
      {
        orgId: invalidOrgId,
        invites: [{ email: testEmail, access: 'admin' }],
      },
      { bearer: initialized.user, server: true },
    )

    expect(response.status, 'Invalid org ID should fail').toBe('error')
  })

  it('should reject empty invites array', async () => {
    const { orgId } = initialized

    const response = await testUtils.fictionTeam.queries.TeamInvite.serve(
      {
        orgId,
        invites: [],
      },
      { bearer: initialized.user, server: true },
    )

    expect(response.status, 'Empty invites should fail').toBe('error')
    expect(response.message, 'Error message should mention invitations').toContain('No invitations')
  })

  it('should generate correct invitation URLs', async () => {
    // Access the method directly for unit testing
    const teamInviteQuery = testUtils.fictionTeam.queries.TeamInvite
    const appUrl = testUtils.fictionEnv.meta?.url || 'https://app.example.com'

    // Test for new user
    const newUserUrl = teamInviteQuery.invitationReturnUrl({
      code: 'test123',
      email: 'new@example.com',
      orgId: 'org123',
      isNew: true,
    })

    expect(newUserUrl, 'New user URL should use set-new-password endpoint').toContain('/app/auth/set-new-password')
    expect(newUserUrl, 'New user URL should include code').toContain('code=test123')
    expect(newUserUrl, 'New user URL should include orgId').toContain('orgId=org123')

    // Test for existing user
    const existingUserUrl = teamInviteQuery.invitationReturnUrl({
      code: 'test456',
      email: 'existing@example.com',
      orgId: 'org456',
      isNew: false,
    })

    expect(existingUserUrl, 'Existing user URL should use auth endpoint').toContain('/app/auth')
    expect(existingUserUrl, 'Existing user URL should not use set-new-password endpoint').not.toContain('/set-new-password')
    expect(existingUserUrl, 'Existing user URL should include code').toContain('code=test456')
  })
})

describe('workspace team tests', async () => {
  const testUtils = createTestUtils()

  const initialized = await testUtils.init()

  afterAll(() => testUtils.close())

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
      'access',
      'status',
    ]

    keys.forEach((k) => {
      expect(sample?.[k]).toBeDefined()
    })

    expect(snap(q?.data, { maskedKeys: ['fullName'] })).toMatchInlineSnapshot(`
      [
        {
          "access": "owner",
          "createdAt": "[datetime:TRUTHY]",
          "email": "[email:TRUTHY]",
          "fullName": "**MASKED**",
          "inviterId": "null",
          "lastSeenAt": {},
          "memberId": "[id:TRUTHY]",
          "orgId": "[id:TRUTHY]",
          "priority": "null",
          "status": "active",
          "tags": "null",
          "updatedAt": "[datetime:TRUTHY]",
          "userId": "[id:TRUTHY]",
        },
      ]
    `)
  })
})
