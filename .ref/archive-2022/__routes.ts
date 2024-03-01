import { routes as AdminRoutes } from '@kaption/app/src/routes'
import { routes as EventRoutes } from '@kaption/suite-events/routes'

export const routes = [...AdminRoutes, ...EventRoutes]
