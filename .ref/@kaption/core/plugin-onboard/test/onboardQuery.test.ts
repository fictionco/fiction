import { beforeAll, describe, expect, it } from 'vitest'
import type { KaptionTestUtils } from '../../test-utils'
import { createKaptionTestUtils } from '../../test-utils'
import { KaptionOnboard } from '..'

let testUtils: KaptionTestUtils
let kaptionOnboard: KaptionOnboard
describe('onboard', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils()
    kaptionOnboard = new KaptionOnboard({ ...testUtils })
    testUtils.initialized = await testUtils.init()
  })
  it('saves new options', async () => {
    const projectId = testUtils.factorAdmin.activeProjectId.value
    if (!projectId)
      throw new Error('no project id')
    let r = await kaptionOnboard.queries.ManageOnboard.serve(
      {
        _action: 'save',
        settings: { test: 'test', foo: 'bar' },
        projectId,
      },
      { server: true },
    )

    expect(r.status).toBe('success')

    expect(r.data?.test).toBe('test')

    r = await kaptionOnboard.queries.ManageOnboard.serve(
      {
        _action: 'save',
        settings: { test: null },
        projectId,
      },
      { server: true },
    )

    expect(r.data?.test).toBeFalsy()
    expect(r.data?.foo).toBe('bar')
  })
})
