import { EventEmitter } from 'node:events'

const __globalEvent = new EventEmitter()

export function emitEvent(event: string, ...data: unknown[]): void {
  __globalEvent.emit(event, ...data)
}

export function onEvent(event: string, callback: (...args: any[]) => void): void {
  __globalEvent.on(event, callback)
}
