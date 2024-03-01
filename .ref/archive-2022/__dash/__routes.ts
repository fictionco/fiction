export default {}
// import { RouteLocation } from "vue-router"
// import { RouteDictionary } from "@kaption/engine/activeRoutes"
// import { MenuItem } from "@factor/types"

// export type DashboardRouteKey =
//   | "reports"
//   | "realtime"
//   | "results"
//   | "heatmaps"
//   | "replay"

// const isActive = ({
//   route,
//   menuItem,
// }: {
//   route: RouteLocation
//   menuItem: MenuItem
// }): boolean => {
//   return route.params.dashboardId === menuItem.key
// }
// export const routes: RouteDictionary<DashboardRouteKey> = {
//   realtime: {
//     name: "Realtime",
//     path: "/project/:projectId/dash/realtime",
//     icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M15.7123 15.8995C16.1998 15.4352 16.5865 14.884 16.8504 14.2774C17.1142 13.6708 17.25 13.0206 17.25 12.364C17.25 11.0379 16.6969 9.76611 15.7123 8.82843M8.28769 15.8995C7.80018 15.4352 7.41347 14.884 7.14963 14.2774C6.8858 13.6708 6.75 13.0206 6.75 12.364C6.75 11.0379 7.30312 9.76611 8.28769 8.82843" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M18.364 18.7279C19.1997 17.8922 19.8626 16.9 20.3149 15.8081C20.7672 14.7162 21 13.5459 21 12.364C21 9.97701 20.0518 7.68783 18.364 6M5.63604 18.7279C4.80031 17.8922 4.13738 16.9 3.68508 15.8081C3.23279 14.7162 3 13.5459 3 12.364C3 9.97701 3.94821 7.68783 5.63604 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M14 12.364C14 12.6266 13.9483 12.8867 13.8478 13.1293C13.7472 13.372 13.5999 13.5925 13.4142 13.7782C13.2285 13.9639 13.008 14.1112 12.7654 14.2117C12.5227 14.3122 12.2626 14.364 12 14.364C11.7374 14.364 11.4773 14.3122 11.2346 14.2117C10.992 14.1112 10.7715 13.9639 10.5858 13.7782C10.4001 13.5925 10.2528 13.372 10.1522 13.1293C10.0517 12.8867 10 12.6266 10 12.364C10 11.8335 10.2107 11.3248 10.5858 10.9498C10.9609 10.5747 11.4696 10.364 12 10.364C12.5304 10.364 13.0391 10.5747 13.4142 10.9498C13.7893 11.3248 14 11.8335 14 12.364Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//     </svg>`,
//     isActive,
//   },
//   reports: {
//     name: "Reports",
//     path: "/project/:projectId/dash/reports",
//     icon: `<svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M3 14.5H21M12 19.5V9.5M12 19.5H5C4.46957 19.5 3.96086 19.2893 3.58579 18.9142C3.21071 18.5391 3 18.0304 3 17.5V9.5M12 19.5H19C19.5304 19.5 20.0391 19.2893 20.4142 18.9142C20.7893 18.5391 21 18.0304 21 17.5V9.5M3 9.5V6.5C3 5.96957 3.21071 5.46086 3.58579 5.08579C3.96086 4.71071 4.46957 4.5 5 4.5H19C19.5304 4.5 20.0391 4.71071 20.4142 5.08579C20.7893 5.46086 21 5.96957 21 6.5V9.5M3 9.5H12M21 9.5H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
//     </svg>`,
//     isActive,
//   },
//   results: {
//     name: "Results",
//     path: "/project/:projectId/dash/results",
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
//   </svg>`,
//     isActive,
//   },
//   heatmaps: {
//     name: "Heatmaps",
//     path: "/project/:projectId/dash/heatmaps",
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
//   </svg>`,
//     isActive,
//   },
//   replay: {
//     name: "Session Replay",
//     path: "/project/:projectId/dash/replay",
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
// <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// </svg>`,
//     isActive,
//   },
// }
