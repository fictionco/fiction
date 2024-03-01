import { useService } from '@factor/api'
import type { ServiceContainer } from '@kaption/app'

export function useKaption(): ServiceContainer {
  const service = useService<ServiceContainer>()

  return { ...service }
}
