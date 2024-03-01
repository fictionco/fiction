import type { EndpointResponse, MessageDictionary } from '@kaption/types'
import { onEvent } from './__events'

export function createSocketMessage<T extends keyof MessageDictionary>(eventName: T, data: MessageDictionary[T]): string {
  return JSON.stringify([eventName, data])
}

export function onServerNotify<T extends keyof MessageDictionary>(eventName: T, cb: (data: EndpointResponse<MessageDictionary[T]>) => void): void {
  onEvent(`notify:${eventName}`, cb)
}
