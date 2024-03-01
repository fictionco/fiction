export default {}
// import { fastHash, getRouter, stored, storeItem, toLabel } from "@factor/api"
// import { activeProject, activeProjectId } from "@kaption/core/utils"
// import { computed, Component, defineAsyncComponent } from "vue"
// import { Widget, WidgetConfigUser } from "../utils"
// import { CustomDashboardParams, ManageDashboardReturn } from "./endpoint"
// import { DashboardLayout } from "./types"
// import { getWidgetByKey } from "./widgetConfig"
// import type { KaptionDashboard } from "."

// export const getConfigWidgets = (): Widget[] | undefined => {
//   const widgets = serviceConfigSetting("widgets")
//   return widgets
// }

// export const getWidgetDefinition = (widgetKey: string): Widget | undefined => {
//   const defs = getConfigWidgets()

//   return defs?.find((def) => def.key === widgetKey)
// }

// const getConfigDashboardsRaw = (): DashboardLayout[] => {
//   return serviceConfigSetting("dashboards") || []
// }

// export const getConfigDashboards = (): Record<string, DashboardLayout> => {
//   const list = getConfigDashboardsRaw()
//   const entries = list.map((d) => {
//     return [
//       d.dashboardId,
//       { ...d, dashboardName: d.dashboardName || toLabel(d.dashboardId) },
//     ] as const
//   })
//   const config = Object.fromEntries<DashboardLayout>(entries)
//   return config
// }

// export const activeProjectDashboards = computed<DashboardLayout[]>(() => {
//   const projectDashboards = activeProject.value?.dashboards ?? {}
//   return Object.values(projectDashboards).filter(Boolean) as DashboardLayout[]
// })
// /**
//  * Add widgetIds based on hash of their config and projectId
//  */
// const addWidgetIds = (layout?: WidgetConfigUser[]): WidgetConfigUser[] => {
//   if (!layout) return []

//   return layout.map((config: WidgetConfigUser): WidgetConfigUser => {
//     // don't hash with widgetId inside, causes mismatch
//     delete config.widgetId

//     const widgetId = fastHash({ ...config, projectId: activeProjectId.value })
//     return { ...config, widgetId }
//   })
// }

// const activeCustomizedDashboards = computed({
//   get: () => {
//     return stored<Record<string, DashboardLayout | null>>(
//       "customizedDashboards",
//     )
//   },
//   set: (v) => {
//     storeItem("customizedDashboards", {
//       ...stored<Record<string, DashboardLayout | null>>("customizedDashboards"),
//       ...v,
//     })
//   },
// })

// export const activeDashboards = computed<
//   Record<string, DashboardLayout | null>
// >({
//   get: () => {
//     const dashboards = activeProject.value?.dashboards ?? {}

//     const compiledDashboards = {
//       ...getConfigDashboards(),
//       ...dashboards,
//       ...activeCustomizedDashboards.value,
//     }

//     const out: Record<string, DashboardLayout> = Object.fromEntries(
//       Object.entries(compiledDashboards)
//         .filter(([_id, dashboard]) => dashboard)
//         .map(([_id, dashboard]) => {
//           const d = dashboard as DashboardLayout
//           d.layout = addWidgetIds(d.layout)
//           return [_id, d]
//         }),
//     )

//     return out
//   },
//   set: (v) => {
//     activeCustomizedDashboards.value = v
//   },
// })

// const getActiveDashboardId = (): string => {
//   const routeParams = getRouter().currentRoute.value.params
//   const dashboardId = routeParams.dashboardId as string | undefined

//   const id = dashboardId || "home"

//   return id
// }
// export const activeDashboard = computed<DashboardLayout | null>({
//   get: () => {
//     return activeDashboards.value[getActiveDashboardId()]
//   },
//   set: (v) => {
//     activeCustomizedDashboards.value = { [getActiveDashboardId()]: v }
//   },
// })

// export const activeDashboardPageComponent = computed<Component>(() => {
//   const comp = activeDashboard.value?.pageComponent as Component

//   return comp
//     ? comp
//     : defineAsyncComponent(() => import(`./app/DashboardPage.vue`))
// })

// export const activeLayout = computed<WidgetConfigUser[]>(() => {
//   const layout = activeDashboard.value?.layout ?? []
//   return layout
//     .map((w) => {
//       const theWidget = getWidgetByKey(w.widgetKey)
//       if (!theWidget) return

//       return { ...theWidget.getConfig(), ...w }
//     })
//     .filter(Boolean) as WidgetConfigUser[]
// })

// export const activeLayoutWithData = computed<WidgetConfigUser[]>(() => {
//   return activeLayout.value.map((w) => {
//     return { ...w, ...stored<WidgetConfigUser>(w.widgetId) }
//   })
// })

// export const addWidgetToDashboard = (
//   dashboardId: string,
//   widgetConfig: WidgetConfigUser,
// ): void => {
//   const dashboard = activeDashboards.value[dashboardId]

//   if (!dashboard) return

//   const layout = dashboard?.layout ?? []
//   activeDashboards.value = {
//     [dashboardId]: {
//       ...dashboard,
//       layout: [widgetConfig, ...layout],
//     },
//   }
// }

// // export const addWidgetToCurrentDashboard = (
// //   widgetConfig: WidgetConfigUser,
// // ): void => {
// //   addWidgetToDashboard(activeDashboard.value.dashboardId, widgetConfig)
// // }

// export const requestManageDashboard = async (
//   kaptionDashboard: KaptionDashboard,
//   params: CustomDashboardParams,
// ): Promise<ManageDashboardReturn> => {
//   const r =
//     await kaptionDashboard.requests.ManageCustomDashboard.projectRequest(params)

//   const { _action } = params
//   const dashboard = r.data

//   if (r.status === "success" && dashboard) {
//     if (_action === "delete") {
//       activeDashboards.value = { [params.dashboardId]: null }
//     } else if (_action === "create" || _action === "update") {
//       activeDashboards.value = { [dashboard.dashboardId]: dashboard }
//     }
//   }

//   return r
// }
