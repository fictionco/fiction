import { setup } from '@fiction/admin/test/email.main.js'
import { isCi, toSlug } from '@fiction/core'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { afterAll, describe, expect, it } from 'vitest'

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

  const testLinkedinHandle = 'test-linkedin-handle'
  const testName = 'John Testing'
  const testHandle = 'johndoe'
  const testHeadline = 'Product Designer & Developer'
  const testAbout = 'Experienced professional focused on creating innovative solutions.'
  const testPromise = 'Build Better Products'
  const testInterests = ['Design', 'Technology']
  const testInfluences = ['Steve Jobs']

  it('completes linkedin-based onboard flow', { timeout: 180000 }, async () => {
    await kit.performActions({
      caller: 'onboardUiUx',
      path: '/',
      actions: [
        // Step 1: LinkedIn URL input
        { type: 'visible', selector: '[data-test-id="onboardingSurvey"]' },
        { type: 'visible', selector: '[data-test-id="step-linkedin"]' },
        { type: 'fill', selector: '[data-test-id="linkedinHandle"] input', text: testLinkedinHandle },
        { type: 'click', selector: '[data-test-id="step-button-linkedin"]', waitAfter: 1000 },

        // Wait for LinkedIn enrichment to complete
        { type: 'visible', selector: '[data-test-id="step-enrich"]', waitAfter: 2000 },

        // Step 2: Account details
        { type: 'visible', selector: '[data-test-id="step-account"]' },
        { type: 'fill', selector: '[data-test-id="name"] input', text: testName },
        { type: 'fill', selector: '[data-test-id="handle"] input', text: testHandle },
        { type: 'click', selector: '[data-test-id="step-button-account"]', waitAfter: 1000 },

        // Step 3: Profile details
        { type: 'visible', selector: '[data-test-id="step-profile"]', wait: 2000 },
        { type: 'fill', selector: '[data-test-id="headline"] input', text: testHeadline },
        { type: 'fill', selector: '[data-test-id="about"] textarea', text: testAbout },
        { type: 'click', selector: '[data-test-id="step-button-profile"]', waitAfter: 1000 },

        // Step 4: Interests
        { type: 'visible', selector: '[data-test-id="step-interests"]' },

        // Add interests tags - properly use fill + keyboard for Enter key
        { type: 'click', selector: '[data-test-id="interests"] input', waitAfter: 500 },
        { type: 'fill', selector: '[data-test-id="interests"] input', text: testInterests[0] },
        { type: 'keyboard', key: 'Enter', waitAfter: 300 },
        { type: 'fill', selector: '[data-test-id="interests"] input', text: testInterests[1] },
        { type: 'keyboard', key: 'Enter', waitAfter: 300 },

        // Add influences tags - properly use fill + keyboard for Enter key
        { type: 'click', selector: '[data-test-id="influences"] input', waitAfter: 500 },
        { type: 'fill', selector: '[data-test-id="influences"] input', text: testInfluences[0] },
        { type: 'keyboard', key: 'Enter', waitAfter: 300 },

        { type: 'click', selector: '[data-test-id="step-button-interests"]', waitAfter: 1000 },

        // Step 5: Branding
        { type: 'visible', selector: '[data-test-id="step-branding"]' },

        { type: 'fill', selector: '[data-test-id="promise"] input', text: testPromise },

        // Select primary color
        { type: 'click', selector: '[data-test-id="primaryColor"] input' },
        { type: 'click', selector: '[data-test-id="primaryColor"] [data-value="blue"]' },

        // Select image motif using dropdown
        { type: 'click', selector: '[data-test-id="motif"] [data-test-id="select-custom-dropdown-toggle"]', waitAfter: 500 },
        { type: 'click', selector: '[data-test-id="motif"] [data-value="swissPrecision"]', waitAfter: 300 },

        // Select content archetype using dropdown
        { type: 'click', selector: '[data-test-id="archetype"] [data-test-id="select-custom-dropdown-toggle"]', waitAfter: 500 },
        { type: 'click', selector: '[data-test-id="archetype"] [data-value="hero"]', waitAfter: 300 },

        { type: 'click', selector: '[data-test-id="step-button-branding"]', waitAfter: 1000 },

        // Wait for content generation
        { type: 'visible', selector: '[data-test-id="step-generate"]' },

        // Step 6: Ready
        { type: 'visible', selector: '[data-test-id="step-ready"]' },
        { type: 'click', selector: '[data-test-id="step-button-ready"]' },

        // Verify redirect to dashboard with welcome view
        { type: 'visible', selector: '[data-pathname="/?_view=welcome"]' },
      ],
    })

    // Verify user was updated
    const r = await kit.testUtils?.fictionUser.queries.ManageUser.serve(
      { where: { email: user.email || '' }, _action: 'retrieve' },
      { server: true, caller: 'onboard', returnAuthority: ['verify'] },
    )

    // Assertions for user profile updates
    expect(r.data?.needsOnboarding, 'User should complete onboarding').toBeFalsy()
    expect(r.data?.fullName, 'User name should be updated').toBe(testName)

    // Check organization data
    const org = r.data?.orgs?.[0]
    expect(org, 'Organization should be created').toBeTruthy()
    expect(org?.handle, 'Organization handle should match').toContain(testHandle)
    expect(org?.orgName, 'Organization name should match').toBe(testName)
    expect(org?.headline, 'Organization headline should match').toBe(testHeadline)
    expect(org?.about, 'Organization about should match').toBe(testAbout)
    expect(org?.promise, 'Organization promise should match').toBe(testPromise)
    expect(org?.interests, 'Organization interests should match').toEqual(expect.arrayContaining(testInterests.map(i => toSlug(i))))
    expect(org?.influences, 'Organization influences should match').toEqual(expect.arrayContaining(testInfluences.map(i => toSlug(i))))
    expect(org?.primaryColor, 'Organization primary color should match').toBe('blue')

    // Verify content was created
    const postsResponse = await kit.testUtils?.fictionPosts.queries.ManagePost.serve(
      { orgId: org?.orgId || '', _action: 'list' },
      { server: true },
    )

    expect(postsResponse.data?.length, 'Posts should be created').toBeGreaterThan(0)

    // Verify site was created
    const sitesResponse = await kit.testUtils?.fictionSites.queries.ManageSites.serve(
      { orgId: org?.orgId || '', _action: 'list' },
      { server: true },
    )

    expect(sitesResponse.data?.length, 'Site should be created').toBeGreaterThan(0)
    expect(sitesResponse.data?.[0].isPrimary, 'Primary site should be configured').toBeTruthy()
  })
})
