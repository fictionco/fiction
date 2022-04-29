import { inject } from "vue"
import { FactorPlugin } from "./plugin"

export const useService = <
  T extends Record<string, FactorPlugin | string>,
>(): T => {
  const service = inject<T>("service")

  if (!service) throw new Error("service not found")

  return service
}
