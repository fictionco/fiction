import { vue } from "./utils"
import { ServiceList } from "./plugin-env"

export const useService = <T extends ServiceList>(): T => {
  const service = vue.inject<T>("service")

  if (!service) throw new Error("service for injection not found")

  return service
}
