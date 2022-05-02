import { Component, inject } from "vue"
import { ServiceConfig } from "./plugin-env"

export const useService = <T extends ServiceConfig["service"]>(): T => {
  const service = inject<T>("service")

  if (!service) throw new Error("service for injection not found")

  return service
}

export const useUi = <T extends Record<string, Component>>(): T => {
  const ui = inject<T>("ui")

  if (!ui) throw new Error("ui for injection not found")

  return ui
}
