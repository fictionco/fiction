/**
 * @vitest-environment happy-dom
 */

import { shortId, waitFor } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { FictionStripe } from '..'
import { CustomerState } from '../customer'

describe('customerState', async () => {
  // Set up test utilities and initial state
  const testUtils = await createSiteTestUtils()

  // Initialize FictionStripe with test configuration
  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: '#',
    products: [{ key: 'pro', tier: 20 }],
  })

  const initialized = await testUtils.init()

  const { user, orgId } = initialized

  const userId = user.userId
  if (!userId)
    throw new Error('No user ID provided')

  const customerState = new CustomerState({ fictionStripe, instanceId: shortId() })

  beforeEach(async () => {
    customerState.reset()
  })

  afterAll(async () => {
    await testUtils.close()
    await fictionStripe.close()
    customerState.cleanup()
  })

  it('should initialize customer data', async () => {
    const result = await customerState.initialize({ caller: 'test' })

    expect(result, 'Should return customer data').toBeDefined()
    expect(customerState.isReady.value, 'State should be ready').toBe(true)
    expect(customerState.data.value?.customer?.id, 'Should have customer ID').toBeDefined()
  })

  it('should reuse existing initialization promise', async () => {
    // Track initialization time
    const startTime = Date.now()

    // Call initialize multiple times in parallel
    const results = await Promise.all([
      customerState.initialize({ caller: 'test1' }),
      customerState.initialize({ caller: 'test2' }),
      customerState.initialize({ caller: 'test3' }),
    ])

    const elapsed = Date.now() - startTime

    // All results should be identical
    const [first, ...rest] = results
    rest.forEach(result => expect(result).toEqual(first))

    // Should complete faster than 3 sequential requests would take
    expect(elapsed, 'Should reuse single initialization').toBeLessThan(1000)
  })

  it('should refresh when org changes', async () => {
    await customerState.initialize({ caller: 'testOrgChange' })

    const initialData = customerState.data.value
    const initialCustomerId = initialData?.customer?.id

    const r = await testUtils.fictionUser.requests.ManageOrganization.projectRequest({
      _action: 'create',
      fields: { name: 'New Org' },
    }, { caller: 'test' })

    const { orgId: newOrgId } = r.data || {}

    // Change org ID
    await testUtils.fictionUser.setNewActiveOrgId({ orgId: newOrgId, caller: 'test' })

    // Wait for refresh
    await waitFor(1000)

    const newData = customerState.data.value
    const newCustomerId = newData?.customer?.id

    expect(newData).toBeDefined()
    expect(newCustomerId).not.toEqual(initialCustomerId)
  })
})
