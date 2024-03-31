import { events } from './nodeLib'

let eventBus: NodeJS.EventEmitter | undefined
function getGlobalEventBus(): NodeJS.EventEmitter {
  if (!eventBus) {
    eventBus = new events.EventEmitter()
    eventBus.setMaxListeners(100)
  }

  return eventBus
}

/**
 * Emits an event which can be listened to from onEvent
 */
export function emitEvent(event: string, ...data: unknown[]): void {
  getGlobalEventBus().emit(event, ...data)
  // log.debug("emitEvent", `new event: ${event}`, { data })
}
/**
 * Listens for an event emitted by emitEvent
 */
export function onEvent(event: string, callback: (...args: any[]) => void): NodeJS.EventEmitter {
  return getGlobalEventBus().on(event, callback)
}
/**
 * Removes an event
 */
export function removeEvent(event: string, callback: (...args: any[]) => void): void {
  getGlobalEventBus().off(event, callback)
}
