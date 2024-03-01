/** server-only-file */
import type { FactorPluginConfigServer } from '@factor/types'
import { getEndpointsMap } from '../@suites/events/endpointuite-events/endpoint'

export function setup(): FactorPluginConfigServer {
  return {
    name: 'customEvents',
    routes: [],
    endpoints: [...Object.values(getEndpointsMap())],
    plugins: [],
    hooks: [],
    userProcessors: [],
  }
}
