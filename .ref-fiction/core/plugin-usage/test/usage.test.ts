/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { dayjs, snap } from '@factor/api'
import type { FictionTestUtils } from '../../utils/testUtils'
import { createFictionTestUtils } from '../../utils/testUtils'

type CurrentTestUtils = FictionTestUtils
let testUtils: CurrentTestUtils | undefined
let organizationId: string | undefined

describe('usage handling', () => {
  beforeAll(async () => {
    testUtils = await createFictionTestUtils({ initialize: true })

    organizationId = testUtils.factorUser.activeOrganizationId.value
  })

  it('adds and gets usage', async () => {
    if (!testUtils || !organizationId)
      throw new Error('missing items')

    const ra = await testUtils.fictionUsage.requests.ManageUsage.projectRequest(
      {
        _action: 'addNew',
        usageConfig: { minutes: 150 },
      },
    )

    await testUtils.fictionUsage.requests.ManageUsage.projectRequest({
      _action: 'addNew',
      usageConfig: { minutes: 42 },
    })

    expect(snap(ra.data)).toMatchInlineSnapshot(`undefined`)

    const r2 = await testUtils.fictionUsage.requests.ManageUsage.projectRequest(
      {
        _action: 'getUsage',
        cycleStartAtIso: dayjs().subtract(1, 'day').toISOString(),
        cycleEndAtIso: dayjs().add(1, 'minute').toISOString(),
      },
    )

    expect(+(r2.data?.minutes || 0)).toBe(192)

    expect(snap(r2.data)).toMatchInlineSnapshot(`
      {
        "minutes": "192",
      }
    `)
  })
})
