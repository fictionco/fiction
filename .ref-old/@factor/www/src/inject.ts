import { useService } from "@factor/api"
import type { ServiceContainer } from "."

export const useFactorService = () => {
  return useService<ServiceContainer>()
}
