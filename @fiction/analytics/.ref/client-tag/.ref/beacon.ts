import { debugEndpointUrl } from '@kaption/browser-utils'

import { getConfigSync } from './config'

export function sendDebug(message: string, data?: Record<string, any>): void {
  const clientConfig = getConfigSync()

  if (clientConfig) {
    navigator.sendBeacon(
      debugEndpointUrl(),
      JSON.stringify({
        status: 'error',
        message,
        data: { ...clientConfig, data },
      }),
    )
  }
}
