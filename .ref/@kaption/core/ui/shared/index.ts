import type { KaptionClient } from '@kaption/client'
import { createClient } from '@kaption/client'
import type { ServiceConfig } from '@factor/api'
import { safeDirname } from '@factor/api'

let __kaptionClient: KaptionClient
export function getTrackingClient(): KaptionClient {
  const projectId = ''
  if (!__kaptionClient && projectId)
    __kaptionClient = createClient(projectId)

  return __kaptionClient
}

export function setup(): ServiceConfig {
  return { paths: [safeDirname(import.meta.url)] }
}
