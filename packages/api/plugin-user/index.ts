import { UserConfig } from "../types"
import { userEndpoints } from "./user"

export const endpoints = [...Object.values(userEndpoints())]

export * from "./user"
export * from "./userClient"
export * from "./userInit"

export const setup = (): UserConfig => {
  return { name: "FactorUser", endpoints }
}
