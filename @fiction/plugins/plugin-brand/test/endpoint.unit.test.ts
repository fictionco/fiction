import type { BrandGuideV3 } from '../guideSchema'
import type { TableBrand } from '../schema'
import { abort } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionBrand } from '..'

describe('brand guide endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const fictionBrand = new FictionBrand(testUtils)
  const initialized = await testUtils.init()

  afterAll(() => testUtils.close())

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  // Create additional test users
  const { user: user2 } = await createTestUser(testUtils.fictionUser)
  const { user: user3 } = await createTestUser(testUtils.fictionUser)

  if (!orgId || !userId || !user2 || !user3) {
    throw abort('missing orgId or user data')
  }

  const sampleBrandGuide: BrandGuideV3 = {
    vision: 'Help creators build sustainable businesses through authentic branding',
    personality: [
      {
        title: 'Creator',
        description: 'Innovates and expresses unique ideas.',
        examples: 'Casey Neistat, Issa Rae',
      },
      {
        title: 'Authentic',
        description: 'Genuine and transparent in all interactions.',
        examples: 'Being open about both successes and failures',
      },
    ],
    pillars: [
      {
        title: 'Brand Building',
        description: 'Developing authentic personal brands',
        examples: 'Personal brand workshops, voice development guides',
      },
    ],
    audience: [
      {
        title: 'Aspiring Creators',
        description: 'People looking to build their own path in creative fields',
        examples: 'Writers, Artists, Content Creators',
      },
    ],
    constraints: [
      {
        title: 'Topics to Avoid',
        description: 'Maintain professional focus',
        examples: '"No politics", "No religion", "No industry gossip"',
      },
    ],
    colors: {
      primary: 'red',
      secondary: 'blue',
    },
  }

  it('handles primary brand guides', async () => {
    // Create three brand guides
    const createResults = await Promise.all([1, 2, 3].map(async num =>
      fictionBrand.queries.ManageBrandGuide.serve({
        _action: 'create',
        fields: {
          title: `Guide ${num}`,
          description: `Test guide ${num}`,
          guide: sampleBrandGuide,
          isPrimary: num === 1, // First guide is primary
        },
        orgId,
      }, { server: true }),
    ))

    const guides = createResults.map(r => r.data?.[0]).filter(Boolean) as TableBrand[]
    expect(guides.length).toBe(3)

    // Test retrieving primary guide
    const primaryRetrieve = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'retrieve',
      where: {},
      orgId,
    }, { server: true })

    expect(primaryRetrieve.status).toBe('success')
    expect(primaryRetrieve.data?.[0].title).toBe('Guide 1')
    expect(primaryRetrieve.data?.[0].isPrimary).toBe(true)

    // Test setting a new primary
    const setPrimaryResult = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'setPrimary',
      where: { brandId: guides[1].brandId || '' },
      orgId,
    }, { server: true })

    expect(setPrimaryResult.status).toBe('success')
    expect(setPrimaryResult.data?.[0].isPrimary).toBe(true)
    expect(setPrimaryResult.data?.[0].title).toBe('Guide 2')

    // Verify old primary was unset
    const oldPrimary = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'retrieve',
      where: { brandId: guides[0].brandId },
      orgId,
    }, { server: true })

    expect(oldPrimary.data?.[0].isPrimary).toBe(false)

    // Clean up
    await Promise.all(guides.map(guide =>
      fictionBrand.queries.ManageBrandGuide.serve({
        _action: 'delete',
        where: { brandId: guide.brandId },
        orgId,
      }, { server: true }),
    ))
  })

  it('bulk create brand guides', async () => {
    const guides: TableBrand[] = [
      {
        title: 'Brand Guide 1',
        description: 'First test guide',
        guide: { ...sampleBrandGuide },
      },
      {
        title: 'Brand Guide 2',
        description: 'Second test guide',
        guide: {
          ...sampleBrandGuide,
          personality: [{
            title: 'Sage',
            description: 'Shares wisdom and deep insights',
            examples: 'Neil deGrasse Tyson, Brené Brown',
          }],
        },
      },
    ] as const

    const createResults = await Promise.all(guides.map(guide =>
      fictionBrand.queries.ManageBrandGuide.serve({
        _action: 'create',
        fields: guide,
        orgId,
      }, { server: true }),
    ))

    createResults.forEach((r) => {
      expect(r.status).toBe('success')
      expect(r.data?.length).toBe(1)
      expect(r.data?.[0].guide?.personality).toBeDefined()
      expect(r.data?.[0].guide?.vision).toBeDefined()
    })

    const brandIds = createResults.map(r => r.data?.[0].brandId).filter(Boolean) as string[]
    expect(brandIds.length).toBe(2)

    await Promise.all(brandIds.map(brandId =>
      fictionBrand.queries.ManageBrandGuide.serve({
        _action: 'delete',
        where: { brandId },
        orgId,
      }, { server: true }),
    ))
  })

  it('create single brand guide', async () => {
    const r = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'create',
      fields: {
        title: 'Test Guide',
        description: 'Test description',
        guide: sampleBrandGuide,
      },
      orgId,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].guide?.personality?.[0].title).toBe('Creator')
    expect(r.data?.[0].guide?.vision).toBeDefined()

    const r2 = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'create',
      fields: {
        title: 'Second Guide',
        description: 'Another test guide',
        orgId,
        guide: {
          ...sampleBrandGuide,
          personality: [{
            title: 'Hero',
            description: 'Overcomes challenges to inspire',
            examples: 'David Goggins, Simone Biles',
          }],
        },
      },
      orgId,
    }, { server: true })

    expect(r2.status).toBe('success')
  })

  it('update brand guide', async () => {
    const list = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    const brandId = list.data?.[0].brandId

    const r = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'update',
      orgId,
      where: { brandId },
      fields: {
        title: 'Updated Title',
        description: 'Updated description',
        guide: {
          ...sampleBrandGuide,
          personality: [{
            title: 'Rebel',
            description: 'Challenges status quo through authentic voice',
            examples: 'Malcolm Gladwell, Gary Vaynerchuk',
          }],
          vision: 'Become the leading voice in creator education',
        },
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].guide?.personality?.[0].title).toBe('Rebel')
    expect(r.data?.[0].guide?.vision).toContain('leading voice')
  })

  it('handles invalid requests', async () => {
    const invalidCreate = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'create',
      fields: {
        orgId,
        guide: {
          ...sampleBrandGuide,
          colors: {
            // @ts-expect-error test invalid color format
            primary: 'not-a-valid-color',
          },
        },
      },
      orgId,
    }, { server: true, expectError: true })

    expect(invalidCreate.status).toBe('error')

    expect(invalidCreate).toMatchInlineSnapshot(`
      {
        "code": "OPERATION_FAILED",
        "context": "ManageBrandGuideQuery",
        "data": undefined,
        "expose": true,
        "httpStatus": 500,
        "location": undefined,
        "message": "[EXPECTED] title is required to create brand guide",
        "reason": "[EXPECTED] title is required to create brand guide",
        "status": "error",
      }
    `)

    const invalidRetrieve = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'retrieve',
      where: { brandId: 'non-existent-id' },
      orgId,
    }, { server: true, expectError: true })

    expect(invalidRetrieve.status).toBe('error')
    expect(invalidRetrieve.message).toBe('Brand guide not found')
  })
})
