import { fastHash, getRouter, isNode, logger, onEvent, userInitialized } from '@factor/api'
import type {
  ComputedRef,
  Ref,
  WritableComputedRef,
} from 'vue'
import {
  computed,
  ref,
  watch,
} from 'vue'

import { serviceConfigSetting } from '@factor/api/engine/plugins'
import type {
  DashboardLayout,
  QueryParams,
  SocketMessageMap,
  WidgetConfigUser,
} from '@kaption/suite-dashboards/types'
import type { Widget } from '@kaption/suite-dashboards/widget'
import { sendSocketMessage } from '@kaption/core/plugin-dashboards./../../.ref-dashboard/__dataEngineSocket'
import {
  activeOrganization,
  activeProjectId,
} from '@kaption/engine/activeProject/activeProject'
import { activeRequest } from '@kaption/engine/active/engine/active'

export type LayoutMap = Record<string, WidgetConfigUser>

export function allWidgets(): Widget[] {
  const a = serviceConfigSetting('widgets') ?? []
  return a
}

class TheDataHandler {
  dataInitializing: boolean
  routeWatch?: () => void | undefined
  activeWidgetList: Ref<WidgetConfigUser[]>

  /**
   * Active layout map is a map with widgetId as key
   * Used to handle and assign data
   */
  activeLayoutMap: Ref<LayoutMap>
  constructor() {
    this.dataInitializing = false

    this.activeWidgetList = ref<WidgetConfigUser[]>([])

    this.activeLayoutMap = ref<LayoutMap>({})

    if (isNode)
      return

    this.engineEventListeners()
  }

  private sendDataInitializer = async (
    mode: 'initial' | 'realtime',
  ): Promise<void> => {
    if (this.dataInitializing)
      return
    else this.dataInitializing = true

    if (mode === 'initial')
      this.setRequestsLoading()

    // wait for projectId
    await userInitialized()

    const widgetList = this.activeWidgetList.value

    // in case no widgets, don't run request
    if (widgetList.length === 0 || !activeProjectId.value)
      return

    // Run validations to avoid unnecessary requests
    const layout = widgetList.filter((_) => {
      return !(mode === 'realtime' && !_.realtime)
    })

    const params: QueryParams = {
      layout,
      mode,
      ...activeRequest.value,
    }

    await sendSocketMessage(['query', { _method: 'widgets', params }])

    this.dataInitializing = false
  }

  private setRequestsLoading = (): void => {
    this.activeWidgetList.value.forEach((config: WidgetConfigUser) => {
      const { widgetId } = config
      if (!widgetId)
        return

      const cur = this.activeLayoutMap.value[widgetId]
      if (cur)
        this.activeLayoutMap.value[widgetId] = { ...cur, loading: true }
    })
  }

  /**
   * Watches the route for changes and initializes data requests
   * when things have changed. Runs on initial call.
   */
  private watchForParamChanges = (): void => {
    if (this.routeWatch)
      this.routeWatch()

    this.routeWatch = watch(
      () => activeRequest.value,
      async (v, old) => {
        const route = getRouter().currentRoute.value

        // only run on dashboard pages
        if (
          !v.projectId
          || JSON.stringify(v) === JSON.stringify(old)
          || (!route.path.includes('dash') && route.name !== 'Dashboard')
        ) {

        }
        else if (v && v.projectId) {
          await resetSpecificParams(v, old)

          await this.sendDataInitializer('initial')

          // runRealTimeLoop()
        }
      },
      { immediate: true },
    )
  }

  /**
   * Takes the initial saveable layout and runs adds data handling
   * Then passes to socket requester
   */
  public layoutDataEngine = (layout: WidgetConfigUser[]): Ref<LayoutMap> => {
    this.activeWidgetList.value = layout

    this.activeWidgetList.value.forEach((config: WidgetConfigUser) => {
      const { widgetKey, widgetId } = config

      if (!widgetId)
        return
      const ws = allWidgets() ?? []

      const theWidget = ws.find((w) => {
        return w.key === widgetKey
      })

      if (!theWidget) {
        logger.log({
          level: 'error',
          context: 'layoutDataEngine',
          description: `${widgetKey} not in map`,
          data: { layout, widgetKey },
        })
        return
      }

      this.activeLayoutMap.value[widgetId] = {
        ...theWidget.getConfig(),
        ...config,
        data: { main: [] },
        loading: true,
      }
    })

    this.watchForParamChanges()

    return this.activeLayoutMap
  }

