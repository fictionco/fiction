/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { beforeAll, describe, it } from 'vitest'

type CurrentTestUtils = TestUtils
let testUtils: CurrentTestUtils | undefined
let _orgId: string | undefined = undefined

describe('usage handling', () => {
  beforeAll(async () => {
    testUtils = createTestUtils()

    await testUtils.init()

    _orgId = testUtils.fictionUser.activeOrgId.value
  })

  it('adds and gets usage', async () => {
    //   if (!testUtils || !orgId) throw new Error("missing items")
    //   const ra = await testUtils.fictionUsage.requests.ManageUsage.projectRequest(
    //     {
    //       _action: "addNew",
    //       usageConfig: { minutes: 150 },
    //     },
    //   )
    //   await testUtils.fictionUsage.requests.ManageUsage.projectRequest({
    //     _action: "addNew",
    //     usageConfig: { minutes: 42 },
    //   })
    //   expect(snap(ra.data)).toMatchInlineSnapshot(`
    //     {
    //       "createdAt": "[dateTime:]",
    //       "endedAt": null,
    //       "meta": null,
    //       "minutes": "150",
    //       "orgId": "[id:**************************]",
    //       "startedAt": null,
    //       "updatedAt": "[dateTime:]",
    //       "usageId": "[id:************************]",
    //       "userId": "[id:**************************]",
    //     }
    //   `)
    //   const r2 = await testUtils.fictionUsage.requests.ManageUsage.projectRequest(
    //     {
    //       _action: "getUsage",
    //       cycleStartAtIso: dayjs().subtract(1, "day").toISOString(),
    //       cycleEndAtIso: dayjs().add(1, "minute").toISOString(),
    //     },
    //   )
    //   expect(+(r2.data?.minutes || 0)).toBe(192)
    //   expect(snap(r2.data)).toMatchInlineSnapshot(`
    //     {
    //       "minutes": "192",
    //     }
    //   `)
  })
})
