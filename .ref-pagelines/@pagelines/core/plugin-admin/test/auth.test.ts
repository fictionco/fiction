import { beforeAll, describe, expect, it } from 'vitest'
import type { User } from '@factor/api'
import type { TestUtils } from '@factor/api/test-utils/init'
import { createTestUtils } from '@factor/api/test-utils/init'
import type { Organization } from '@factor/api/plugin-user'

let _org: Organization | undefined
let testUtils: TestUtils | undefined
let user: User | undefined

describe('test admin service', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
    await testUtils.factorDb.init()
  })
  it('creates a user', async () => {
    const key = Math.random().toString().slice(2, 8)
    const r = await testUtils?.factorUser.queries.ManageUser.serve(
      {
        fields: { email: `arpowers+${key}@gmail.com` },
        _action: 'create',
      },
      {},
    )

    user = r?.data

    expect(user?.userId).toBeTruthy()
  })

  it('creates an organization', async () => {
    if (!user?.userId)
      throw new Error('no user')

    const response
      = await testUtils?.factorUser.queries.ManageOrganization.serve(
        {
          organization: { organizationName: `test` },
          userId: user.userId,
          _action: 'create',
        },
        { bearer: user },
      )

    _org = response?.data

    expect(response?.data?.organizationId).toBeTruthy()
    expect(response?.data?.organizationName).toBe('test')
  })

  // it("creates a project", async () => {
  //   if (!user) throw new Error("no user")
  //   if (!org) throw new Error("no org")

  //   const response = await testUtils?.factorUser.queries.ManageProject.serve(
  //     {
  //       project: {
  //         origins: ["https://www.test.com"],
  //         projectName: "testProject",
  //       },
  //       organizationId: org.organizationId,
  //       userId: user.userId,
  //       _action: "create",
  //     },
  //     { bearer: user },
  //   )

  //   project = response?.data
  //   expect(project?.projectName).toBe("testProject")
  //   expect(project?.origins).toContain("https://www.test.com")

  //   expect(project?.organizationId).toBeTruthy()
  //   expect(project?.projectId).toBeTruthy()
  // })
})