  engineEventListeners = (): void => {
    // activityTrigger({
    //   onActive: () => {
    //     __loopCount = 1
    //   },
    // })

    /**
     * Remove query vars that shouldn't transfer between route paths
     * @Note that on initial load the path is set to '/'
     * this may be related to a setting
     */
    getRouter().beforeEach((to, from, next) => {
      if (from.path !== '/' && to.path !== from.path) {
        const { id, dimension } = to.query

        if (id || dimension) {
          logger.log({
            level: 'info',
            context: 'router',
            description: 'removed items from url',
          })
          delete to.query.id
          delete to.query.dimension
          next(to)
        }
        else { next() }
      }
      else { next() }
    })

    onEvent('welcome', async () => {
      await this.sendDataInitializer('initial')
    })

    onEvent(
      'result:widgets',
      (socketMessage: SocketMessageMap['result:widgets']) => {
        const { status, message, data } = socketMessage
        const { result, widgetIds = [] } = data || {}
        this.activeWidgetList.value.forEach((config: WidgetConfigUser) => {
          const { widgetId } = config
          if (!widgetId)
            return

          const hasData = widgetIds.find(wid => wid === widgetId)

          if (hasData) {
            const val = this.activeLayoutMap.value[widgetId]

            const valNew: Partial<WidgetConfigUser> = {
              loading: false,
              errorMessage: status === 'success' ? '' : message,
              data: result,
            }

            // allow response to modify title (add data, etc.)
            if (result?.title)
              valNew.title = result?.title

            if (result?.description)
              valNew.description = result?.description

            this.activeLayoutMap.value[widgetId] = { ...val, ...valNew }
          }
        })
      },
    )
  }
}

export const DataHandler = new TheDataHandler()
export const activeLayoutMap = DataHandler.activeLayoutMap

class LayoutEngineClass {
  activeSelectedDashboard: WritableComputedRef<DashboardLayout>
  activeDashboards: ComputedRef<DashboardLayout[]>
  customizer: Ref<Record<string, DashboardLayout>>
  DataHandler: TheDataHandler
  activeWidgetList: Ref<WidgetConfigUser[]> = ref([])
  allWidgets = serviceConfigSetting('widgets') ?? []
  dataInitializing = false
  /**
   * Active layout map is a map with widgetId as key
   * Used to handle and assign data
   */
  activeLayoutMap: Ref<LayoutMap> = ref({})
  constructor(params: { DataHandler: TheDataHandler }) {
    this.DataHandler = params.DataHandler
    this.activeSelectedDashboard = this.getActiveSelectedDashboard()
    this.activeDashboards = this.getActiveDashboards()
    this.customizer = ref<Record<string, DashboardLayout>>({})

    this.watchChanges()
  }

  private watchChanges(): void {
    watch(
      () => this.activeSelectedDashboard.value,
      (v: DashboardLayout<WidgetConfigUser>) => {
        this.setNewLayout(v.layout)
      },
      { immediate: true },
    )
    watch(
      () => activeRequest.value,
      async (v, old) => {
        const route = getRouter().currentRoute.value

        // only run on dashboard pages
        if (
          !v.projectId
          || JSON.stringify(v) === JSON.stringify(old)
          || (!route.path.includes('dash') && route.name !== 'Dashboard')
        ) {

        }
        else if (v && v.projectId) {
          await resetSpecificParams(v, old)

          await this.sendDataInitializer('initial')
        }
      },
      { immediate: true },
    )
  }

  private setRequestsLoading = (): void => {
    this.activeWidgetList.value.forEach((config: WidgetConfigUser) => {
      const { widgetId } = config
      if (!widgetId)
        return

      const cur = this.activeLayoutMap.value[widgetId]
      if (cur)
        this.activeLayoutMap.value[widgetId] = { ...cur, loading: true }
    })
  }

  private sendDataInitializer = async (
    mode: 'initial' | 'realtime',
  ): Promise<void> => {
    if (this.dataInitializing)
      return
    else this.dataInitializing = true

    if (mode === 'initial')
      this.setRequestsLoading()

    // wait for projectId
    await userInitialized()

    const widgetList = this.activeWidgetList.value

    // in case no widgets, don't run request
    if (widgetList.length === 0 || !activeProjectId.value)
      return

    // Run validations to avoid unnecessary requests
    const layout = widgetList.filter((_) => {
      return !(mode === 'realtime' && !_.realtime)
    })

    const params: QueryParams = {
      layout,
      mode,
      ...activeRequest.value,
    }

    await sendSocketMessage(['query', { _method: 'widgets', params }])

    this.dataInitializing = false
  }

