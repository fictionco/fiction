import type {
  ReplayComponents,
  ReplayDataRecord,
  SocketMessageDataItem,
  TrackingDataRecord,
} from '@kaption/types'
import lodash from 'lodash'
import { ensureClientId, publishEvent } from '@kaption/utils'
import { logger } from '@factor/api'

// Interval buffer for session data
let __trackingDataBuffer: TrackingDataRecord = {}
let __replayDataBuffer: ReplayDataRecord = {}

const THROTTLE_INTERVAL = 1000

/**
 * Throttle messages to reduce congestion in pubsub and processing
 */
const queue = lodash.throttle(
  () => {
    // Publish event with tracking data
    if (__trackingDataBuffer && Object.keys(__trackingDataBuffer).length > 0) {
      publishEvent<'trackingData'>('trackingData', __trackingDataBuffer)

      __trackingDataBuffer = {}
    }
    // Publish event with replay recording data
    if (__replayDataBuffer && Object.keys(__replayDataBuffer).length > 0) {
      publishEvent<'replayData'>('replayData', __replayDataBuffer)

      __replayDataBuffer = {}
    }
  },
  THROTTLE_INTERVAL,
  { leading: false, trailing: true },
)

/**
 * Process raw message data coming over the socket
 */
export function processMessageData(method: 'http' | 'socket', data: SocketMessageDataItem): void {
  const {
    config,
    replayHashes = {},
    replay = [],
    events = [],
    debug = [],
  } = data
  const { ip, projectId } = config
  let { clientId } = config

  clientId = ensureClientId({ clientId, ip, projectId })

  config.clientId = clientId

  if (debug.length > 0) {
    debug.forEach((d) => {
      logger.log({
        level: 'error',
        context: 'tracker',
        description: `client error: ${d.message ?? 'no message'}`,
        data: d.data,
      })
    })
  }

  const trk = __trackingDataBuffer[clientId] ?? {}

  const rep = (__replayDataBuffer[clientId] as ReplayComponents) ?? {}
  __trackingDataBuffer[clientId] = {
    config: { ...trk.config, ...config },
    events: [...(trk.events ?? []), ...events],
  }

  __replayDataBuffer[clientId] = {
    config: { ...rep.config, ...config },
    replayHashes: { ...rep.replayHashes, ...replayHashes },
    replay: [...(rep.replay ?? []), ...replay],
  }

  queue()
}
