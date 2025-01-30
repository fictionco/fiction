import { isCi } from '@fiction/core'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { afterAll, describe, expect, it } from 'vitest'
import { setup } from './email.main.js'

describe('onboard UX', { retry: isCi() ? 3 : 0 }, async () => {
  const kit = await createUiTestingKit({
    headless: false,
    setup,
    slowMo: 0,
    initUser: true,
    userFields: { needsOnboarding: true },
  })

  afterAll(async () => kit?.close())

  const user = kit.initialized?.user

  if (!user)
    throw new Error('missing user')

  const setToName = 'Onboarded User'
  const setToOrg = 'Onboarded Org'

  it('completes onboard flow', async () => {
    await kit.performActions({
      caller: 'onboardUiUx',
      path: '/',
      actions: [
        // Step 1: Full Name
        { type: 'visible', selector: '[data-test-id="step-fullName"]' },
        { type: 'fill', selector: '[data-test-id="step-fullName"] input', text: setToName },
        { type: 'click', selector: '[data-test-el="step-submit"]', waitAfter: 500 },

        // Step 2: Organization
        { type: 'visible', selector: '[data-test-id="step-orgName"]' },
        { type: 'fill', selector: '[data-test-id="step-orgName"] input', text: setToOrg },
        { type: 'click', selector: '[data-test-el="step-submit"]', waitAfter: 500 },

        // Step 3: Goal
        { type: 'visible', selector: '[data-test-id="step-goal"]' },
        { type: 'click', selector: '[data-test-id="step-goal"] input[type="radio"]', waitAfter: 500 },

        // Step 4: Role
        { type: 'visible', selector: '[data-test-id="step-role"]' },
        { type: 'click', selector: '[data-test-id="step-role"] input[type="radio"]', waitAfter: 500 },

        // Step 5: Payment/Trial
        { type: 'visible', selector: '[data-test-id="step-payment"]' },

        {
          type: 'frameInteraction',
          frameSelector: '[data-test-id="step-payment"] iframe',
          frameActions: [
            // Fill Stripe test card details
            { type: 'fill', selector: '#Field-numberInput', text: '4242424242424242' },
            { type: 'fill', selector: '#Field-expiryInput', text: '1234' },
            { type: 'fill', selector: '#Field-cvcInput', text: '424' },
            { type: 'fill', selector: '#Field-postalCodeInput', text: '42424' },

          ],
        },

        // Submit payment
        { type: 'click', selector: '[data-test-id="payment-submit-button"]', waitAfter: 2000 },

        // Step 6: Complete
        { type: 'visible', selector: '[data-test-id="step-ready"]' },
        { type: 'click', selector: '[data-test-el="step-submit"]', waitAfter: 500 },

        // Verify redirect
        { type: 'visible', selector: '[data-pathname="/"]' },
      ],
    })

    const r = await kit.testUtils?.fictionUser.queries.ManageUser.serve(
      { where: { email: user.email || '' }, _action: 'retrieve' },
      { server: true, caller: 'onboard', returnAuthority: ['verify'] },
    )

    expect(r.data?.needsOnboarding).toBeFalsy()
    expect(r.data?.fullName).toBe(setToName)
    expect(r.data?.orgs?.[0].orgName).toBe(setToOrg)

    const r2 = await kit.testUtils?.fictionStripe.queries.ManageCustomer.serve(
      { orgId: r.data?.orgs?.[0].orgId || '', _action: 'retrieve' },
      { server: true },
    )

    expect(r2.data?.customer?.id).toBeTruthy()
    expect(r2.data?.isActive).toBeTruthy()
    expect(r2.data?.isTrialing).toBeTruthy()
  }, { timeout: 120000 })
})
