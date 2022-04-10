import { userEndpoints } from "../engine/user"

export const endpoints = [...Object.values(userEndpoints())]
