export default {}
// import { log, _stop } from "@factor/api"
// import { SocketMeta } from "@factor/api/engine/socket"
// import type { QueryWidget, QueryParams } from "@kaption/core/utils"
// import { WidgetServerEventMap } from "@kaption/core/utils"
// import { getWidgetByKey } from "./widgetConfig"

// export const buildQueries = async (
//   params: QueryParams,
// ): Promise<QueryWidget[]> => {
//   const { layout, mode } = params

//   const queryList: QueryWidget[] = []

//   layout?.forEach((widgetConfig) => {
//     const { widgetKey, widgetId = "" } = widgetConfig

//     const widget = getWidgetByKey(widgetKey)

//     // don't make realtime that aren't needed
//     if (mode === "realtime" && !widget?.realtime) {
//       return
//     } else if (widget?.queryHandler) {
//       const queryHandler = widget.queryHandler()

//       queryHandler.addWidgetIds([widgetId])

//       // is the query object already added
//       // only run query once per key
//       const exists = queryList.find((q) => q.key === queryHandler.key)

//       if (!exists) {
//         queryHandler.updateParams(params)
//         queryList.push(queryHandler)
//       }
//     }
//   })

//   log.info("buildQueries", `${queryList.length} query`)

//   return queryList
// }

// export const runLayoutQuery = async (
//   params: QueryParams,
//   meta: SocketMeta<WidgetServerEventMap, "layout">,
// ): Promise<void> => {
//   // If no layout, send empty response
//   if (!params.layout || params.layout.length === 0) {
//     meta.respond({ status: "success" })
//   }

//   const queryList = await buildQueries(params)

//   // detach async
//   Object.values(queryList).forEach(async (q) => {
//     const r = await q.run()
//     meta.respond(r)
//   })

//   return
// }
