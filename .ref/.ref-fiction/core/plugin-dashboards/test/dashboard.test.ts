/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */

import { beforeAll, describe, expect, it } from 'vitest'

import type { TestUtils } from '@factor/api/test-utils/init'
import { createTestUtils } from '@factor/api/test-utils/init'
import type { DashboardSettings } from '..'
import { FactorDashboard } from '..'
import { FactorAdmin } from '../../plugin-admin'

let workingDashboard: DashboardSettings | undefined

let testUtils: (TestUtils & { factorDashboard?: FactorDashboard }) | undefined
describe('dashboard engine', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()

    testUtils.factorAdmin = new FactorAdmin({
      ...testUtils,
    })
    testUtils.factorDashboard = new FactorDashboard({
      ...testUtils,
      factorAdmin: testUtils.factorAdmin,
    })

    testUtils.initialized = await testUtils.init()
  })

  it('gets dashboard config', () => {
    if (!testUtils?.factorDashboard)
      throw new Error('no test utils')

    expect(
      testUtils?.factorDashboard.activeLayout.value.length,
    ).toMatchInlineSnapshot('0')
  })

  it('gets widget config', () => {
    if (!testUtils?.factorDashboard)
      throw new Error('no test utils')

    expect(testUtils?.factorDashboard.widgets).toMatchInlineSnapshot('[]')
  })

  it('creates new dashboard', async () => {
    if (!testUtils?.factorDashboard)
      throw new Error('no test utils')

    const r = await testUtils.factorDashboard.requestManageDashboard({
      _action: 'create',
      dashboardName: 'Test Dashboard',
    })

    workingDashboard = r.data
    expect(Object.keys(r.data || {})).toMatchInlineSnapshot(`
      [
        "createdAt",
        "updatedAt",
        "dashboardId",
        "dashboardName",
        "dashboardType",
      ]
    `)
    expect(r.status).toBe('success')

    expect(workingDashboard?.dashboardName).toBe('Test Dashboard')
    expect(
      Object.values(testUtils.factorDashboard.activeDashboards.value).find(
        d => d?.dashboardName === 'Test Dashboard',
      ),
    ).toBeTruthy()

    expect(
      testUtils.factorDashboard.activeDashboards.value.map(d => d.dashboardId)
        .length,
    ).toMatchInlineSnapshot('2')
  })

  it('deletes dashboard', async () => {
    if (!testUtils?.factorDashboard)
      throw new Error('no test utils')

    if (!workingDashboard?.dashboardId)
      throw new Error('no working dashboard')
    const r = await testUtils.factorDashboard.requestManageDashboard({
      _action: 'delete',
      dashboardId: workingDashboard.dashboardId,
    })

    expect(
      Object.values(testUtils.factorDashboard.activeDashboards.value).find(
        d => d?.dashboardName === 'Test Dashboard',
      ),
    ).toBeFalsy()

    expect(r.data?.dashboardId).toEqual(workingDashboard.dashboardId)
  })
})
