import { logServiceStatus } from '@kaption/utils'

import { createEndpointServer } from './endpoint'
import { initializeReporting } from './_reporting'

export * from './base'
export * from './types'
/**
 * Entry point fo module
 */
export async function setup(): Promise<void> {
  const port = Number.parseInt(process.env.PORT ?? '3300')

  await createEndpointServer({ port })

  // start usage reporting for billing
  await initializeReporting()

  // log that server is up
  logServiceStatus({ service: 'query', port })
}
