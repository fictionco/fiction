import { getProjectIdFromTracker } from '@kaption/browser-utils'

import { KaptionClient } from '@kaption/client'

export const client = new KaptionClient(getProjectIdFromTracker())
