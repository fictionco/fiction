import type { TableDomainConfig } from '../tables.js'
/**
 * @vitest-environment happy-dom
 */
import { shortId } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils/init.js'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { t } from '../tables.js'
import { createSiteTestUtils } from './testUtils.js'

describe('manageDomain', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId } = await testUtils.init()
  const { fictionSites, fictionDb, fictionUser } = testUtils

  // Clear all domains before each test to ensure domain limit tests work properly
  beforeEach(async () => {
    await fictionDb.client()(t.domains).where({ orgId }).delete()
  })

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
    }, { server: true })

    // Find the created domain in the response data
    const createdDomain = response.data?.find(d => d.hostname === hostname)
    const domainId = createdDomain?.domainId

    if (!domainId) {
      throw new Error('Domain creation failed')
    }

    return { response, domainId, hostname }
  }

  it('creates a domain successfully', async () => {
    const { response, hostname } = await createTestDomain({ isPrimary: true })

    expect(response.status, 'Create should return success status').toBe('success')
    // Find the domain with our hostname
    const createdDomain = response.data?.find(d => d.hostname === hostname)
    expect(createdDomain?.hostname, 'Created domain should have correct hostname').toBe(hostname)
    expect(createdDomain?.isPrimary, 'Created domain should be set as primary').toBe(true)

    // Should return all domains for the org
    expect(response.data?.length, 'Response should include all domains for org').toBeGreaterThanOrEqual(1)
  })

  it('enforces domain limit per organization', async () => {
    // Create 3 domains (the max allowed)
    await createTestDomain()
    await createTestDomain()
    await createTestDomain()

    // Try to create a 4th domain
    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'create',
      orgId,
      fields: {
        hostname: `test-${shortId()}.example.com`,
      },
      caller: 'test-domain-limit',
    }, { expectError: true })

    expect(response.status, 'Creating more than the limit should fail').toBe('error')
    expect(response.message, 'Error message should mention the limit').toContain('Maximum of 3 domains')
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
    // Find our domain in the response data
    const retrievedDomain = response.data?.find(d => d.domainId === domainId)
    expect(retrievedDomain?.domainId, 'Retrieved domain should have correct ID').toBe(domainId)
    expect(retrievedDomain?.hostname, 'Retrieved domain should have correct hostname').toBe(hostname)

    // Should return all domains for the org
    expect(response.data?.length, 'Response should include all domains for org').toBeGreaterThanOrEqual(1)
  })

  it('retrieves all domains when only orgId is provided', async () => {
    // Create two domains including one primary
    const { domainId: primaryId } = await createTestDomain({ isPrimary: true })
    const { domainId: secondaryId } = await createTestDomain({ isPrimary: false })

    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'retrieve',
      orgId,
      where: { orgId },
      caller: 'test-retrieve-all',
    })

    expect(response.status, 'Retrieve should return success status').toBe('success')
    expect(response.data?.length, 'Should return all domains').toBe(2)

    // Primary domain should be first
    expect(response.data?.[0]?.isPrimary, 'First domain should be primary').toBe(true)
    expect(response.data?.[0]?.domainId, 'First domain should be the primary one').toBe(primaryId)

    // Second domain should be the non-primary one
    const secondDomain = response.data?.find(d => d.domainId === secondaryId)
    expect(secondDomain?.isPrimary, 'Second domain should not be primary').toBe(false)
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
    const updatedDomain = response.data?.find(d => d.domainId === domainId)
    expect(updatedDomain?.hostname, 'Updated domain should have new hostname').toBe(updatedHostname)

    // Should return all domains for the org
    expect(response.data?.length, 'Response should include all domains for org').toBeGreaterThanOrEqual(1)
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

    const secondDomain = updateResponse.data?.find(d => d.domainId === secondDomainId)
    expect(secondDomain?.isPrimary, 'Second domain should now be primary').toBe(true)

    // First domain should no longer be primary
    const firstDomain = updateResponse.data?.find(d => d.domainId === firstDomainId)
    expect(firstDomain?.isPrimary, 'Original domain should no longer be primary').toBe(false)
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
    expect(response.data?.length, 'Should return all domains').toBe(2)
    expect(response.indexMeta?.count, 'Count should match returned domains').toBe(2)

    // Check that the primary domain is first in the list (due to orderBy)
    expect(response.data?.[0]?.isPrimary, 'First domain in list should be primary').toBe(true)
  })

  it('enforces security by only allowing access to own org', async () => {
    // Create a new user in a different org
    const { user: _otherUser, orgId: otherOrgId } = await createTestUser({ fields: { email: `test-${shortId()}@example.com` }, fictionUser })

    // Create a domain in the original org
    const { domainId } = await createTestDomain()

    // Try to access the domain using the wrong orgId
    const response = await fictionSites.requests.ManageDomain.request({
      _action: 'retrieve',
      orgId: otherOrgId, // Different org
      where: { domainId }, // Original domain
      caller: 'test-wrong-org',
    })

    // The query will succeed but the domain won't be in the results
    expect(response.status, 'Should return success but no matching domains').toBe('error')
    expect(response.data, 'Should not find domain in different org').toBeFalsy()
  })

  it('deletes a domain successfully', async () => {
    const { domainId } = await createTestDomain()

    const deleteResponse = await fictionSites.requests.ManageDomain.request({
      _action: 'delete',
      orgId,
      where: { domainId },
      caller: 'test-delete-domain',
    })

    expect(deleteResponse.status, 'Delete should return success status').toBe('success')
    const deletedDomainExists = deleteResponse.data?.some(d => d.domainId === domainId)
    expect(deletedDomainExists, 'Deleted domain should no longer be in the list').toBe(false)
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
  })
})
