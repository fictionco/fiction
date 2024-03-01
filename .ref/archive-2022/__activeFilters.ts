export default {}
// import { getRouter } from "@factor/api"
// import { computed } from "vue"
// import { EventFieldMap } from "../fields"

// export const activeAnalyticsFilters = computed<
//   { name: string; value: string }[]
// >(() => {
//   const q = getRouter().currentRoute.value.query
//   const out: { name: string; value: string }[] = []
//   Object.keys(q).forEach((param) => {
//     if (param && Object.keys(EventFieldMap).includes(param)) {
//       const v = q[param] as string
//       const value = decodeURIComponent(v)
//       out.push({ name: param, value })
//     }
//   })
//   return out
// })
