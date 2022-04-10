import events from "events"
import { logger } from "./logger"
import { getGlobal, setGlobal } from "./global"

const getGlobalEventBus = (): NodeJS.EventEmitter => {
  let eventBus: NodeJS.EventEmitter | undefined = getGlobal("eventBus")
  if (!eventBus) {
    eventBus = new events.EventEmitter()
    eventBus.setMaxListeners(50)
    setGlobal("eventBus", eventBus)
  }

  return eventBus
}
/**
 * Emits an event which can be listened to from onEvent
 */
export const emitEvent = (event: string, ...data: unknown[]): void => {
  getGlobalEventBus().emit(event, ...data)
  logger.log({
    level: "info",
    context: "emitEvent",
    description: `new event: ${event}`,
    data,
  })
}
/**
 * Listens for an event emitted by emitEvent
 */
export const onEvent = (
  event: string,
  callback: (...args: any[]) => void,
): NodeJS.EventEmitter => {
  return getGlobalEventBus().on(event, callback)
}
/**
 * Removes an event
 */
export const removeEvent = (
  event: string,
  callback: (...args: any[]) => void,
): void => {
  getGlobalEventBus().off(event, callback)
}
