import type { ConnectionConfig, TrackingResponseData } from '@kaption/service/fields'
import { ensureClientId } from './utils'
import { getSocketSession, updateSocketSession } from './cacheStore'
import { sendMessageToClient } from './cachePubsub'
import { getConnectedProject } from './cacheProject'

/**
 * Initialize session handling on socket connection
 * @note this runs inside of the ingest service
 */
export async function onConnection(method: 'http' | 'socket', config: ConnectionConfig): Promise<TrackingResponseData | undefined> {
  const { projectId, ip } = config

  let { clientId } = config

  clientId = ensureClientId({ clientId, ip, projectId })

  const site = await getConnectedProject({ projectId, config })
  const { trackingEligible, replayEligible, details } = site ?? {}

  const responseData: TrackingResponseData = {
    trackingEligible,
    replayEligible,
    details,
  }

  if (method === 'socket') {
    if (trackingEligible) {
      let socketSession = await getSocketSession(clientId)

      if (!socketSession) {
        responseData.sessionStatus = 'begin'
        socketSession = { clientId, timestamp: new Date().toISOString() }
        await updateSocketSession(clientId, socketSession)
      }
      else {
        responseData.sessionStatus = 'continue'
      }

      responseData.timestamp = socketSession.timestamp
    }
    sendMessageToClient(clientId, {
      status: 'success',
      messageType: 'beginConnection',
      data: responseData,
    })
  }

  return responseData
}
