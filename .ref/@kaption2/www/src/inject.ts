import { useService } from '@factor/api'
import type { ServiceContainer } from '.'

export function useSiteService() {
  return useService<ServiceContainer>()
}
