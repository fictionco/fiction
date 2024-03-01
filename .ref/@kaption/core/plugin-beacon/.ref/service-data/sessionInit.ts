import type { EventConfig, TrackingComponents } from '@kaption/service/fields'
import {
  getExitEvent,
  getMemorySession,
  getStore,
  updateMemoryPageStats,
  updateMemorySession,
} from './cacheStore'
import { initializeExpiryLoop } from './sessionExpiry'
import { getUpdatedSession, saveEvents } from './sessionParse'

export async function refineTrackedEvents(clientId: string, events: EventConfig[]): Promise<EventConfig[]> {
  const out: EventConfig[] = []

  for (const ev of events) {
    if (ev.eventName === 'stat') {
      await updateMemoryPageStats(clientId, ev)
    }
    else if (ev.eventName === 'view') {
      const exitEvent = await getExitEvent(clientId)
      if (exitEvent)
        out.push(exitEvent)

      out.push(ev)
    }
    else {
      out.push(ev)
    }
  }
  return out
}

/**
 * Process batched data arriving over the socket created queue
 */
export async function processClientData(dataItem: TrackingComponents): Promise<void> {
  const { config, events } = dataItem
  const { clientId, projectId } = config
  const memorySession = await getMemorySession(clientId)

  if (memorySession) {
    const session = await getUpdatedSession(memorySession, { config, events })

    const trackedEvents = await refineTrackedEvents(clientId, events)

    if (trackedEvents && trackedEvents.length > 0) {
      await saveEvents({
        projectId,
        memorySession,
        session,
        events: trackedEvents,
      })
    }

    // do this last in case changes are saved to session
    await updateMemorySession(clientId, session)
  }
}
/**
 * Set up globals and ensure that active sessions are in memory
 */
export async function initializeSessions(): Promise<void> {
  await Promise.all([getStore(), initializeExpiryLoop()])
}
