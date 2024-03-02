// @unocss-include
import type {
  ClientSocket,
  FactorApp,
  FactorDb,
  FactorEnv,
  FactorRouter,
  FactorServer,
  FactorUser,
  HookType,
  MenuGroup,
  MenuItem,
  vueRouter,
} from '@factor/api'
import {
  FactorObject,
  FactorPlugin,
  runHooks,
  vue,
} from '@factor/api'
import type { FactorAdmin } from '../plugin-admin'

import type { PortableWidget, Widget, WidgetConfig } from './widget'
import { ClientWidget } from './widget'
import type {
  CustomDashboardParams,
  ManageDashboardReturn,
} from './endpoint'
import {
  QueryManageCustomDashboard,
} from './endpoint'
import { routes } from './routes'
import type { WidgetServer } from './widgetServer'
import type { QueryParams, WidgetServerEventMap } from './types'

export * from './types'
export * from './widget'
export * from './utils'

type DashboardHookDictionary = {
  dashboards: { args: [Dashboard[]] }
}

interface FactorDashboardSettings {
  factorEnv: FactorEnv
  factorDb: FactorDb
  factorUser: FactorUser
  factorServer: FactorServer
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorAdmin: FactorAdmin
  widgetPort?: number
  widgetLiveUrl?: string
  isLive?: vue.Ref<boolean>
}

export interface DashboardSettings {
  dashboardId: string
  dashboardName?: string
  layout?: PortableWidget[]
  isCustomized?: boolean
  dashboardType?: 'user' | 'core' | 'plugin'
  dashboardMode?: ('standard' | 'realtime')[]
  createdAt?: number
  updatedAt?: number
  pageComponent?: vue.Component // causes 'excessive type depth' if set to component
  screenshot?: string
  priority?: number
  showMain?: boolean
  controls?: string[]
  params?: QueryParams
  icon?: string
  isActive?: (args: {
    currentRoute: vueRouter.RouteLocationNormalizedLoaded
  }) => boolean
}

export class Dashboard extends FactorObject<DashboardSettings> {
  dashboardId = this.settings.dashboardId
  dashboardName = this.settings.dashboardName ?? 'Untitled Dashboard'
  icon = this.settings.icon ?? 'i-heroicons-squares-plus'
  layout = this.settings.layout
  isCustomized = this.settings.isCustomized
  dashboardMode = this.settings.dashboardMode
  createdAt = this.settings.createdAt
  updatedAt = this.settings.updatedAt
  pageComponent = this.settings.pageComponent
  screenshot = this.settings.screenshot
  dashboardType = this.settings.dashboardType || 'plugin'
  showMain = this.settings.showMain || false
  controls = this.settings.controls || []
  params = this.settings.params || {}
  priority
    = this.settings.priority || this.dashboardType === 'core'
      ? 75
      : this.dashboardType === 'plugin'
        ? 100
        : 200

  isActive = (args: {
    currentRoute: vueRouter.RouteLocationNormalizedLoaded
  }) => {
    const { currentRoute } = args
    let result = currentRoute.params.dashboardId === this.dashboardId

    if (this.settings.isActive && this.settings.isActive(args))
      result = true

    return result
  }

  constructor(settings: DashboardSettings) {
    super('Dashboard', settings)
  }

  toJSON(): Record<string, unknown> {
    return this.utils.omit(
      this,
      'utils',
      'stop',
      'log',
      'settings',
      'toJSON',
      'tbl',
    )
  }
}