  public setNewLayout = (layout: WidgetConfigUser[]): Ref<LayoutMap> => {
    this.activeWidgetList.value = layout

    this.activeWidgetList.value.forEach((config: WidgetConfigUser) => {
      const { widgetKey, widgetId } = config

      if (!widgetId)
        return

      const theWidget = this.allWidgets.find((w) => {
        return w.key === widgetKey
      })

      if (!theWidget) {
        logger.log({
          level: 'error',
          description: `${widgetKey} missing`,
          data: { layout },
        })
        return
      }

      this.activeLayoutMap.value[widgetId] = {
        ...theWidget.getConfig(),
        ...config,
        data: { main: [] },
        loading: true,
      }
    })

    return this.activeLayoutMap
  }

  private getActiveDashboards(): ComputedRef<
    DashboardLayout<WidgetConfigUser>[]
  > {
    return computed<DashboardLayout<WidgetConfigUser>[]>(() => {
      const org = activeOrganization.value
      const dashboards = org?.dashboards ?? {}

      let out = this.getDefaultLayouts()

      /**
       * Parse default layouts and see if there is custom one saved to override
       * Validate the widgets in the layout to avoid errors
       */
      out = out.map((dash) => {
        const { dashboardId } = dash

        const savedDashboard = dashboards[dashboardId]

        if (savedDashboard) {
          const { dashboardName, layout } = savedDashboard
          dash.isCustomized = true
          if (dashboardName)
            dash.dashboardName = dashboardName
          if (layout) {
            const filtered = layout.filter(
              _ =>
                _.widgetKey && allWidgets()?.find(w => w.key === _.widgetKey),
            )
            if (filtered.length > 0)
              dash.layout = filtered
          }
        }
        return dash
      })

      const customDashboards = Object.values(dashboards)
        .filter((_) => {
          return (
            _
            && _.dashboardId
            && !out.some(d => d.dashboardId === _.dashboardId)
          )
        })
        .map((_) => {
          return { ..._, custom: true }
        }) as DashboardLayout[]

      out.push(...customDashboards)

      const final = out
        .filter(_ => _.dashboardId)
        .map((dashboard) => {
          const o: DashboardLayout = {
            ...dashboard,
            ...this.customizer.value[dashboard.dashboardId],
          }

          /**
           * Add widgetId based on hash of config
           */
          o.layout = o.layout.map(
            (config: WidgetConfigUser): WidgetConfigUser => {
              // don't hash with widgetId inside, causes mismatch
              delete config.widgetId

              const widgetId = fastHash({
                ...config,
                projectId: activeProjectId.value,
              })
              return { ...config, widgetId }
            },
          )

          return o
        })

      return final
    })
  }

  private getActiveSelectedDashboard(): WritableComputedRef<DashboardLayout> {
    return computed<DashboardLayout>({
      get: () => {
        const dashboardId = getRouter().currentRoute.value.params
          .dashboardId as string | undefined

        const dash
          = dashboardId
          && this.activeDashboards.value.find(_ => _.dashboardId === dashboardId)

        return dash || this.activeDashboards.value[0]
      },
      set: (v) => {
        this.customizer.value = {
          ...this.customizer.value,
          [v.dashboardId]: v,
        }
      },
    })
  }

