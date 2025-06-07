import { isCi } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, expect, it } from 'vitest'

describe('settings e2e', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: isCi(), slowMo: 0 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  const orgId = kit.initialized?.orgId

  if (!orgId)
    throw new Error('Organization ID is not initialized')

  const getOrg = async () => {
    const out = await testUtils.fictionUser.queries.ManageOrganization.serve({ _action: 'read', where: { orgId } }, { server: true }).then(_ => _.data)
    return out
  }

  const getUser = async () => {
    const out = await testUtils.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId: kit.initialized?.user.userId || '' } }, { server: true }).then(_ => _.data)
    return out
  }

  it('navigates between settings panels', { timeout: 30000, retry: isCi() ? 2 : 0 }, async () => {
    await kit.performActions({
      caller: 'settings-nav',
      path: '/app/settings',
      actions: [
        { type: 'click', selector: '[data-test-id="nav-item-org"]' },
        { type: 'click', selector: '[data-test-id="nav-item-account"]' },
        { type: 'click', selector: '[data-test-id="nav-item-team"]' },
        { type: 'click', selector: '[data-test-id="nav-item-billing"]' },
      ],
    })
  })

  it('updates organization settings', { timeout: 60000, retry: isCi() ? 2 : 0 }, async () => {
    await kit.performActions({
      caller: 'org-settings',
      path: '/app/settings/org',
      actions: [
        { type: 'fill', selector: '[data-option-path="name"] input', text: 'Updated Org Name' },
        { type: 'fill', selector: '[data-option-path="email"] input', text: 'updated@example.com' },
        { type: 'fill', selector: '[data-option-path="profile.headline"] input', text: 'Updated headline' },
        { type: 'click', selector: '[data-test-id="saveButton"]', waitAfter: 2000 },
      ],
    })

    const org = await getOrg()
    expect(org?.name).toBe('Updated Org Name')
    expect(org?.email).toBe('updated@example.com')
    expect(org?.profile?.headline).toBe('Updated headline')
  })

  it('updates user account settings', { timeout: 60000, retry: isCi() ? 2 : 0 }, async () => {
    await kit.performActions({
      caller: 'account-settings',
      path: '/app/settings/account',
      actions: [
        { type: 'fill', selector: '[data-option-path="fullName"] input', text: 'Updated Full Name' },
        { type: 'click', selector: '[data-test-id="saveButton"]', waitAfter: 2000 },

      ],
    })

    const user = await getUser()
    expect(user?.fullName).toBe('Updated Full Name')
  })

  it('manages team members', { timeout: 60000, retry: isCi() ? 2 : 0 }, async () => {
    await kit.performActions({
      caller: 'team-management',
      path: '/app/settings/team',
      actions: [
        { type: 'click', selector: '[data-test-id="inviteButton"]' },
        { type: 'fill', selector: '[data-test-id="invite-email-input"] [data-test-id="email-input"]', text: 'newmember@example.com' },
        { type: 'keyboard', selector: '[data-test-id="invite-email-input"] [data-test-id="email-input"]', key: 'Enter' },
        { type: 'click', selector: '[data-test-id="send-invites-button"]', waitAfter: 2000 },
      ],
    })
  })

  it('handles organization switching', { timeout: 30000, retry: isCi() ? 2 : 0 }, async () => {
    await kit.performActions({
      caller: 'org-switching',
      path: '/app/settings/manage-organizations',
      actions: [
        { type: 'click', selector: '[data-test-id="create-org-button"]' },
        { type: 'fill', selector: '[data-option-path="name"] input', text: 'New Test Org' },
        { type: 'click', selector: '[data-test-id="create-workspace-button"]', waitAfter: 3000 },
      ],
    })
  })
})
