import type {
  PassedEventFields,
  ReplayDataRecord,
  SessionFields,
  TrackingDataRecord,
} from '@kaption/engine/session'

export type CustomEventParams<T> = T extends 'beginSession'
  ? { clientId: string, sessionId: string }
  : T extends 'trackingData'
    ? TrackingDataRecord
    : T extends 'replayData'
      ? ReplayDataRecord
      : T extends 'expireSession'
        ? SessionFields
        : T extends 'saveEvents'
          ? { events: PassedEventFields[], pubId: string }
          : unknown
