import { beforeAll, describe, expect, it } from 'vitest'
import type { KaptionTestUtils } from '../../test-utils'
import { createKaptionTestUtils } from '../../test-utils'
import { saveKaptionEvents } from '../../test-utils/analytics'
import { KaptionTracking } from '..'

let testUtils: KaptionTestUtils
let kaptionTracking: KaptionTracking
describe('tracking handling', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils()
    kaptionTracking = new KaptionTracking({ ...testUtils })
    testUtils.initialized = await testUtils.init()
  })
  it('sets to active after recieving events', async () => {
    const projectId = testUtils.factorAdmin.activeProjectId.value
    const bearer = testUtils.initialized?.user
    if (!projectId)
      throw new Error('projectId missing')
    if (!bearer)
      throw new Error('bearer missing')

    const r1 = await kaptionTracking.queries.ManageTracking.serve(
      {
        _action: 'refresh',
        projectId,
      },
      { server: true, bearer },
    )

    expect(r1.status).toBe('success')
    expect(r1.data?.trackingStatus).toBe('pending')

    await saveKaptionEvents(testUtils)

    const r2 = await kaptionTracking.queries.CurrentTrackingStatus.serve(
      { projectId },
      { server: true },
    )

    expect(r2.data).toBe('active')

    const r3 = await kaptionTracking.queries.ManageTracking.serve(
      {
        _action: 'refresh',
        projectId,
      },
      { server: true, bearer },
    )

    expect(r3.status).toBe('success')
    expect(r3.data?.trackingStatus).toBe('active')
    expect(r3.user).toBeTruthy()

    const userProject = r3.user?.organizations
      .flatMap(_ => _.projects)
      .find(_ => _.projectId === projectId)

    expect(userProject?.trackingStatus).toBe('active')
  })
})
