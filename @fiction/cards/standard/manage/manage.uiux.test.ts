import { isCi } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'

describe('contact transaction UI flow', { retry: isCi() ? 3 : 0 }, async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: isCi(), slowMo: 0 })

  const testUtils = kit.testUtils
  const initialized = kit.initialized

  if (!initialized) {
    throw new Error('Failed to initialize test user')
  }

  afterAll(async () => kit?.close())

  // Helper to create transaction URLs
  function createTransactionUrl(args: {
    action: string
    targetOrgId?: string
    userId?: string
    email?: string
    token?: string
    code?: string
    redirect?: string
  }) {
    const { action, targetOrgId, userId, email, token, code, redirect } = args
    const params = new URLSearchParams({
      action,
      ...(targetOrgId && { targetOrgId }),
      ...(userId && { userId }),
      ...(email && { email }),
      ...(token && { token }),
      ...(code && { code }),
      ...(redirect && { redirect }),
    })

    return `/m?${params.toString()}`
  }

  it.only('shows subscription verified message for verifySubscribe action', async () => {
    const url = createTransactionUrl({
      action: 'verifySubscribe',
      targetOrgId: initialized.orgId,
      userId: initialized.user.userId!,
      email: initialized.email,
      token: initialized.token,
      code: initialized.user.verify?.code || '',
      redirect: '/dashboard',
    })

    await kit.performActions({
      caller: 'verify-subscription',
      path: url,
      actions: [
        // Wait for loading to complete
        { type: 'visible', selector: '[data-test-id="transaction-status"]' },

        // Check success indicator
        { type: 'visible', selector: '[data-test-id="success-indicator"]' },
        { type: 'hasText', selector: '[data-test-id="transaction-title"]', text: 'Subscription Verified' },
        { type: 'hasText', selector: '[data-test-id="transaction-message"]', text: 'Your subscription has been confirmed' },

        // Check for continue button
        { type: 'visible', selector: '[data-test-id="continue-button"]' },
        { type: 'hasAttribute', selector: '[data-test-id="continue-button"]', attribute: 'href', expectedValue: '/dashboard' },
      ],
    })
  })

  it('handles subscription management with status update form', async () => {
    const url = createTransactionUrl({
      action: 'unsubscribe',
      targetOrgId: initialized.orgId,
      userId: initialized.user.userId!,
      email: initialized.email,
      redirect: '/preferences',
    })

    await kit.performActions({
      caller: 'manage-subscription',
      path: url,
      actions: [
        // Wait for form to load
        { type: 'visible', selector: '[data-test-id="transaction-form"]' },
        { type: 'hasText', selector: '[data-test-id="transaction-title"]', text: 'Manage Subscription' },

        // Check status selector is present
        { type: 'visible', selector: '[data-test-id="input-status"]' },

        // Change subscription status to unsubscribed
        { type: 'click', selector: '[data-test-id="input-status"] [data-test-id="select-trigger"]' },
        { type: 'click', selector: '[data-test-id="option-unsubscribed"]' },

        // Submit the update
        { type: 'click', selector: '[data-test-id="update-button"]' },

        // Should redirect or show success
        { type: 'wait', wait: 1000 },
      ],
    })
  })

  it('shows password change form for changePassword action', async () => {
    const url = createTransactionUrl({
      action: 'changePassword',
      userId: initialized.user.userId!,
      email: initialized.email,
      token: initialized.token,
      code: initialized.user.verify?.code || '',
      redirect: '/profile',
    })

    await kit.performActions({
      caller: 'change-password',
      path: url,
      actions: [
        // Wait for form to load
        { type: 'visible', selector: '[data-test-id="transaction-form"]' },
        { type: 'hasText', selector: '[data-test-id="transaction-title"]', text: 'Change Password' },

        // Check password input is present
        { type: 'visible', selector: '[data-test-id="input-password"]' },

        // Fill new password
        { type: 'fill', selector: '[data-test-id="input-password"] input', text: 'NewSecurePass123!' },

        // Submit the update
        { type: 'click', selector: '[data-test-id="update-button"]' },

        // Should process and redirect
        { type: 'wait', wait: 1000 },
      ],
    })
  })

  it('handles contact not found error gracefully', async () => {
    const url = createTransactionUrl({
      action: 'unsubscribe',
      targetOrgId: 'invalid-org-id',
      userId: 'invalid-user-id',
      email: 'nonexistent@example.com',
    })

    await kit.performActions({
      caller: 'contact-not-found',
      path: url,
      actions: [
        // Wait for error state
        { type: 'visible', selector: '[data-test-id="transaction-status"]' },

        // Check error indicator
        { type: 'visible', selector: '[data-test-id="error-indicator"]' },
        { type: 'hasText', selector: '[data-test-id="transaction-message"]', text: 'Request failed' },

        // Should not show form
        { type: 'exists', selector: '[data-test-id="transaction-form"]', isNot: true },
      ],
    })
  })

  it('shows loading state initially', async () => {
    const url = createTransactionUrl({
      action: 'verifySubscribe',
      targetOrgId: initialized.orgId,
      userId: initialized.user.userId!,
      email: initialized.email,
      token: initialized.token,
      code: initialized.user.verify?.code || '',
    })

    await kit.performActions({
      caller: 'loading-state',
      path: url,
      actions: [
        // Check initial loading state (should be quick)
        { type: 'visible', selector: '[data-test-id="loading-spinner"]', wait: 100 },

        // Wait for loading to complete
        { type: 'visible', selector: '[data-test-id="transaction-status"]', wait: 3000 },
      ],
    })
  })

  it('handles auto-redirect for successful verification', async () => {
    const url = createTransactionUrl({
      action: 'verifySubscribe',
      targetOrgId: initialized.orgId,
      userId: initialized.user.userId!,
      email: initialized.email,
      token: initialized.token,
      code: initialized.user.verify?.code || '',
      redirect: '/success',
    })

    await kit.performActions({
      caller: 'auto-redirect',
      path: url,
      actions: [
        // Wait for processing
        { type: 'visible', selector: '[data-test-id="transaction-status"]' },
        { type: 'hasText', selector: '[data-test-id="transaction-title"]', text: 'Subscription Verified' },

        // Should have continue button for manual redirect as fallback
        { type: 'visible', selector: '[data-test-id="continue-button"]' },

        // Note: Auto-redirect happens after 1.5s, but we can't easily test
        // window.location.href changes in this context
      ],
    })
  })

  it('handles form validation for password change', async () => {
    const url = createTransactionUrl({
      action: 'changePassword',
      userId: initialized.user.userId!,
      email: initialized.email,
      token: initialized.token,
      code: initialized.user.verify?.code || '',
    })

    await kit.performActions({
      caller: 'password-validation',
      path: url,
      actions: [
        // Wait for form
        { type: 'visible', selector: '[data-test-id="transaction-form"]' },

        // Try to submit without password
        { type: 'click', selector: '[data-test-id="update-button"]' },

        // Should show validation (implementation depends on FormEngine)
        { type: 'wait', wait: 500 },

        // Fill valid password
        { type: 'fill', selector: '[data-test-id="input-password"] input', text: 'ValidPassword123!' },

        // Now submit should work
        { type: 'click', selector: '[data-test-id="update-button"]' },
      ],
    })
  })

  it('displays correct themes and styling', async () => {
    const url = createTransactionUrl({
      action: 'verifySubscribe',
      targetOrgId: initialized.orgId,
      userId: initialized.user.userId!,
      email: initialized.email,
      token: initialized.token,
      code: initialized.user.verify?.code || '',
    })

    await kit.performActions({
      caller: 'styling-check',
      path: url,
      actions: [
        // Check layout structure
        { type: 'visible', selector: '[data-test-id="transaction-container"]' },
        { type: 'hasAttribute', selector: '[data-test-id="transaction-container"]', attribute: 'class', expectedValue: 'min-h-[50vh] flex items-center justify-center p-8' },

        // Check success styling when loaded
        { type: 'visible', selector: '[data-test-id="success-indicator"]' },
        { type: 'hasAttribute', selector: '[data-test-id="success-indicator"]', attribute: 'class', expectedValue: 'w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },

        // Check typography
        { type: 'visible', selector: '[data-test-id="transaction-title"]' },
        { type: 'hasAttribute', selector: '[data-test-id="transaction-title"]', attribute: 'class', expectedValue: 'text-xl font-medium mb-2' },
      ],
    })
  })
})
