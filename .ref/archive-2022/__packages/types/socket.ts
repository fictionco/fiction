import type { TrackingResponseData } from '../../@core/service-utils/dataTypes'

export interface MessageDictionary {
  activeConfig: { trackingEligible?: boolean, replayEligible?: boolean }
  expireSession: { sessionId: string, clientId: string }
  beginSession: TrackingResponseData
  beginConnection: TrackingResponseData
  trackingError: void
  restartRecording: void
  stopRecording: void
}
