import { getEndpointsMap as getUserEndpointsMap } from "@factor/engine/user"

export const endpoints = [...Object.values(getUserEndpointsMap())]
