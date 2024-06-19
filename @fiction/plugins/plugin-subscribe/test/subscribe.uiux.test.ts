import { afterAll, describe, expect, it } from 'vitest'
import { createUiTestingKit } from '@fiction/core/test-utils/kit.js'
import type { EmailVars } from '@fiction/plugin-transactions/action.js'
import { createTestUser } from '@fiction/core/test-utils/init.js'
import { setup } from './kit.main.js'

describe('subscribe uiux', { retry: 3 }, async () => {
  const kit = await createUiTestingKit({ headless: true, setup, slowMo: 0 })

  afterAll(() => kit?.close())
  const testUtils = kit.testUtils
  const initialized = await testUtils.initUser()

  const orgId = initialized.orgId
  const org = initialized.org

  const { user: user2 } = await createTestUser(testUtils.fictionUser, { caller: 'user2' })

  const action = kit.testUtils.fictionSubscribe.transactions.subscribe

  let vars: EmailVars | undefined
  it('sends email', async () => {
    if (!user2?.email)
      throw new Error('missing email')

    // randomly choose email
    const emails = ['andrew@fiction.com', 'madeup123abc@gmail.com']
    const orgEmail = emails[Math.floor(Math.random() * emails.length)]

    const queryVars = { orgId, orgName: org.orgName, orgEmail }
    const browserRequest = await action.requestSend({ to: user2.email, fields: {}, queryVars })

    const recipient = browserRequest?.data?.recipient

    if (!recipient)
      throw new Error('missing recipient')

    expect(recipient?.userId).toBe(user2.userId)

    const rOrigin = await action.serveSend({ recipient, queryVars, origin: 'https://www.orig.com' }, { server: true })

    expect(rOrigin.emailVars.callbackUrl).toContain('https://www.orig.com/__transaction/subscribe')

    const r = await action.serveSend({ recipient, queryVars }, { server: true, emailMode: 'send' })

    expect(r.data?.isSent).toBe(true)

    vars = r.emailVars

    const r2 = await testUtils.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId: user2.userId! } }, { server: true, returnAuthority: ['verify'] })

    expect(r2.data?.verify?.code).toBe(r.emailVars.code)
    const u = new URL(r.emailVars.callbackUrl)
    expect(Object.keys(vars.queryVars || {})).toMatchInlineSnapshot(`
      [
        "orgId",
        "orgName",
        "orgEmail",
        "token",
        "code",
        "email",
        "userId",
      ]
    `)

    const searchParamKeys = Array.from(u.searchParams.keys())
    expect(searchParamKeys).toEqual(expect.arrayContaining(['orgId', 'orgName', 'orgEmail', 'token', 'code', 'email', 'userId']))

    const emailContent = r.data?.html || ''
    expect(emailContent).toContain('Confirm Subscription')
    expect(emailContent).toContain(vars.callbackUrl.replaceAll('&', '&amp;'))
    expect(emailContent).not.toContain(vars.unsubscribeUrl)
  })

  it('logs in when callback url is visited and redirects to base route', { retry: 2 }, async () => {
    const selector = `[data-action-id="${action.settings.actionId}"]`
    await kit.performActions({
      path: vars?.callbackUrl || '',
      actions: [
        { type: 'visible', selector },
        { type: 'hasText', selector, text: org.orgName },
        { type: 'exists', selector: '[data-transaction-status="success"]' },
        { type: 'click', selector: '[data-test-actions] a' },
        { type: 'visible', selector: '[data-pathname="/"]' },
      ],
    })
  })

  it('has correct subscription information in DB', async () => {
    const fictionSubscribe = testUtils.fictionSubscribe

    const where = { userId: user2.userId }

    const r = await fictionSubscribe.queries.ManageSubscription.serve({ _action: 'list', orgId, where }, { server: true })

    const subs = r.data || []

    expect(subs.length).toBe(1)

    const sub = subs[0]

    expect(sub.orgId).toBe(orgId)

    expect(sub.userId).toBe(user2.userId)

    expect(sub.status).toBe('active')
  })
})
