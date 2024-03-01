import { beforeAll, describe, expect, it } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'

let testUtils: undefined | KaptionTestUtils

describe('test menu', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils()
    testUtils.initialized = await testUtils.init()
    // ui = new KaptionCoreUi({
    //   factorEnv: testUtils.factorEnv,
    //   factorRouter: testUtils.factorRouter,
    //   factorAdmin: testUtils.factorAdmin,
    //   factorApp: testUtils.factorApp,
    //   factorUser: testUtils.factorUser,
    // })
  })

  it('user has an organization and project', () => {
    const user = testUtils?.initialized?.user
    expect(user?.organizations.length).toBeGreaterThan(0)
    expect(user?.organizations.length).toMatchInlineSnapshot('2')
  })

  it('has active organization', async () => {
    const activeOrganization = testUtils?.factorAdmin.activeOrganization
    expect(activeOrganization?.value?.organizationId).toBeTruthy()
    expect(Object.keys(activeOrganization?.value ?? {}).filter(Boolean))
      .toMatchInlineSnapshot(`
        [
          "projects",
          "organizationId",
          "organizationName",
          "organizationEmail",
          "organizationStatus",
          "organizationPlan",
          "ownerId",
          "customerId",
          "customer",
          "createdAt",
          "updatedAt",
          "members",
          "memberCount",
          "relation",
        ]
      `)
  })
})
