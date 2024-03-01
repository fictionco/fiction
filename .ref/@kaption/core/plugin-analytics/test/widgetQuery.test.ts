/**
 * @vitest-environment jsdom
 */
import type { SpyInstance } from 'vitest'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { TestUtils } from '@factor/api/testUtils'
import { createTestUtils, snap } from '@factor/api/testUtils'
import type { EndpointResponse } from '@factor/api'
import { waitFor } from '@factor/api'
import { QueryWidget, Widget } from '@factor/api/plugin-dashboards/widget'
import type {
  DataCompared,
  QueryParamsRefined,
  WidgetRequestResponse,
} from '@factor/api/plugin-dashboards/types'
import { Dashboard } from '@factor/api/plugin-dashboards'

let widgets: Widget[] = []
const el = () => import('../../../../@factor/api/plugin-dashboards/test/ElTest.vue')
let testUtils: TestUtils | undefined
let spyRequest: SpyInstance
let spyResponse: SpyInstance
class TestQuery extends QueryWidget {
  async query(params: QueryParamsRefined): Promise<DataCompared<unknown>> {
    return { main: ['test'], mainTotals: [1], params }
  }
}
describe('widget query handling', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()

    if (!testUtils.kaptionDashboard)
      throw new Error('no dashboard')

    await testUtils.kaptionDashboard.createDevSocketHandling()

    const dashboardId = 'testDashboard'

    const dash = new Dashboard({
      dashboardId,
      dashboardName: 'Dr. Test',
      layout: [
        { widgetKey: 'topBrowsers' },
        { widgetKey: 'topCountries' },
        { widgetKey: 'anotherWidget' },
      ],
    })

    const sharedQuery = new TestQuery({
      service: testUtils,
      key: 'shareMe',
      groupBy: 'browser',
    })

    widgets = [
      new Widget({
        widgetKey: 'topBrowsers',
        queryHandler: sharedQuery,
        el,
      }),
      new Widget({
        widgetKey: 'topCountries',
        queryHandler: new TestQuery({
          service: testUtils,
          groupBy: 'countryCode',
        }),
        title: 'Top Countries',
        description: 'List of visitor countries',
        layoutHandling: 'list',
        ui: {
          aggregationFormat: 'country',
        },
        el,
      }),
      new Widget({
        widgetKey: 'anotherWidget',
        queryHandler: sharedQuery,
        ui: {},
        el,
      }),
    ]
    testUtils.kaptionDashboard.addDashboards([dash])
    testUtils.kaptionDashboard.addWidgets(widgets)

    spyRequest = vi.spyOn(testUtils.kaptionDashboard, 'serverRunLayoutQuery')
    spyResponse = vi.spyOn(testUtils.kaptionDashboard, 'clientHandleWidgetData')

    testUtils.initialized = await testUtils.init()

    const projectId = testUtils.factorAdmin.activeProject.value?.projectId

    const r = testUtils.factorRouter

    const link = r.link('dashboardSingle', {
      projectId,
      dashboardId,
    }).value
    await r.router.push(link)
  })

  it('creates clientSocket (browser) and widgetServer (node)', async () => {
    expect(testUtils?.kaptionDashboard?.clientSocket).toBeTruthy()
    expect(testUtils?.kaptionDashboard?.widgetServer).toBeTruthy()
    const q = testUtils?.kaptionFilter?.activeRequest.value
    expect(snap(q)).toMatchInlineSnapshot(`
      {
        "compare": "period",
        "filters": [],
        "interval": "day",
        "noCache": "true",
        "page": "1",
        "projectId": "[id:**************************]",
        "timeEndAtIso": "[dateTime:]",
        "timeStartAtIso": "[dateTime:]",
        "timeZone": "America/Los_Angeles",
      }
    `)
  })

  it('sends layout query', async () => {
    if (!spyRequest || !spyResponse)
      throw new Error('no spy')

    await waitFor(500)

    const currentPath
      = testUtils?.factorRouter.router.currentRoute.value.path ?? ''

    const rep = currentPath.replace(/[\w.]{26}/g, '---ID---')
    expect(rep).toMatchInlineSnapshot('"/project/---ID---/dash/testDashboard"')

    expect(testUtils?.kaptionDashboard?.activeDashboard.value)
      .toMatchInlineSnapshot(`
        Dashboard {
          "controls": [],
          "createdAt": undefined,
          "dashboardId": "testDashboard",
          "dashboardMode": undefined,
          "dashboardName": "Dr. Test",
          "dashboardType": "plugin",
          "isCustomized": undefined,
          "layout": [
            {
              "widgetKey": "topBrowsers",
            },
            {
              "widgetKey": "topCountries",
            },
            {
              "widgetKey": "anotherWidget",
            },
          ],
          "pageComponent": undefined,
          "params": {},
          "priority": 100,
          "screenshot": undefined,
          "showMain": false,
          "updatedAt": undefined,
        }
      `)

    expect(spyRequest).toHaveBeenCalled()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const requests = spyRequest.mock?.calls?.map(_ => _[0])

    expect(snap(requests)).toMatchInlineSnapshot(`
      [
        {
          "compare": "period",
          "filters": [],
          "interval": "day",
          "layout": [
            {
              "description": "",
              "dimension": "browser",
              "hashId": "[id:********************************]",
              "layoutHandling": "list",
              "params": {},
              "title": "",
              "ui": {},
              "widgetKey": "topBrowsers",
            },
            {
              "description": "List of visitor countries",
              "dimension": "countryCode",
              "hashId": "[id:********************************]",
              "layoutHandling": "list",
              "params": {},
              "title": "Top Countries",
              "ui": {
                "aggregationFormat": "country",
              },
              "widgetKey": "topCountries",
            },
            {
              "description": "",
              "dimension": "browser",
              "hashId": "[id:********************************]",
              "layoutHandling": "list",
              "params": {},
              "title": "",
              "ui": {},
              "widgetKey": "anotherWidget",
            },
          ],
          "mode": "initial",
          "noCache": "true",
          "page": "1",
          "projectId": "[id:**************************]",
          "queryHandlerKey": "shareMe",
          "timeEndAtIso": "[dateTime:]",
          "timeStartAtIso": "[dateTime:]",
          "timeZone": "America/Los_Angeles",
        },
      ]
    `)

    const c = spyResponse.mock
      ?.calls as EndpointResponse<WidgetRequestResponse>[][]
    const responses = c?.map(_ => _[0]).map(_ => _.data)

    const hashIds = responses.map(_ => _?.hashIds.length) as number[]

    expect(hashIds).toEqual([2, 1])

    const results = responses.map((_) => {
      const r = _?.result
      delete r?.params // prevent snapshot update
      return r
    })

    expect(snap(results)).toMatchInlineSnapshot(`
      [
        {
          "main": [
            "test",
          ],
          "mainTotals": [
            "1",
          ],
        },
        {
          "main": [
            "test",
          ],
          "mainTotals": [
            "1",
          ],
        },
      ]
    `)
  })
})
