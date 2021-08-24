import { EventEmitter } from "events"

const __globalEvent = new EventEmitter()

export const emitEvent = (event: string, ...data: unknown[]): void => {
  __globalEvent.emit(event, ...data)
}

export const onEvent = (
  event: string,
  callback: (...args: any[]) => void,
): void => {
  __globalEvent.on(event, callback)
}