export class FactorDashboard extends FactorPlugin<FactorDashboardSettings> {
  factorEnv = this.settings.factorEnv
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorServer = this.settings.factorServer
  factorAdmin = this.settings.factorAdmin
  dashboards: Dashboard[] = []
  hooks: HookType<DashboardHookDictionary>[] = []
  widgetServer?: WidgetServer
  clientSocket?: ClientSocket<WidgetServerEventMap>
  widgets: Widget[] = []
  clientWidgets: Record<string, ClientWidget> = {}
  widgetPort = this.settings.widgetPort
  widgetLiveUrl = this.settings.widgetLiveUrl
  widgetUrl = this.getWidgetUrl()
  socketUrl = this.getWidgetUrl('ws')
  queries = this.createQueries()
  realtimeLoopCounter = 0
  realtimeIntervalStart = 5000
  realtimeTimeout?: NodeJS.Timeout
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
    basePath: '/dashboard',
  })

  root = this.utils.safeDirname(import.meta.url)
  domSelectors = {
    grid: `sortable-grid`,
    widget: `widget`,
    widgetId: `wid`,
  }

  manualDashboardId = this.utils.vue.ref<string>()
  editMode = this.utils.vue.ref<'' | 'on' | 'off' | 'revert'>('')
  isLive = this.settings.isLive ?? this.utils.vue.ref(false)
  sending = this.utils.vue.ref<string | boolean>(false)
  newPanel = this.utils.vue.ref(false)
  newWidget = this.utils.vue.ref(false)
  editWidgetVisible = vue.ref(false)
  editWidgetConfig = vue.ref<ClientWidget>()

  userDashboards = this.utils.vue.computed(() => {
    return Object.values(this.activeDashboards.value).filter(
      _ => _.showMain || _.dashboardType !== 'core',
    )
  })

  menu = this.utils.vue.computed<MenuItem[]>(() => {
    const currentRoute = this.factorRouter.router.currentRoute
    const q = currentRoute.value.query
    const menu: MenuItem[] = this.userDashboards.value.map((dashboard) => {
      const { dashboardName, dashboardId, priority, icon } = dashboard ?? {}

      const active = vue.ref(
        dashboard.isActive({ currentRoute: currentRoute.value }),
      )

      const route = this.factorRouter.link(
        'dashboardSingle',
        { dashboardId },
        q,
      )
      const name = dashboardName || this.utils.toLabel(dashboardId)
      return { name, route, priority, active, icon }
    })
    return this.utils.sortPriority(menu)
  })

  constructor(settings: FactorDashboardSettings) {
    super('dashboard', settings)

    this.factorEnv.addUiPaths([`${this.root}/app/*.vue`])
    this.factorRouter.update(routes({ factorDashboard: this }))

    this.addDashboards([
      new Dashboard({
        priority: 40,
        dashboardId: 'home',
        dashboardName: 'Home',
        dashboardType: 'core',
        icon: 'i-heroicons-home',
        showMain: true,
        layout: [],
        isActive: ({ currentRoute }) => {
          return (
            currentRoute.name === 'dashboard' && !currentRoute.params.dashboardId
          )
        },
      }),
    ])

    // adds dashboard/home route to primary menu
    this.factorAdmin?.hooks.push({
      hook: 'menus',
      callback: (menus) => {
        menus.primary.push('dashboard')
        return menus
      },
    })

    this.utils.onEvent('editWidget', (val: ClientWidget) =>
      this.editWidget(val))
    this.utils.onEvent('newWidget', () => {
      this.newWidget.value = true
    })
    this.utils.onEvent('newDashboard', () => (this.newPanel.value = true))

    this.utils.vue.watch(
      () => this.menu.value,
      (v) => {
        const existing = this.factorAdmin.orgMenu.value

        const menuGroup: MenuGroup = { groupKey: 'dashboard', menu: v }

        let newMenu: MenuGroup[]

        if (existing.some(_ => _.groupKey === 'dashboard')) {
          // replace dashboard menu group
          newMenu = existing.map(m =>
            m.groupKey === 'dashboard' ? menuGroup : m,
          )
        }
        else {
          newMenu = [menuGroup, ...existing]
        }

        this.factorAdmin.orgMenu.value = newMenu
      },
      { immediate: true },
    )
  }

  getDashboardName(dashboardId?: string): string {
    if (!dashboardId)
      return ''
    return (
      this.activeDashboards.value.find(d => d.dashboardId === dashboardId)
        ?.dashboardName || dashboardId
    )
  }

  async setup() {
    // allow dashboards to be adjusted by other plugins
    this.dashboards = await runHooks<DashboardHookDictionary>({
      list: this.hooks,
      hook: 'dashboards',
      args: [this.dashboards],
    })
  }

  updateWidgetLayout() {
    const sortableGrid = document.querySelector(`#${this.domSelectors.grid}`)
    const ws = sortableGrid?.querySelectorAll(`.${this.domSelectors.widget}`)
    if (!ws)
      return

    const arr = [...ws]
    const layoutHashIds = arr.map(el =>
      el.getAttribute(this.domSelectors.widgetId),
    )
    // replace with widgets for dashboard layout
    const newLayout = layoutHashIds
      .map((wid) => {
        const w = this.activeLayout.value.find(w => w.hashId.value === wid)
        if (!w)
          return undefined
        return w.toPortable()
      })
      .filter(Boolean) as PortableWidget[]

    this.activeDashboard.value.layout = newLayout
  }

  activeDashboardId = this.utils.vue.computed(() => {
    const route = this.factorRouter.router.currentRoute.value

    const routeDashboardId = route.params.dashboardId as string | undefined
    const metaDashboardId = route.meta.dashboardId as string | undefined
    const dashboardId
      = routeDashboardId
      || metaDashboardId
      || this.manualDashboardId.value
      || 'home'

    return dashboardId
  })

  getWidgetUrl(protocol: 'http' | 'ws' = 'http'): vue.Ref<string> {
    return this.utils.vue.computed(() => {
      let url
        = this.isLive.value && this.widgetLiveUrl
          ? this.widgetLiveUrl
          : `http://localhost:${this.widgetPort}`

      if (protocol === 'ws' && url)
        url = url?.replace('http', 'ws')

      return url
    })
  }

  addSchema() {
    this.factorEnv.addHook({
      hook: 'staticSchema',
      callback: async (existing) => {
        const dashboardKeys = this.dashboards.map(d => d.dashboardId).sort()
        const widgetKeys = this.widgets.map(d => d.widgetKey).sort()

        return {
          ...existing,
          dashboards: { enum: dashboardKeys, type: 'string' },
          widgets: { enum: widgetKeys, type: 'string' },
        }
      },
    })
  }

  addWidgets(widgets: Widget[]) {
    this.widgets = [...this.widgets, ...widgets]
  }

  addDashboards(dashboards: Dashboard[]) {
    this.dashboards = [...this.dashboards, ...dashboards]
  }

  addToDashboard(opts: { layout: PortableWidget[], dashboardId: string }) {
    const { dashboardId, layout } = opts

    this.hooks.push({
      hook: 'dashboards',
      callback: async (dashboards) => {
        const dashboard = dashboards.find(d => d.dashboardId === dashboardId)

        if (dashboard)
          dashboard.layout = this.utils.deepMergeAll([dashboard.layout, layout])

        return dashboards
      },
    })
  }

  protected createQueries() {
    const deps = {
      factorDashboard: this,
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      factorServer: this.factorServer,
    }
    return {
      ManageCustomDashboard: new QueryManageCustomDashboard(deps),
    } as const
  }

  getWidgetDefinition = (widgetKey: string): Widget | undefined => {
    const defs = this.widgets

    return defs?.find(def => def.widgetKey === widgetKey)
  }

  activeProjectDashboards = this.utils.vue.computed<DashboardSettings[]>(() => {
    const project = this.factorUser.activeOrganization.value
    const projectDashboards = project?.dashboards ?? {}

    return Object.values(projectDashboards).filter(
      Boolean,
    ) as DashboardSettings[]
  })

  activeDashboards = this.utils.vue.computed<Dashboard[]>({
    get: () => {
      const dashboards = [...this.dashboards]

      const userDashboards = this.activeProjectDashboards.value

      if (userDashboards.length) {
        userDashboards.forEach((d) => {
          const existing = dashboards.findIndex(
            v => v.dashboardId === d?.dashboardId,
          )

          if (existing > -1) {
            const orig = dashboards[existing]
            dashboards[existing] = new Dashboard({ ...orig.settings, ...d })
          }
          else {
            dashboards.push(new Dashboard(d))
          }
        })
      }

      return dashboards
    },
    set: (v) => {
      const project = this.factorUser.activeOrganization.value

      if (project) {
        const dashboards = Object.fromEntries(v.map(d => [d.dashboardId, d]))

        this.factorUser.activeOrganization.value = {
          ...project,
          dashboards,
        }
      }
    },
  })

  activeDashboard = this.utils.vue.computed<Dashboard>({
    get: () => {
      const id = this.activeDashboardId.value

      const activeDashboard = this.activeDashboards.value.find(
        d => d.dashboardId === id,
      )

      return activeDashboard || this.activeDashboards.value[0]
    },
    set: (value) => {
      if (!value)
        return

      const existing = this.activeDashboards.value.findIndex(
        v => v.dashboardId === value?.dashboardId,
      )

      const active = this.activeDashboards.value

      if (existing > -1)
        active[existing] = Object.assign(active[existing], value)

      this.activeDashboards.value = active
    },
  })

  activeLayout = this.utils.vue.computed<ClientWidget[]>(() => {
    const activeDashboard = this.activeDashboard.value
    const layout = activeDashboard?.layout ?? []
    return layout
      .map((w) => {
        const configWidget = this.getMergedWidgetConfig(w)
        if (!configWidget)
          return []

        const clientWidget = new ClientWidget({
          factorUser: this.factorUser,
          ...configWidget,
        })

        const hashId = clientWidget.hashId.value
        /**
         * If widget is already loaded, use it
         * Retain any state/data
         */
        if (this.clientWidgets[hashId]) {
          return this.clientWidgets[hashId]
        }
        else {
          this.clientWidgets[hashId] = clientWidget

          return clientWidget
        }
      })
      .filter(Boolean) as ClientWidget[]
  })

  addNewWidgetToDashboard = (
    dashboardId: string,
    widgetConfig: PortableWidget,
  ): void => {
    const active = this.activeDashboards.value
    const existingInd = active.findIndex(d => d.dashboardId === dashboardId)

    const dashboard = existingInd > -1 ? active[existingInd] : undefined

    if (!dashboard)
      return

    dashboard.layout = [widgetConfig, ...(dashboard.layout ?? [])]

    active[existingInd] = dashboard

    this.activeDashboards.value = active
  }

  requestManageDashboard = async (
    params: CustomDashboardParams,
  ): Promise<ManageDashboardReturn> => {
    const r = await this.requests.ManageCustomDashboard.projectRequest(params)
    const { _action } = params
    const dashboardLayout = r.data

    if (r.status === 'success' && dashboardLayout) {
      const existingIndex = this.activeDashboards.value.findIndex(
        d => d.dashboardId === dashboardLayout.dashboardId,
      )
      if (_action === 'delete') {
        this.activeDashboards.value.splice(existingIndex, 1)
      }
      else if (_action === 'create' || _action === 'update') {
        const dash = new Dashboard(dashboardLayout)
        if (existingIndex > -1)
          this.activeDashboards.value[existingIndex] = dash
        else
          this.activeDashboards.value.push(dash)
      }
    }

    return r
  }

  widgetMap = (): Record<string, Widget> => {
    return Object.fromEntries(this.widgets?.map(w => [w.widgetKey, w]))
  }

  getWidgetByKey = (key: string): Widget | undefined => {
    const map = this.widgetMap()

    const widget = this.widgetMap()[key]

    if (!widget) {
      this.log.error(`getWidgetByKey: widgetKey missing: ${key}`, {
        data: { map },
      })
      return
    }

    return widget
  }

  getMergedWidgetConfig(portable: PortableWidget): WidgetConfig | undefined {
    const standard = this.getWidgetByKey(portable.widgetKey)

    if (!standard) {
      this.log.error(
        `getMergedWidgetConfig: widgetKey missing: ${portable.widgetKey}`,
      )
      return
    }

    /**
     * Deep merge can't handle classes and complicated objects
     */
    const merged = this.utils.deepMergeAll<WidgetConfig>([
      standard.toPortable(),
      portable,
    ])

    merged.el = standard.el
    merged.queryHandler = standard.queryHandler

    return merged
  }

  async manageDashboard(_action: 'delete' | 'update'): Promise<void> {
    if (_action === 'delete') {
      const confirmed = confirm('Are you sure?')

      if (confirmed) {
        this.sending.value = 'delete'
        const { dashboardId, dashboardType } = this.activeDashboard.value
        const r = await this.requestManageDashboard({
          _action,
          dashboardId,
        })

        this.sending.value = false
        if (r.status === 'success') {
          if (dashboardType === 'user')
            await this.factorRouter.router.push('/')
          else location.reload()
        }
      }
    }
    else if (_action === 'update') {
      this.sending.value = 'save'

      const { dashboardId, layout } = this.activeDashboard.value

      const r = await this.requestManageDashboard({
        _action,
        dashboardId,
        layout,
      })

      if (r.status === 'success')
        this.editMode.value = 'off'
    }
    this.sending.value = false
  }

  manageWidget(_action: 'add' | 'update', w: PortableWidget): void {
    const current = this.activeDashboard.value

    let newLayout: PortableWidget[] = []

    const currentLayout = current.layout || []

    if (_action === 'add') {
      newLayout = [w, ...currentLayout]
    }
    else if (_action === 'update') {
      newLayout = currentLayout.map((l) => {
        return l.hashId === w.hashId ? w : l
      })
    }

    current.layout = newLayout
    this.activeDashboard.value = current
  }

  editWidget(widgetConfig: ClientWidget): void {
    this.editWidgetConfig.value = widgetConfig
    this.editWidgetVisible.value = true
  }

  editActions = this.utils.vue.computed(() => {
    if (this.editMode.value === 'on') {
      return [
        {
          name: 'Cancel',
          onClick: () => (this.editMode.value = 'off'),
        },
        {
          name:
            this.activeDashboard.value.dashboardType === 'core'
              ? 'Reset Dashboard'
              : 'Delete Dashboard',
          onClick: () => this.manageDashboard('delete'),
        },
        {
          name: 'Save Changes',
          onClick: () => this.manageDashboard('update'),
          loading: this.sending.value === 'save',
        },
      ]
    }
    else {
      return [
        { name: 'Edit Dashboard', onClick: () => (this.editMode.value = 'on') },
        {
          name: 'Add New Dashboard',
          onClick: () => (this.newPanel.value = true),
        },
      ]
    }
  })
}
