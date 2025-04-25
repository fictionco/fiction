/**
 * @vitest-environment happy-dom
 */
import { shortId } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { t, type TableDomainConfig } from '../tables.js'
import { createSiteTestUtils } from './testUtils.js'
import {createTestUser} from '@fiction/core/test-utils/init.js'

describe('manageDomain', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId } = await testUtils.init()
  const { fictionSites, fictionDb, fictionUser } = testUtils

  afterAll(() => testUtils.close())

  // Utility functions
  const createTestDomain = async (fields?: TableDomainConfig) => {
    const hostname = `test-${shortId()}.example.com`
    const response = await fictionSites.queries.ManageDomain.serve({
      _action: 'create',
      orgId: fields?.orgId || orgId,
      fields: {
        hostname,
        isPrimary: false,
        ...fields,
      },
      caller: 'test-create-domain',
    }, {server: true})

    const domainId = response.data?.[0]?.domainId

    if (!domainId) {
      throw new Error('Domain creation failed')
    }

    return { response, domainId, hostname }
  }

  it('creates a domain successfully', async () => {
    const { response, hostname } = await createTestDomain({ isPrimary: true })

    expect(response.status, 'Create should return success status').toBe('success')
    expect(response.data?.[0]?.hostname, 'Created domain should have correct hostname').toBe(hostname)
    expect(response.data?.[0]?.isPrimary, 'Created domain should be set as primary').toBe(true)
  })

  it('enforces valid hostnames', async () => {
    const r = await fictionSites.requests.ManageDomain.request({
      _action: 'create',
      orgId,
      fields: {
        hostname: 'invalid-hostname', // Missing TLD
      },
      caller: 'test-invalid-hostname',
    }, { expectError: true })

    expect(r.status, 'Create should return error status').toBe('error')
  })

  it('retrieves a domain by domainId', async () => {
    const { domainId, hostname } = await createTestDomain()

    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'retrieve',
      orgId,
      where: { domainId },
      caller: 'test-retrieve-domain',
    })

    expect(response.status, 'Retrieve should return success status').toBe('success')
    expect(response.data?.[0]?.domainId, 'Retrieved domain should have correct ID').toBe(domainId)
    expect(response.data?.[0]?.hostname, 'Retrieved domain should have correct hostname').toBe(hostname)
  })

  it('retrieves the primary domain when only orgId is provided', async () => {
    const { domainId, hostname } = await createTestDomain({ isPrimary: true })

    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'retrieve',
      orgId,
      where: { orgId },
      caller: 'test-retrieve-primary',
    })

    expect(response.status, 'Retrieve should return success status').toBe('success')
    expect(response.data?.[0]?.isPrimary, 'Retrieved domain should be primary').toBe(true)
  })

  it('updates a domain successfully', async () => {
    const { domainId } = await createTestDomain()
    const updatedHostname = `updated-${shortId()}.example.com`

    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'update',
      orgId,
      where: { domainId },
      fields: {
        hostname: updatedHostname,
      },
      caller: 'test-update-domain',
    })

    expect(response.status, 'Update should return success status').toBe('success')
    expect(response.data?.[0]?.hostname, 'Updated domain should have new hostname').toBe(updatedHostname)
  })

  it('enforces primary domain logic with transactions', async () => {
    // Create two domains
    const { domainId: firstDomainId } = await createTestDomain({ isPrimary: true })
    const { domainId: secondDomainId } = await createTestDomain({ isPrimary: false })

    // Now set the second domain as primary
    const updateResponse = await fictionSites.requests.ManageDomain.request({
      _action: 'update',
      orgId,
      where: { domainId: secondDomainId },
      fields: {
        isPrimary: true,
      },
      caller: 'test-update-primary',
    })

    expect(updateResponse.data?.[0]?.isPrimary, 'Second domain should now be primary').toBe(true)

    // Verify first domain is no longer primary
    const checkResponse = await fictionSites.requests.ManageDomain.request({
      _action: 'retrieve',
      orgId,
      where: { domainId: firstDomainId },
      caller: 'test-check-not-primary',
    })

    expect(checkResponse.data?.[0]?.isPrimary, 'Original domain should no longer be primary').toBe(false)
  })

  it('lists all domains for an org', async () => {
    // Create several domains to ensure there are enough to test with
    await createTestDomain()
    await createTestDomain({ isPrimary: true })

    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'list',
      orgId,
      caller: 'test-list-domains',
    })

    expect(response.status, 'List should return success status').toBe('success')
    expect(response.data?.length, 'Should return multiple domains').toBeGreaterThanOrEqual(2)
    expect(response.indexMeta?.count, 'Count should match returned domains').toBeGreaterThanOrEqual(2)

    // Check that the primary domain is first in the list (due to orderBy)
    expect(response.data?.[0]?.isPrimary, 'First domain in list should be primary').toBe(true)
  })

  it('respects the limit parameter when listing domains', async () => {
    // Ensure there are at least two domains
    await createTestDomain()
    await createTestDomain()

    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'list',
      orgId,
      limit: 1,
      caller: 'test-list-limit',
    })

    expect(response.data?.length, 'Should return exactly 1 domain').toBe(1)
    expect(response.indexMeta?.limit, 'Limit should be 1').toBe(1)
    expect(response.indexMeta?.count, 'Count should be greater than limit').toBeGreaterThan(1)
  })

  it('enforces security by only allowing access to own org', async () => {
    // Create a new user in a different org
    const { user: _otherUser, orgId: otherOrgId } = await createTestUser({ fields: { email: `test-${shortId()}@example.com` }, fictionUser})

    console.log('Other Org ID:', otherOrgId)
    // Create a domain in the original org
    const { domainId } = await createTestDomain()

    console.log('Domain ID:', domainId)

    // Try to access the domain using the wrong orgId
    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'retrieve',
      orgId: otherOrgId, // Different org
      where: { domainId }, // Original domain
      caller: 'test-wrong-org',
    })

    console.log('response', response)

    expect(response.status, 'Should not find domain in different org').toBe('error')
  })

  it('deletes a domain successfully', async () => {
    const { domainId } = await createTestDomain()

    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'delete',
      orgId,
      where: { domainId },
      caller: 'test-delete-domain',
    })



    expect(response.status, 'Delete should return success status').toBe('success')
    expect(response.data?.[0]?.domainId, 'Deleted domain should have correct ID').toBe(domainId)

    // Verify domain is deleted
    const checkResponse = await fictionSites.requests.ManageDomain.request({
      _action: 'retrieve',
      orgId,
      where: { domainId },
      caller: 'test-verify-deleted',
    })


    expect(checkResponse.status, 'Domain should no longer exist').toBe('error')
  })

  it('validates required fields', async () => {
     // @ts-expect-error - Testing missing required field
     const r1 = await fictionSites.requests.ManageDomain.request({
      _action: 'list',
      caller: 'test-missing-orgId',
    })

    expect(r1.status, 'List should return error status').toBe('error')

    // @ts-expect-error - Testing missing required field
    const r2 = await fictionSites.requests.ManageDomain.request({
      orgId,
      caller: 'test-missing-action',
    })

    expect(r2.status, 'List should return error status').toBe('error')
  })

  // Direct DB verification test to ensure transactional integrity
  it('ensures transaction integrity for primary domain updates', async () => {
    // Create two domains for this test
    const { domainId: domainAId } = await createTestDomain({ isPrimary: true })
    const { domainId: domainBId } = await createTestDomain({ isPrimary: false })

    // Verify directly in the database that only one is primary
    const domains = await fictionDb.client()(t.domains)
      .where({ orgId })
      .whereIn('domainId', [domainAId, domainBId])
      .orderBy('domainId')

    const primaryCount = domains.filter(d => d.isPrimary).length
    expect(primaryCount, 'Should have exactly one primary domain').toBe(1)
    expect(domains.find(d => d.domainId === domainAId)?.isPrimary, 'Domain A should be primary').toBe(true)

    // Clean up not needed as afterAll will clean up the test environment
  })
})
