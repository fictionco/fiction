import { endpoints as userEndpoints } from "./user/serverUser"

export const endpoints = [...userEndpoints]

// export const mapTypeHelper = <T extends Record<string, any>>(map: T): T => {
//   for (const key in map) {
//     map[key as keyof T].methodName = key
//   }

//   return map
// }

// export const endpointMap = mapTypeHelper(endpoints)