  private getDefaultLayouts(): DashboardLayout[] {
    return [
      {
        dashboardId: 'overview',
        dashboardName: 'Overview',
        layout: [
          { widgetKey: 'UniqueVisitors' },
          { widgetKey: 'ReturningVisitors' },
          // { widgetKey: "averageViews"},
          // { widgetKey: "bounceRate"},
          { widgetKey: 'EngageDuration' },
          { widgetKey: 'SessionDuration' },
          // { widgetKey: "averageScrollDepth"},
          // { widgetKey: "averageScrolls"},
          { widgetKey: 'ActiveUsers' },
          // { widgetKey: "activeConversions" },
          // { widgetKey: "topDevices" },
          // { widgetKey: "topCountries" },
          // { widgetKey: "topBrowsers" },
          // { widgetKey: "topPages" },
          // { widgetKey: "topOperatingSystems" },
          // { widgetKey: "topReferrers" },
          // { widgetKey: "topSources" },
          // { widgetKey: "topCampaigns" },
          // { widgetKey: "topMediums" },
          // { widgetKey: "topEventLabel" },
          // { widgetKey: "topEventCategory" },
          // { widgetKey: "topEventAction" },
          // { widgetKey: "topMicroConversions" },
          // { widgetKey: "topMacroConversions" },
        ],
      },

      // {
      //   dashboardId: "realtime",
      //   dashboardName: "Realtime",
      //   dashboardMode: ["realtime"],
      //   layout: [
      //     { widgetKey: "activeUsers" },
      //     { widgetKey: "activeConversions" },
      //     { widgetKey: "globeVisitors", realtime: true },
      //     { widgetKey: "topDevices", realtime: true },
      //     { widgetKey: "topPages", realtime: true },
      //     { widgetKey: "topReferrers", realtime: true },
      //     { widgetKey: "topSources", realtime: true },
      //     { widgetKey: "topEventName", realtime: true },
      //     { widgetKey: "topEventLabel", realtime: true },
      //     { widgetKey: "topEventCategory", realtime: true },
      //     { widgetKey: "topEventAction", realtime: true },
      //     { widgetKey: "topMicroConversions", realtime: true },
      //     { widgetKey: "topMacroConversions", realtime: true },
      //   ],
      // },
      // {
      //   dashboardId: "reports",
      //   dashboardName: "Reports",
      //   dashboardMode: ["dimension"],
      //   layout: [
      //     { widgetKey: "dimensionChart" },
      //     { widgetKey: "dimensionTable" },
      //   ],
      // },
      // {
      //   dashboardId: "replay",
      //   dashboardName: "Session Replay",
      //   pageComponent: def(() => import(`./replay/DashboardPage.vue`)),
      //   layout: [
      //     { widgetKey: "totalReplays" },
      //     { widgetKey: "timeRecorded" },
      //     { widgetKey: "replayIndex" },
      //   ],
      //   screenshot: screenReplay,
      // },
      // {
      //   dashboardId: "heatmaps",
      //   dashboardName: "Heatmaps",
      //   dashboardMode: ["heatmap"],
      //   layout: [
      //     { widgetKey: "totalClicks"},
      //     { widgetKey: "totalTouches"},
      //     { widgetKey: "totalScrolls"},
      //     { widgetKey: "averageScrollDepth"},
      //     { widgetKey: "heatmap" },
      //   ],
      //   screenshot: screenHeatmap,
      // },

      // {
      //   dashboardId: "conversions",
      //   dashboardName: "Conversions",
      //   layout: [
      //     { widgetKey: "totalMacroConversions" },
      //     { widgetKey: "macroConversionRate" },
      //     { widgetKey: "totalMicroConversions" },
      //     { widgetKey: "microConversionRate" },
      //     { widgetKey: "topMacroConversions" },
      //     { widgetKey: "topMicroConversions" },
      //     { widgetKey: "topMacroReferrers" },
      //     { widgetKey: "topMacroCampaigns" },
      //   ],
      //   screenshot: screenConversions,
      // },
      // {
      //   dashboardId: "behavior",
      //   dashboardName: "Behavior",
      //   layout: [
      //     { widgetKey: "engageDuration"},
      //     { widgetKey: "totalClicks"},
      //     { widgetKey: "totalTouches"},
      //     { widgetKey: "averageScrollDepth"},
      //     { widgetKey: "totalScrolls"},
      //     { widgetKey: "averageScrolls"},
      //     { widgetKey: "averageTouches"},
      //     { widgetKey: "averageEvents"},
      //     { widgetKey: "totalEvents"},
      //     { widgetKey: "totalViews"},
      //     { widgetKey: "averageViews"},
      //   ],
      //   screenshot: screenBehavior,
      // },
      // {
      //   dashboardId: "security",
      //   dashboardName: "Security",
      //   layout: [
      //     { widgetKey: "averageRobot" },
      //     { widgetKey: "totalRobot" },
      //     { widgetKey: "topRobotCities" },
      //     { widgetKey: "topRobotCountries" },
      //     { widgetKey: "topRobotDevices" },
      //     { widgetKey: "topRobotIps" },
      //     { widgetKey: "topRobotReferrers" },
      //     { widgetKey: "topRobotCampaign" },
      //     { widgetKey: "topRobotSource" },
      //     { widgetKey: "topRobotMedium" },
      //   ],
      //   screenshot: screenSecurity,
      // },
      // {
      //   dashboardId: "performance",
      //   dashboardName: "Performance",
      //   layout: [
      //     { widgetKey: "firstInputDelay" },
      //     { widgetKey: "largestContentfulPaint" },
      //     { widgetKey: "layoutShift" },
      //     { widgetKey: "totalBlockingTime" },
      //     { widgetKey: "errorPages", colSpan: 6 },
      //     { widgetKey: "topErrors", colSpan: 6 },
      //   ],
      //   screenshot: screenPerformance,
      // },
    ]
  }
}

export const LayoutEngine = new LayoutEngineClass({ DataHandler })
export const activeSelectedDashboard = LayoutEngine.activeSelectedDashboard
export const activeDashboards = LayoutEngine.activeDashboards
